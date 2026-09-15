// src/api/index.ts
import { USE_MOCK_API } from '../config/index';

import * as realAuthApi from './authApi';
import * as realUserApi from './userApi';
import * as realFileApi from './fileApi';
import * as realChatApi from './chatApi';
import * as realAiApi from './aiApi';
import * as realAdminApi from './adminApi';
import * as realCreditApi from './creditApi';
import * as realSessionApi from './sessionAPi';

import * as mockApis from './mockApi'; // Đảm bảo mockApis vẫn được import
import { CreditSummary, UpdateProfilePayload, UserProfile } from './userApi';

export const authApi = USE_MOCK_API ? mockApis.authApi : realAuthApi.authApi;

export const fileApi = USE_MOCK_API ? mockApis.fileApi : realFileApi.fileApi;
export const chatApi = USE_MOCK_API ? mockApis.chatApi : realChatApi.chatApi;
export const aiApi = USE_MOCK_API ? mockApis.aiApi : realAiApi.aiApi;
export const adminApi = USE_MOCK_API ? mockApis.adminApi : realAdminApi.adminApi;
export const creditApi = USE_MOCK_API ? mockApis.creditApi : realCreditApi.creditApi;
export const sessionApi = USE_MOCK_API ? mockApis.sessionApi : realSessionApi.sessionApi;

export type UserApiShape = {
  getProfile: () => Promise<UserProfile>;
  updateProfile: (p: UpdateProfilePayload) => Promise<UserProfile>;
  getCreditSummary: () => Promise<CreditSummary>;
  getDocuments: (page: number, size: number) => Promise<{ content: Document[]; total?: number }>;
};

const userApi: UserApiShape = USE_MOCK_API ? mockApis.userApi as unknown as UserApiShape : realUserApi.userApi as UserApiShape;


const api = {
  authApi,
  userApi, // Updated to use the typed userApi
  fileApi,
  chatApi,
  aiApi,
  adminApi,
  creditApi,
  sessionApi,

};

export default api;