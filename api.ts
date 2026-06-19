/**
 * Cấu hình gọi API chung cho toàn dự án
 */
export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },
  // Bạn có thể bổ sung post, put, delete tại đây sau
};