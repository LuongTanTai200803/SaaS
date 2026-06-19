// src/api/mockTestData.ts
import { UserProfile, Document } from './userApi';
import { ChatMessage, ChatSession } from './chatApi';
import { FileCategory } from './fileApi';

// --- Mock Auth Data ---
export const mockUsers: { email: string; password: string; profile: UserProfile }[] = [
  {
    email: 'test@example.com',
    password: 'password',
    profile: {
      id: 10293,
      email: 'test@example.com',
      fullName: 'Nguyễn Văn A',
      agency: 'Văn phòng Tỉnh ủy',
      role: 'ROLE_USER',
      creditBalance: 350,
      packageType: 'PROFESSIONAL',
      expireDate: '2026-12-25T23:59:59',
      affiliate: {
        code: 'VANPHONG_AI_A102',
        link: 'https://trolyai.vn/register?ref=VANPHONG_AI_A102',
        totalEarnings: 1250000,
      },
    },
  },
  {
    email: 'admin@example.com',
    password: 'adminpassword',
    profile: {
      id: 10001,
      email: 'admin@example.com',
      fullName: 'Admin User',
      agency: 'Ban Quản trị',
      role: 'ROLE_ADMIN',
      creditBalance: 9999,
      packageType: 'ENTERPRISE',
      expireDate: '2030-01-01T00:00:00',
      affiliate: {
        code: 'ADMIN_AFF',
        link: 'https://trolyai.vn/register?ref=ADMIN_AFF',
        totalEarnings: 0,
      },
    },
  },
  {
    email: 'giaovien@example.com',
    password: 'teacher2026',
    profile: {
      id: 10294,
      email: 'giaovien@example.com',
      fullName: 'Trần Thị B',
      agency: 'Phòng Giáo dục và Đào tạo',
      role: 'ROLE_USER',
      creditBalance: 120,
      packageType: 'PROFESSIONAL',
      expireDate: '2026-11-30T23:59:59',
      affiliate: {
        code: 'GD_AI_B294',
        link: 'https://trolyai.vn/register?ref=GD_AI_B294',
        totalEarnings: 430000,
      },
    },
  },
];

// --- Mock User Profile Data ---
export const mockUserProfile: UserProfile = mockUsers[0].profile; // Default to the first user's profile

export const mockDocuments: Document[] = [
  {
    sessionId: 501,
    sessionName: 'Báo cáo tổng kết công tác Đảng bộ Quý 1/2026',
    tagId: 'Văn kiện Đảng',
    updatedAt: '2026-06-04T15:30:00',
    status: 'Hoàn thành',
    assistantType: '1',
  },
  {
    sessionId: 502,
    sessionName: 'Kế hoạch triển khai nhiệm vụ năm học 2026-2027',
    tagId: 'Quản lý Giáo dục',
    updatedAt: '2026-06-03T10:00:00',
    status: 'Bản nháp',
    assistantType: '3',
  },
  {
    sessionId: 503,
    sessionName: 'Bài phát biểu khai mạc Hội nghị Tỉnh ủy',
    tagId: 'Biên tập & Phát biểu',
    updatedAt: '2026-06-02T09:00:00',
    status: 'Hoàn thành',
    assistantType: '4',
  },
  {
    sessionId: 504,
    sessionName: 'Quyết định về việc bổ nhiệm cán bộ',
    tagId: 'Văn bản Nhà nước',
    updatedAt: '2026-06-01T14:00:00',
    status: 'Hoàn thành',
    assistantType: '2',
  },
];

// --- Mock Chat Data ---
export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Chào bạn, tôi có thể giúp gì?',
    timestamp: new Date('2026-06-18T08:10:00'),
  },
  {
    id: '2',
    role: 'user',
    content: 'Hãy tóm tắt văn bản này và soạn lại theo ngôn ngữ hành chính.',
    timestamp: new Date('2026-06-18T08:12:00'),
  },
  {
    id: '3',
    role: 'assistant',
    content: 'Đang xử lý yêu cầu của bạn, vui lòng chờ trong giây lát...',
    timestamp: new Date('2026-06-18T08:12:20'),
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Nội dung đã được điều chỉnh theo phong cách văn bản hành chính, kèm phần mở đầu và kết luận rõ ràng.',
    timestamp: new Date('2026-06-18T08:13:15'),
  },
];

