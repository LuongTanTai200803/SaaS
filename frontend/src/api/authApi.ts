// src/api/authApi.ts
import ht from './axiosClient';

export const authApi = {
  register: (userData: any) => {
    return ht.post('/auth/register', userData);
  },
  login: (credentials: any) => {
    return ht.post('/auth/login', credentials);
  },
  logout: () => {
    return ht.post('/auth/logout');
  },
  forgotPassword: (email: string) => {
    return ht.post('/auth/forgot-password', { email });
  },
  verifyEmail: (token: string) => {
    const url = `/auth/verify-email?token=${token}`;
    return ht.get(url);
  },
};

export type LoginResponse = {
  success: boolean;
  message: string;
  token?: string;
  data?: { token?: string };
};