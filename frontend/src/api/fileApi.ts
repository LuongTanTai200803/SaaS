// src/api/fileApi.ts
import ht from './axiosClient';
import axios from 'axios';
import { API_BASE_URL } from '../config';

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
      headers: { 
        // 🎯 ĐÈ LẠI GIÁ TRỊ MẶC ĐỊNH: Bắt Axios nhả quyền cấu hình Content-Type ra cho trình duyệt tự xử
        'Content-Type': undefined },
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
  exportWordDraft: (payload: { sessionUuid: string; exportFormat: string }) =>
    axios.post(`${API_BASE_URL}/export/download`, payload,  {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'ngrok-skip-browser-warning': 'true'
      }
    }),
};