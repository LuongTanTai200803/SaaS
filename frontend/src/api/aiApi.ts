import axiosClient from './axiosClient';

export const aiApi = {
  // Gửi payload form wizard 6 bước để AI bắt đầu quá trình tạo văn bản
  generateCompletion(data: any) {
    const url = '/ai/completions';
    return axiosClient.post(url, data);
  },

  // Lấy lịch sử phiên chat chi tiết để hiển thị trong ChatPro hoặc Panel chỉnh sửa
  getChatHistory(sessionId: string) {
    const url = `/ai/chat-history/${sessionId}`;
    return axiosClient.get(url);
  },

  // Ghim ngữ cảnh (context) từ văn bản hiện tại vào phiên chat cho AI tham chiếu
  pinContext(sessionId: string, data: { documentId: string, content: string }) {
    const url = `/ai/chat-history/${sessionId}/pin`;
    return axiosClient.post(url, data);
  }
};