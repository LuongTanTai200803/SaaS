// src/api/fileApi.ts
import ht from './axiosClient';

export type FileCategory = 'INPUT_DIRECTIVE' | 'EVIDENCE' | 'CONTENT' | 'TEMPLATE' | 'RELATED' | 'LEGAL';

export type UploadFileResponse = {
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  category?: FileCategory;
};

export const fileApi = {
  uploadFiles: (formData: FormData, onUploadProgress?: (progressEvent: any) => void) => {
    return ht.post<UploadFileResponse>('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
  },
  deleteFile: (fileId: string) => {
    const url = `/files/${fileId}`;
    return ht.delete(url);
  },
  getFiles: (params?: any) => {
    return ht.get('/files', { params });
  },
  exportWordDraft: (payload: any) => {
    return ht.post('/ai/exporter/export', payload, { responseType: 'blob' });
  },
};