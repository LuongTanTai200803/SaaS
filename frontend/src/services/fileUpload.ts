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
  onProgress: (fileId: string, progress: number) => void,
  onStatusChange: (
    fileId: string,
    status: UploadStatus,
    backendFileId?: string,
    error?: string,
  ) => void,
) {
  onStatusChange(fileItem.id, 'UPLOADING');

  let progress = 0;
  const step = () => {
    progress += Math.floor(Math.random() * 22) + 15;
    if (progress >= 100) {
      progress = 100;
      onProgress(fileItem.id, progress);
      onStatusChange(fileItem.id, 'SUCCESS', `srv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
      return;
    }

    onProgress(fileItem.id, progress);
    setTimeout(step, 180 + Math.random() * 120);
  };

  setTimeout(step, 120);
}

export async function deleteFileFromServer(fileId: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 200);
  });
}
