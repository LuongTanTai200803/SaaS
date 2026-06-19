import { UserProfile, Document } from '../api/userApi';
import { FileCategory } from '../features/wizard/VanKienDangForm'; // Assuming FileCategory is defined here or similar

const MOCK_DELAY = 500; // milliseconds

// --- Mock Auth API ---
export const mockAuthApi = {
  login: async (credentials: any) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'test@example.com' && credentials.password === 'password') {
          resolve({
            success: true,
            message: 'Đăng nhập thành công',
            token: 'mock_jwt_token_12345',
          });
        } else {
          reject({
            response: {
              data: {
                success: false,
                message: 'Email hoặc mật khẩu không đúng.',
              },
            },
          });
        }
      }, MOCK_DELAY);
    });
  },

  register: async (userData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Tạo tài khoản thành công',
        });
      }, MOCK_DELAY);
    });
  },
};

// --- Mock User API ---
const mockUserProfile: UserProfile = {
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
};

const mockDocuments: Document[] = [
  {
    sessionId: 501,
    sessionName: 'Báo cáo tổng kết công tác Đảng bộ Quý 1/2026',
    tagId: 'Văn kiện Đảng',
    updatedAt: '2026-06-04T15:30:00',
    status: 'Hoàn thành',
  },
  {
    sessionId: 502,
    sessionName: 'Kế hoạch triển khai nhiệm vụ năm học 2026-2027',
    tagId: 'Quản lý Giáo dục',
    updatedAt: '2026-06-03T10:00:00',
    status: 'Bản nháp',
  },
  {
    sessionId: 503,
    sessionName: 'Bài phát biểu khai mạc Hội nghị Tỉnh ủy',
    tagId: 'Biên tập & Phát biểu',
    updatedAt: '2026-06-02T09:00:00',
    status: 'Hoàn thành',
  },
  {
    sessionId: 504,
    sessionName: 'Quyết định về việc bổ nhiệm cán bộ',
    tagId: 'Văn bản Nhà nước',
    updatedAt: '2026-06-01T14:00:00',
    status: 'Hoàn thành',
  },
];

export const mockUserApi = {
  getProfile: async () => {
    return new Promise<UserProfile>((resolve) => {
      setTimeout(() => {
        resolve(mockUserProfile);
      }, MOCK_DELAY);
    });
  },

  getDocuments: async (page: number, size: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = page * size;
        const end = start + size;
        resolve({
          content: mockDocuments.slice(start, end),
          totalPages: Math.ceil(mockDocuments.length / size),
          totalElements: mockDocuments.length,
        });
      }, MOCK_DELAY);
    });
  },
};

// --- Mock File API ---
export const mockFileApi = {
  uploadFiles: async (formData: FormData, onUploadProgress?: (progressEvent: any) => void) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const file = formData.get('file') as File;
        const category = formData.get('category') as FileCategory;
        if (onUploadProgress) {
          onUploadProgress({ loaded: 50, total: 100, progress: 50 });
        }
        setTimeout(() => {
          if (onUploadProgress) {
            onUploadProgress({ loaded: 100, total: 100, progress: 100 });
          }
          resolve({
            fileId: `mock_file_${Date.now()}`,
            fileName: file.name,
            fileUrl: `https://mock-storage.com/${file.name}`,
            fileSize: file.size,
            category: category,
          });
        }, MOCK_DELAY / 2);
      }, MOCK_DELAY);
    });
  },

  deleteFile: async (fileId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `File ${fileId} deleted.` });
      }, MOCK_DELAY);
    });
  },

  getFiles: async (params?: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]); // Return empty array for simplicity
      }, MOCK_DELAY);
    });
  },

  exportWordDraft: async (payload: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockContent = "Mock DOCX content";
        const blob = new Blob([mockContent], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        resolve(blob);
      }, MOCK_DELAY);
    });
  },
};
