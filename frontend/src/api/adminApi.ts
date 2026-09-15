import axiosClient from './axiosClient';

export interface AdminApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  errorType: string | null;
}

export interface AdminTopAssistant {
  assistantId: number;
  name: string;
  totalTokens: number;
  creditsConsumed: number;
  usagePercent: number;
}

export interface AdminDashboard {
  userCount: number;
  activeUserCount: number;
  transactionCount: number;
  aiUsageCount: number;
  creditsConsumed: number;
  revenueToday: number;
  revenueMonth: number;
  asOfDate: string;
}

export interface AdminUser {
  userId: string;
  email: string;
  packageType: string;
  expireDate: string | null;
  creditsRemaining: number;
  status: string;
}

export interface UpdateAdminUserRequest {
  packageType?: string;
  expireDate?: string | null;
  credits?: number;
  status?: string;
}

export interface AdminPackage {
  id: number;
  packageType: string;
  packageCategory: string;
  price: number;
  creditLimit: number;
  duration: number;
  description: string;
  storageQuotaMb: number;
  badge?: string | null;
  isActive?: boolean;
}

export interface UpdateAdminPackageRequest {
  price?: number;
  creditLimit?: number;
  duration?: number;
  description?: string;
  storageQuotaMb?: number;
  badge?: string | null;
  isActive?: boolean;
}

export interface AdminModelPackage {
  id: number;
  code: string;
  name: string;
  creditRate: number;
  models: string;
  description: string;
  active: boolean;
}

export interface PaymentInvoice {
  invoiceId: string;
  userId: string;
  packageType: string;
  finalAmount: number;
  status: string;
  memoId: string;
  qrCodeUrl?: string | null;
  createdAt: string;
  paymentDate?: string | null;
}

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
export interface AdminRevenueAnalytics {
  range: 'today' | '7days' | '30days';
  from: string;
  to: string;
  totalRevenue: number;
  paidInvoiceCount: number;
}

export interface AdminAiUsageAnalytics {
  range: 'today' | '7days' | '30days';
  from: string;
  to: string;
  transactionCount: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  creditsConsumed: number;
}

export interface AdminApiContract {
  getDashboard: () => Promise<any>;
  getUsers: (params?: { page?: number; size?: number }) => Promise<any>;
  getUser: (userId: string) => Promise<any>;
  updateUser: (
    userId: string,
    data: UpdateAdminUserRequest
  ) => Promise<any>;

  getPackages: () => Promise<any>;
  getPackage: (packageType: string) => Promise<any>;
  updatePackage: (
    packageType: string,
    data: UpdateAdminPackageRequest
  ) => Promise<any>;

  getModelPackages: () => Promise<any>;
  updateModelCreditRate: (
    id: number,
    creditRate: number
  ) => Promise<any>;

  getPaymentInvoices: () => Promise<any>;
  getPaymentInvoice: (invoiceId: string) => Promise<any>;

  getBankConfigs: () => Promise<any>;
  getBankConfigById: (id: number) => Promise<any>;
  createBankConfig: (data: PaymentBankConfigRequest) => Promise<any>;
  updateBankConfig: (
    id: number,
    data: Partial<PaymentBankConfigRequest>
  ) => Promise<any>;
  activateBankConfig: (id: number) => Promise<any>;
  deleteBankConfig: (id: number) => Promise<any>;
  getRevenue: (range: 'today' | '7days' | '30days') => Promise<AdminApiResponse<AdminRevenueAnalytics>>;

  getAiUsage: (range: 'today' | '7days' | '30days') => Promise<AdminApiResponse<AdminAiUsageAnalytics>>;
  getTopAssistants: (
  range: 'today' | '7days' | '30days'
) => Promise<AdminApiResponse<AdminTopAssistant[]>>;

}

export const adminApi: AdminApiContract = {
  // existing methods...
  
  getUsers(params?: { page?: number; size?: number }) {
    return axiosClient.get<AdminApiResponse<AdminUser[]>>(
      '/admin/users',
      { params }
    );
  },

  getUser(userId: string) {
    return axiosClient.get<AdminApiResponse<AdminUser>>(
      `/admin/users/${userId}`
    );
  },

  updateUser(userId: string, data: UpdateAdminUserRequest) {
    return axiosClient.put<AdminApiResponse<AdminUser>>(
      `/admin/users/${userId}`,
      data
    );
  },

  getPackages() {
    return axiosClient.get<AdminApiResponse<AdminPackage[]>>(
      '/admin/packages'
    );
  },

  getPackage(packageType: string) {
    return axiosClient.get<AdminApiResponse<AdminPackage>>(
      `/admin/packages/${encodeURIComponent(packageType)}`
    );
  },

  updatePackage(
    packageType: string,
    data: UpdateAdminPackageRequest
  ) {
    return axiosClient.put<AdminApiResponse<AdminPackage>>(
      `/admin/packages/${encodeURIComponent(packageType)}`,
      data
    );
  },

  getModelPackages() {
    return axiosClient.get<AdminApiResponse<AdminModelPackage[]>>(
      '/admin/ai/model-packages'
    );
  },

  updateModelCreditRate(id: number, creditRate: number) {
    return axiosClient.put<AdminApiResponse<AdminModelPackage>>(
      `/admin/ai/model-packages/${id}/credit-rate`,
      { creditRate }
    );
  },

  getPaymentInvoices() {
    return axiosClient.get<AdminApiResponse<PaymentInvoice[]>>(
      '/admin/payment/invoices'
    );
  },

  getPaymentInvoice(invoiceId: string) {
    return axiosClient.get<AdminApiResponse<PaymentInvoice>>(
      `/admin/payment/invoices/${encodeURIComponent(invoiceId)}`
    );
  },

  // Bank config APIs
  getBankConfigs() {
    return axiosClient.get('/admin/payment/bank-config');
  },

  // Bank config APIs by ID
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
  },
  getDashboard() {
    return axiosClient.get<AdminApiResponse<AdminDashboard>>(
      '/admin/dashboard'
    );
  },

  getRevenue(range) {
    return axiosClient.get<AdminApiResponse<AdminRevenueAnalytics>>(
      '/admin/dashboard/revenue',
      { params: { range } }
    ) as unknown as Promise<AdminApiResponse<AdminRevenueAnalytics>>;
  },

  getAiUsage(range) {
    return axiosClient.get<AdminApiResponse<AdminAiUsageAnalytics>>(
      '/admin/dashboard/ai-usage',
      { params: { range } }
    ) as unknown as Promise<AdminApiResponse<AdminAiUsageAnalytics>>;
  },

  getTopAssistants(range) {
    return axiosClient.get<AdminApiResponse<AdminTopAssistant[]>>(
      '/admin/dashboard/top-assistants',
      { params: { range } }
    ) as unknown as Promise<AdminApiResponse<AdminTopAssistant[]>>;
  },

};