import axiosClient from './axiosClient';

export const creditApi = {
  // Quản lý tính toán credit tạm tính dựa trên form wizard
  // payload có thể bao gồm số lượng từ, file đã upload hoặc model đã chọn
  estimateCredits(data: any) {
    const url = '/credits/estimate';
    return axiosClient.post(url, data);
  },

  // Kiểm tra số dư ví (credits) hiện tại của người dùng
  getBalance() {
    const url = '/credits/balance';
    return axiosClient.get(url);
  },

  // Sinh mã VietQR động để nạp tiền (có thể trả về dataURL của QR code)
  generateVietQR(data: { amount: number, description: string }) {
    const url = '/credits/deposit/vietqr';
    return axiosClient.post(url, data);
  }
};