import axiosClient from './axiosClient';

export const adminApi = {
  // Lấy danh sách toàn bộ người dùng (có thể truyền params để phân trang, tìm kiếm)
  getUsers(params?: any) {
    const url = '/admin/users';
    return axiosClient.get(url, { params });
  },

  // Bật/tắt trạng thái hoạt động của một người dùng cụ thể
  toggleUserStatus(userId: string, isActive: boolean) {
    const url = `/admin/users/${userId}/status`;
    return axiosClient.patch(url, { isActive });
  },

  // Lấy dữ liệu cho biểu đồ doanh thu tổng
  getRevenueChart(params?: { startDate: string, endDate: string }) {
    const url = '/admin/revenue-chart';
    return axiosClient.get(url, { params });
  }
};