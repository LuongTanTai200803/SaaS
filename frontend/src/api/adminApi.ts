import axiosClient from './axiosClient';

export interface PaymentBankConfigDTO {
  id?: number;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  vaNumber?: string;
  template?: string;
  showInfo?: boolean;
  store?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentBankConfigRequest {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  vaNumber?: string;
  template?: string;
  showInfo?: boolean;
  store?: string;
  isActive?: boolean;
}

export const adminApi = {
  // existing methods...
  getUsers(params?: any) {
    const url = '/admin/users';
    return axiosClient.get(url, { params });
  },

  toggleUserStatus(userId: string, isActive: boolean) {
    const url = `/admin/users/${userId}/status`;
    return axiosClient.patch(url, { isActive });
  },

  getRevenueChart(params?: { startDate: string; endDate: string }) {
    const url = '/admin/revenue-chart';
    return axiosClient.get(url, { params });
  },

  // Bank config APIs
  getBankConfigs() {
    return axiosClient.get('/admin/payment/bank-config');
  },

  getBankConfigById(id: number) {
    return axiosClient.get(`/admin/payment/bank-config/${id}`);
  },

  createBankConfig(data: PaymentBankConfigRequest) {
    return axiosClient.post('/admin/payment/bank-config', data);
  },

  updateBankConfig(id: number, data: Partial<PaymentBankConfigRequest>) {
    return axiosClient.put(`/admin/payment/bank-config/${id}`, data);
  },

  activateBankConfig(id: number) {
    return axiosClient.post(`/admin/payment/bank-config/${id}/activate`);
  },

  deleteBankConfig(id: number) {
    return axiosClient.delete(`/admin/payment/bank-config/${id}`);
  }
};