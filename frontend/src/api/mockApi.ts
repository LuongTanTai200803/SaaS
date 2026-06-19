import { UserProfile, Document, DocumentsResponse } from './userApi';
import { FileCategory, UploadFileResponse } from './fileApi';
import { ChatMessage, CompletionRequest, ChatSession } from './chatApi';
import {
  mockUsers,
  mockUserProfile,
  mockDocuments,
  mockChatMessages,
  mockBillingPlans,
  mockPaymentHistory,
  mockTokenUsageRecords,
  mockFiles,
  mockAdminUsers,
  mockChatSessions,
  mockRevenueData,
} from './mockTestData'; // Import dữ liệu mock từ file mới

const MOCK_DELAY = 500; // milliseconds

// Dữ liệu người dùng đã đăng ký trong phiên mock (chỉ tồn tại trong bộ nhớ)
const registeredMockUsers = [...mockUsers];

// Biến để lưu trữ profile của người dùng đang đăng nhập trong mock session
let currentMockUser: UserProfile | null = null;

export const authApi = {
  login: async (credentials: any) => {
    console.log('MOCK API: authApi.login called with:', credentials);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = registeredMockUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          currentMockUser = user.profile; // Lưu profile của người dùng đăng nhập
          resolve({
            success: true,
            message: 'Đăng nhập thành công',
            token: `mock_jwt_token_${user.profile.id}`, // Trả về token dựa trên ID người dùng
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
    console.log('MOCK API: authApi.register called with:', userData); // Thêm log để kiểm tra
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Kiểm tra xem email đã tồn tại chưa
        if (registeredMockUsers.some((u) => u.email === userData.email)) {
          return reject({
            response: {
              data: {
                success: false,
                message: 'Email đã tồn tại.',
              },
            },
          });
        }

        // Thêm người dùng mới vào danh sách (chỉ trong bộ nhớ mock)
        const newUserProfile: UserProfile = { ...mockUserProfile, id: Date.now(), email: userData.email, fullName: userData.fullName, role: 'ROLE_USER' };
        registeredMockUsers.push({ email: userData.email, password: userData.password, profile: newUserProfile });
        console.log('MOCK API: New user registered:', newUserProfile); // Log người dùng mới

        resolve({ // Trả về thành công
          success: true,
          message: 'Tạo tài khoản thành công',
        });
      }, MOCK_DELAY);
    });
  },

  logout: async () => {
    console.log('MOCK API: authApi.logout called');
    return new Promise((resolve) => {
      currentMockUser = null; // Xóa profile người dùng khi đăng xuất
      setTimeout(() => {
        resolve({ success: true, message: 'Đăng xuất thành công' });
      }, MOCK_DELAY);
    });
  },

  forgotPassword: async (email: string) => {
    console.log('MOCK API: authApi.forgotPassword called with:', email);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `Yêu cầu đặt lại mật khẩu đã được gửi đến ${email}` });
      }, MOCK_DELAY);
    });
  },
};

export const userApi = {
  getProfile: async () => {
    return new Promise<UserProfile>((resolve, reject) => {
      setTimeout(() => { // Trả về profile của người dùng đang đăng nhập, hoặc profile mặc định nếu chưa ai đăng nhập
        if (currentMockUser) {
          resolve(currentMockUser);
        } else {
          reject(new Error('No user logged in')); // Reject if no user is logged in
        }
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

export const fileApi = {
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
        if (params?.category) {
          resolve(mockFiles.filter((file) => file.category === params.category));
          return;
        }
        resolve(mockFiles);
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

export const chatApi = {
  generateCompletion: async (payload: CompletionRequest) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate SSE by returning a mock response that looks like a stream chunk
        resolve({
          data: `data: {"type": "content", "text": "Đây là nội dung tóm tắt mock cho sessionId ${payload.sessionId}."}\n\ndata: {"type": "verify_done", "actualCreditDeducted": 0.5, "refundedCredit": 0, "currentBalance": 349.5}\n\n`,
          headers: { 'content-type': 'text/event-stream' },
          status: 200,
        });
      }, MOCK_DELAY);
    });
  },

  getChatHistory: async (sessionId: number) => {
    return new Promise<{ messages: ChatMessage[] }>((resolve) => {
      setTimeout(() => {
        const session = mockChatSessions.find((item) => item.sessionId === sessionId);
        const messages = session ? mockChatMessages : mockChatMessages;
        resolve({ messages });
      }, MOCK_DELAY);
    });
  },

  pinContext: async (sessionId: number, payload: { htmlContent: string }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `Context pinned for session ${sessionId}` });
      }, MOCK_DELAY);
    });
  },

  createChatSession: async (payload: { tagId: string; sessionName: string }) => {
    return new Promise<ChatSession>((resolve) => {
      setTimeout(() => {
        resolve({
          sessionId: Math.floor(Math.random() * 1000),
          tagId: payload.tagId,
          sessionName: payload.sessionName,
          currentEditorContent: '',
          createdAt: new Date().toISOString(),
        });
      }, MOCK_DELAY);
    });
  },

  updateEditorContent: async (sessionId: number, payload: { htmlContent: string }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `Editor content updated for session ${sessionId}` });
      }, MOCK_DELAY);
    });
  },
};

// --- Mock AI API ---
export const aiApi = {
  generateCompletion: async (data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'AI completion generated (mock)' });
      }, MOCK_DELAY);
    });
  },
  getChatHistory: async (sessionId: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ messages: mockChatMessages });
      }, MOCK_DELAY);
    });
  },
  pinContext: async (sessionId: string, data: { documentId: string; content: string }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Context pinned (mock)' });
      }, MOCK_DELAY);
    });
  },
};

// --- Mock Admin API ---
export const adminApi = {
  getUsers: async (params?: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAdminUsers);
      }, MOCK_DELAY);
    });
  },
  toggleUserStatus: async (userId: string, isActive: boolean) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `User ${userId} status toggled to ${isActive}` });
      }, MOCK_DELAY);
    });
  },
  getRevenueChart: async (params?: { startDate: string; endDate: string }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockRevenueData);
      }, MOCK_DELAY);
    });
  },
};

// --- Mock Credit API ---
export const creditApi = {
  estimateCredits: async (data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const base = data.tokens || data.wordCount || 1000;
        const inputCreditEstimate = parseFloat((base * 0.0012).toFixed(2));
        const outputCreditEstimate = parseFloat((base * 0.0024).toFixed(2));
        resolve({
          inputCreditEstimate,
          outputCreditEstimate,
          totalCreditHold: parseFloat((inputCreditEstimate + outputCreditEstimate).toFixed(2)),
        });
      }, MOCK_DELAY);
    });
  },
  getBalance: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ balance: currentMockUser ? currentMockUser.creditBalance : 0 });
      }, MOCK_DELAY);
    });
  },
  generateVietQR: async (data: { amount: number; description: string }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ qrCodeUrl: 'mock_qr_code_url', invoiceId: 'mock_invoice_id' });
      }, MOCK_DELAY);
    });
  },
};
