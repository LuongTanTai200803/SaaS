import { fileApi } from '../api/fileApi';

export type UploadStatus = 'PENDING' | 'UPLOADING' | 'SUCCESS' | 'FAILED';

export interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  backendFileId?: string;
  error?: string;
}

export function uploadFileToServer(
  fileItem: UploadingFile,
  category: 'DIRECTIVE' | 'LEGAL' | 'CONTENT' | 'TEMPLATE' | 'RELATED' | 'EVIDENCE',
  sessionUuid: string | null | undefined,
  fieldCode: string | null | undefined,
  onProgress: (fileId: string, progress: number) => void,
  onStatusChange: (
    fileId: string,
    status: UploadStatus,
    backendFileId?: string,
    error?: string,
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
    .then((response: any) => {
      const payload = response?.data ?? response;
      const backendFileId =
        payload?.fileId ??
        payload?.id ??
        payload?.uuid ??
        `srv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      onStatusChange(fileItem.id, 'SUCCESS', backendFileId, undefined);

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