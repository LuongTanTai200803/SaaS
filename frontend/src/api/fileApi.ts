// src/api/fileApi.ts
import ht from './axiosClient';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import type { PackageLevel } from './sessionAPi';

export type FileCategory = 'INPUT_DIRECTIVE' | 'EVIDENCE' | 'CONTENT' | 'TEMPLATE' | 'RELATED' | 'LEGAL';

export type UploadFileResponse = {
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  category?: FileCategory;
};

export interface UploadConfig {
  packageType: string;
  modelPackageLevel: PackageLevel;
  maxFileSize: number;
  maxFiles: number;
  maxText: number;
  allowedExtensions: string[];
  storageQuota: number;
  usedStorage: number;
  remainingStorage: number;
}

export interface SessionFile {
  fileId: string;
  fileName: string;
  extractionStatus: 'PROCESSING' | 'EXTRACTED' | 'FAILED';
  extractionError: string | null;
}

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
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    }),
    
    scanDocumentBatch: (formData: FormData) =>
    ht.post('/files/scan-documents/ai-text', formData, {
      headers: { 'Content-Type': undefined },
    }),

    getUploadConfig: () =>
    ht.get<UploadConfig>('/files/upload/config'),

    getFilesBySession: (sessionUuid: string) =>
    ht.get<SessionFile[]>('/files', {
      params: { sessionUuid },
    }),

    getScanStatus: (fileId: string) =>
  ht.get(`/files/${fileId}/scan-status`),

};