export const mockBillingPlans = [
  { id: 'trial', name: 'Dùng thử', credits: 3, price: 0, description: 'Dùng thử cơ bản cho người mới.' },
  { id: 'basic', name: 'Cơ bản', credits: 100, priceLabel: '199.000đ', description: 'Phù hợp cho người dùng cá nhân.' },
  { id: 'professional', name: 'Chuyên nghiệp', credits: 300, priceLabel: '549.000đ', description: 'Dành cho tổ chức và văn phòng.' },
  { id: 'enterprise', name: 'Doanh nghiệp', credits: 800, priceLabel: '1.199.000đ', description: 'Hỗ trợ quy mô lớn và nhiều phiên mục.' },
];

export const mockPaymentHistory = [
  {
    paymentId: 'pay_20260601',
    date: '2026-06-01',
    amount: 549000,
    currency: 'VND',
    credits: 300,
    method: 'VietQR',
    status: 'Hoàn thành',
  },
  {
    paymentId: 'pay_20260518',
    date: '2026-05-18',
    amount: 199000,
    currency: 'VND',
    credits: 100,
    method: 'Thẻ ngân hàng',
    status: 'Hoàn thành',
  },
  {
    paymentId: 'pay_20260422',
    date: '2026-04-22',
    amount: 0,
    currency: 'VND',
    credits: 3,
    method: 'Dùng thử',
    status: 'Hoàn thành',
  },
];

export const mockTokenUsageRecords = [
  {
    recordId: 'usage_001',
    sessionId: 501,
    assistantName: 'Trợ lý Văn kiện',
    prompt: 'Tóm tắt báo cáo công tác Đảng bộ',
    tokensUsed: 6240,
    creditsDeducted: 12.4,
    createdAt: '2026-06-18T09:30:00',
  },
  {
    recordId: 'usage_002',
    sessionId: 502,
    assistantName: 'Trợ lý Giáo án',
    prompt: 'Soạn giáo án môn Văn lớp 9',
    tokensUsed: 4370,
    creditsDeducted: 8.7,
    createdAt: '2026-06-17T14:15:00',
  },
  {
    recordId: 'usage_003',
    sessionId: 503,
    assistantName: 'Trợ lý Văn bản Nhà nước',
    prompt: 'Soạn công văn về thẩm định hồ sơ',
    tokensUsed: 5120,
    creditsDeducted: 10.2,
    createdAt: '2026-06-16T11:48:00',
  },
  {
    recordId: 'usage_004',
    sessionId: 504,
    assistantName: 'Trợ lý Hỗ trợ CV',
    prompt: 'Kiểm tra và chỉnh sửa CV ứng viên',
    tokensUsed: 2980,
    creditsDeducted: 5.9,
    createdAt: '2026-06-15T17:05:00',
  },
  {
    recordId: 'usage_005',
    sessionId: 505,
    assistantName: 'Trợ lý Phân tích',
    prompt: 'Phân tích số liệu báo cáo tài chính',
    tokensUsed: 7150,
    creditsDeducted: 14.3,
    createdAt: '2026-06-14T08:22:00',
  },
];

