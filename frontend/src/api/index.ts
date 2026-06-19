// src/api/index.ts
import { USE_MOCK_API } from '../config/index';

import * as realAuthApi from './authApi';
import * as realUserApi from './userApi';
import * as realFileApi from './fileApi';
import * as realChatApi from './chatApi';
import * as realAiApi from './aiApi';
import * as realAdminApi from './adminApi';
import * as realCreditApi from './creditApi';

import * as mockApis from './mockApi'; // Đảm bảo mockApis vẫn được import

export const authApi = USE_MOCK_API ? mockApis.authApi : realAuthApi.authApi;
export const userApi = USE_MOCK_API ? mockApis.userApi : realUserApi.userApi;
export const fileApi = USE_MOCK_API ? mockApis.fileApi : realFileApi.fileApi;
export const chatApi = USE_MOCK_API ? mockApis.chatApi : realChatApi.chatApi;
export const aiApi = USE_MOCK_API ? mockApis.aiApi : realAiApi.aiApi;
export const adminApi = USE_MOCK_API ? mockApis.adminApi : realAdminApi.adminApi;
export const creditApi = USE_MOCK_API ? mockApis.creditApi : realCreditApi.creditApi;

const api = {
  authApi,
  userApi,
  fileApi,
  chatApi,
  aiApi,
  adminApi,
  creditApi,
};

export default api;