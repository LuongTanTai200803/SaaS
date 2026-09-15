import axiosClient from './axiosClient';

export const creditApi = {
  estimateCredits(data: any) {
    const url = '/credits/estimate';
    return axiosClient.post(url, data);
  },

  getBalance() {
    const url = '/credits/balance';
    return axiosClient.get(url);
  },
  createInvoice: async (data: {
  packageType: string;
  durationMonths: number;
}) => ({
  data: {
    invoiceId: `mock-invoice-${Date.now()}`,
    packageType: data.packageType,
    durationMonths: data.durationMonths,
    memoId: 'MOCK-PAYMENT',
    originalAmount: 100000,
    discountAmount: 0,
    finalAmount: 100000,
    qrCodeUrl: 'mock_qr_code_url',
    status: 'PENDING',
  },
  status: 200,
}),

getInvoiceStatus: async (_invoiceId: string) => ({
  data: {
    status: 'PENDING',
  },
  status: 200,
}),


  getPackages() {
    return axiosClient.get('/packages').catch((error) => {
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        return axiosClient.get('/api/packages');
      }
      throw error;
    });
  },

  createInvoice(data: { packageType: string; durationMonths: number }) {
    const payload = {
      packageType: data.packageType,
      durationMonths: data.durationMonths,
    };

    return axiosClient.post('/billing/invoices', payload).catch((error) => {
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        return axiosClient.post('/billing/invoices', payload);
      }
      throw error;
    });
  },

  getInvoiceStatus(invoiceId: string) {
    return axiosClient.get(`/billing/invoices/${invoiceId}/status`);
  },

  generateVietQR(data: { amount: number; description: string }) {
    const url = '/credits/deposit/vietqr';
    return axiosClient.post(url, data);
  }
};