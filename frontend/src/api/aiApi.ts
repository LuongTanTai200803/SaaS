import axiosClient from './axiosClient';

export interface AiTemplateSubSection {
  code: string;
  tieuDeMuc: string;
  noiDungChiTiet: string;
}

export interface AiTemplateSection {
  code: string;
  tieuDeMuc: string;
  noiDungChiTiet: string;
  tieuMuc: AiTemplateSubSection[];
}

export interface AiDocumentTemplate {
  templateCode: string;
  tenLoaiVanBan: string;
  coQuanBanHanh: string;
  trichYeu: string;
  cauDanChuyenTiep: string;
  cauKetHanhChinh: string;
  doanCanCu: string;
  cacMuc: AiTemplateSection[];
}

export interface AiTemplatesResponse {
  topicCode: string;
  templates: AiDocumentTemplate[];
  invalidTemplates: string[];
}

export const aiApi = {
  // Gửi payload form wizard 6 bước để AI bắt đầu quá trình tạo văn bản
  generateCompletion(data: any) {
    const url = '/ai/completions';
    return axiosClient.post(url, data);
  },
  proofread(data: { sessionUuid: string; text: string }) {
  return axiosClient.post('/ai/proofread', data);
},
getTemplates(topicCode: string) {
  return axiosClient.get<AiTemplatesResponse>('/ai/templates', {
    params: {
      topicCode,
    },
  });
},
selectTemplate(data: {
  sessionUuid: string;
  topicCode: string;
  templateCode: string;
}) {
  return axiosClient.post('/ai/templates/select', data);
},

  // Lấy lịch sử phiên chat chi tiết để hiển thị trong ChatPro hoặc Panel chỉnh sửa
  getWorkspace(sessionUuid: string) {
    return axiosClient.get(`/chat-sessions/${sessionUuid}/workspace`);
  },

  // Ghim ngữ cảnh (context) từ văn bản hiện tại vào phiên chat cho AI tham chiếu
  pinContext(sessionUuid: string, data: { documentId: string, content: string }) {
    const url = `/ai/chat-history/${sessionUuid}/pin`;
    return axiosClient.post(url, data);
  }
};