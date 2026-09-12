// src/api/userApi.ts
import ht from './axiosClient';

export type UserProfile = {
  userId?: string | number;
  id?: number;
  email: string;
  fullName: string;
  agency: string;
  phone?: string | null;
  position?: string | null;
  created_at?: string | null;
  role?: string | null;
  creditBalance?: number | null;
  packageType?: string | null;
  expireDate?: string | null;
  affiliate: {
    code?: string | null;
    link?: string | null;
    totalEarnings?: number | null;
  };
};

export type UpdateProfilePayload = Partial<UserProfile>;

export interface ApiResponseDTO<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

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

export type CreditSummary = {
  userId: string;
  packageType: string;
  subscriptionExpireDate?: string | null;
  monthly: {
    allocated: number;
    remaining: number;
    cycleStart: string;
    cycleEnd: string;
  };
  purchased: {
    balance: number;
    purchasedAt?: string | null;
    expireAt?: string | null;
  };
};

export type CreditSummaryResponse = {
  success: boolean;
  message: string;
  data: CreditSummary;
  statusCode: number;
  errorType: string | null;
}

export const userApi = {
  getProfile: () => {
    return ht.get<UserProfile>('/users/profile');
  },

  updateProfile: (payload: UpdateProfilePayload) => {
    return ht.put<ApiResponseDTO<UserProfile>>('/users/profile', payload);
  },

  getCreditSummary: () => {
    return ht.get<CreditSummaryResponse>('/users/credit-summary');
  },

  getDocuments: (page: number = 0, size: number = 10) => {
    return ht.get<DocumentsResponse>('/users/documents', { params: { page, size } });
  },
};