export const mockFiles: Array<{
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  category: FileCategory;
  uploadedAt: string;
  uploadedBy: string;
}> = [
  {
    fileId: 'mock_file_1001',
    fileName: 'van_ban_chi_dao_UBND.pdf',
    fileUrl: 'https://mock-storage.com/van_ban_chi_dao_UBND.pdf',
    fileSize: 128000,
    category: 'INPUT_DIRECTIVE',
    uploadedAt: '2026-06-10T10:12:00',
    uploadedBy: 'Nguyễn Văn A',
  },
  {
    fileId: 'mock_file_1002',
    fileName: 'quy_dinh_phap_ly.docx',
    fileUrl: 'https://mock-storage.com/quy_dinh_phap_ly.docx',
    fileSize: 243000,
    category: 'LEGAL',
    uploadedAt: '2026-06-08T09:40:00',
    uploadedBy: 'Trần Thị B',
  },
  {
    fileId: 'mock_file_1003',
    fileName: 'noi_dung_chinh_van_ban.pdf',
    fileUrl: 'https://mock-storage.com/noi_dung_chinh_van_ban.pdf',
    fileSize: 512000,
    category: 'CONTENT',
    uploadedAt: '2026-06-06T16:55:00',
    uploadedBy: 'Nguyễn Văn A',
  },
  {
    fileId: 'mock_file_1004',
    fileName: 'mau_van_ban_dang.docx',
    fileUrl: 'https://mock-storage.com/mau_van_ban_dang.docx',
    fileSize: 164000,
    category: 'TEMPLATE',
    uploadedAt: '2026-06-05T13:12:00',
    uploadedBy: 'Nguyễn Văn A',
  },
  {
    fileId: 'mock_file_1005',
    fileName: 'tai_lieu_lien_quan.zip',
    fileUrl: 'https://mock-storage.com/tai_lieu_lien_quan.zip',
    fileSize: 820000,
    category: 'RELATED',
    uploadedAt: '2026-06-04T11:30:00',
    uploadedBy: 'Trần Thị B',
  },
  {
    fileId: 'mock_file_1006',
    fileName: 'yeu_cau_dau_vao_van_ban.docx',
    fileUrl: 'https://mock-storage.com/yeu_cau_dau_vao_van_ban.docx',
    fileSize: 220000,
    category: 'INPUT_DIRECTIVE',
    uploadedAt: '2026-06-03T08:20:00',
    uploadedBy: 'Nguyễn Văn A',
  },
];

export const mockAdminUsers = [
  {
    id: '10001',
    email: 'admin@example.com',
    fullName: 'Admin User',
    role: 'ROLE_ADMIN',
    isActive: true,
    lastLogin: '2026-06-18T07:55:00',
  },
  {
    id: '10293',
    email: 'test@example.com',
    fullName: 'Nguyễn Văn A',
    role: 'ROLE_USER',
    isActive: true,
    lastLogin: '2026-06-18T08:05:00',
  },
  {
    id: '10294',
    email: 'giaovien@example.com',
    fullName: 'Trần Thị B',
    role: 'ROLE_USER',
    isActive: true,
    lastLogin: '2026-06-17T13:30:00',
  },
];

export const mockChatSessions: Array<ChatSession & { lastActivity: string }> = [
  {
    sessionId: 501,
    tagId: 'Văn kiện Đảng',
    sessionName: 'Báo cáo tổng kết công tác Đảng bộ Quý 1/2026',
    currentEditorContent: 'Bản nháp báo cáo tổng kết...',
    createdAt: '2026-06-04T15:30:00',
    lastActivity: '2026-06-18T08:15:00',
  },
  {
    sessionId: 502,
    tagId: 'Quản lý Giáo dục',
    sessionName: 'Kế hoạch triển khai nhiệm vụ năm học 2026-2027',
    currentEditorContent: 'Nguồn dữ liệu, mục tiêu và nội dung giáo dục...',
    createdAt: '2026-06-03T10:00:00',
    lastActivity: '2026-06-17T14:20:00',
  },
];

export const mockRevenueData = [
  { date: '2026-06-01', revenue: 1200000, creditsSold: 80 },
  { date: '2026-06-05', revenue: 1800000, creditsSold: 140 },
  { date: '2026-06-10', revenue: 1600000, creditsSold: 120 },
  { date: '2026-06-15', revenue: 2200000, creditsSold: 180 },
  { date: '2026-06-18', revenue: 2400000, creditsSold: 200 },
];
