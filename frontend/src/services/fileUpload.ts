import { fileApi } from '../api/fileApi';
import { renderPdfToImages } from './pdfRenderer';

export type UploadStatus =
  | 'PENDING'
  | 'UPLOADING'
  | 'EXTRACTING'
  | 'SUCCESS'
  | 'FAILED';

export type ExtractionStatus =
  | 'PROCESSING'
  | 'EXTRACTED'
  | 'FAILED';

export interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  backendFileId?: string;
  error?: string;

  fileName?: string;
  fileSize?: number;
  rawText?: string | null;
  extractionStatus?: ExtractionStatus;
  extractionError?: string | null;
}



export function uploadFileToServer(
  fileItem: UploadingFile,
  category: 'DIRECTIVE' | 'LEGAL' | 'CONTENT' | 'TEMPLATE' | 'RELATED' | 'EVIDENCE' | 'OUTLINE',
  sessionUuid: string | null | undefined,
  fieldCode: string | null | undefined,
  onProgress: (fileId: string, progress: number) => void,
  onStatusChange: (
    fileId: string,
    status: UploadStatus,
    backendFileId?: string,
    error?: string,
  ) => void,
  onExtractionChange?: (
    fileId: string,
    data: {
      fileId: string;
      fileName?: string;
      fileSize?: number;
      rawText?: string | null;
      extractionStatus?: ExtractionStatus;
      extractionError?: string | null;
    }
  ) => void,
) {
  onStatusChange(fileItem.id, 'UPLOADING');

  const formData = new FormData();
  formData.append('file', fileItem.file);

  // Khớp với contract backend bạn đã nêu
  formData.append('category', category);

  if (sessionUuid) {
    formData.append('sessionUuid', sessionUuid);
  }

  if (fieldCode) {
    formData.append('fieldCode', fieldCode);
  }

  return fileApi
    .uploadFiles(formData, (progressEvent: any) => {
      const total = progressEvent?.total ?? fileItem.file.size;
      const percent = total ? Math.round((progressEvent.loaded * 100) / total) : 0;
      onProgress(fileItem.id, percent);
    })
    .then(async (response: any) => {
      const payload = response?.data ?? response;

      const fileId = payload.fileId ?? payload.id ?? payload.uuid;

      if (!fileId) {
        throw new Error('Upload response không có fileId');
      }

      const uploadStatus =
        payload.extractionStatus === 'PROCESSING'
          ? 'EXTRACTING'
          : 'SUCCESS';

      onStatusChange(fileItem.id, uploadStatus, fileId);

      onExtractionChange?.(fileItem.id, {
        fileId,
        fileName: payload.fileName,
        fileSize: payload.fileSize,
        rawText: payload.rawText ?? null,
        extractionStatus: payload.extractionStatus,
        extractionError: payload.extractionError ?? null,
      });

      if (
        payload.extractionStatus === 'PROCESSING' &&
        sessionUuid
      ) {
        const pages = await renderPdfToImages(fileItem.file);

        for (let start = 0; start < pages.length; start += 5) {
          const batch = pages.slice(start, start + 5);
          const isLastBatch = start + batch.length >= pages.length;

          const scanForm = new FormData();

          scanForm.append('fileId', fileId);
          scanForm.append('sessionUuid', sessionUuid);
          scanForm.append('isLastBatch', String(isLastBatch));

          batch.forEach(page => {
            scanForm.append(
              'images',
              page.image,
              `page-${page.pageIndex}.png`
            );

            scanForm.append(
              'pageIndexes',
              String(page.pageIndex)
            );
          });

          const scanResponse =
            await fileApi.scanDocumentBatch(scanForm);

          const scanResult = scanResponse?.data ?? scanResponse;

          if (scanResult.completed === true) {
            onStatusChange(fileItem.id, 'SUCCESS', fileId);

            onExtractionChange?.(fileItem.id, {
              fileId,
              fileName: payload.fileName,
              fileSize: payload.fileSize,
              rawText: scanResult.fullText ?? '',
              extractionStatus: 'EXTRACTED',
              extractionError: null,
            });

            break;
          }
        }
      }
      

      return payload;
    })

    .catch((error: any) => {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Upload failed';

      onStatusChange(fileItem.id, 'FAILED', undefined, message);
      throw error;
    });
}

export async function deleteFileFromServer(fileId: string): Promise<void> {
  try {
    await fileApi.deleteFile(fileId);
  } catch (error) {
    console.error('Delete file failed:', error);
    throw error;
  }
}

