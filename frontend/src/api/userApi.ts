// src/api/userApi.ts
import ht from './axiosClient';

export type UserProfile = {
  id: number;
  email: string;
  fullName: string;
  agency: string;
  role: string;
  creditBalance: number;
  packageType: string;
  expireDate: string;
  affiliate: {
    code: string;
    link: string;
    totalEarnings: number;
  };
};

export type Document = {
  sessionId: number;
  sessionName: string;
  tagId: string;
  updatedAt: string;
  status: string;
  assistantType?: string;
};

export type DocumentsResponse = {
  content: Document[];
  totalPages: number;
  totalElements: number;
};

export const userApi = {
  getProfile: () => {
    return ht.get<UserProfile>('/users/profile');
  },
  getDocuments: (page: number = 0, size: number = 10) => {
    return ht.get<DocumentsResponse>('/users/documents', { params: { page, size } });
  },
};