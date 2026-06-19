import { useState } from 'react';
import { 
  UploadingFile, 
  uploadFileToServer, 
  deleteFileFromServer 
} from '../services/fileUpload';

export type FileCategory = 'DIRECTIVE' | 'LEGAL' | 'CONTENT' | 'TEMPLATE' | 'RELATED' | 'EVIDENCE';

export function useAssistantFiles() {
  // Quản lý file tập trung: Key là Category, Value là mảng các file đang/đã upload
  const [filesMap, setFilesMap] = useState<Record<FileCategory, UploadingFile[]>>({
    DIRECTIVE: [],
    LEGAL: [],
    CONTENT: [],
    TEMPLATE: [],
    RELATED: [],
    EVIDENCE: [],
  });

  // 1. Hàm lấy danh sách file theo từng danh mục để truyền vào FileUploadZone
  const getFiles = (category: FileCategory): UploadingFile[] => {
    return filesMap[category] || [];
  };

  // 2. Hàm kích hoạt khi cán bộ chọn file từ máy tính (Thêm file mới và chạy Upload ngầm)
  const handleUpload = (category: FileCategory, nativeFiles: File[]) => {
    // Chuyển đổi File của trình duyệt sang cấu trúc dữ liệu UploadingFile
    const newUploadFiles: UploadingFile[] = nativeFiles.map(file => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      file: file,
      progress: 0,
      status: 'PENDING',
    }));

    // Cập nhật danh sách file mới vào State trước để UI hiển thị hàng đợi ngay lập tức
    setFilesMap(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), ...newUploadFiles]
    }));

    // Kích hoạt upload ngầm cho từng file vừa thêm vào
    newUploadFiles.forEach(fileItem => {
      uploadFileToServer(
        fileItem,
        category,
        // Callback cập nhật thanh tiến trình %
        (fileId, progress) => {
          setFilesMap(prev => ({
            ...prev,
            [category]: prev[category].map(f => 
              f.id === fileId ? { ...f, progress } : f
            )
          }));
        },
        // Callback cập nhật trạng thái (PENDING -> UPLOADING -> SUCCESS/FAILED)
        (fileId, status, backendFileId, error) => {
          setFilesMap(prev => ({
            ...prev,
            [category]: prev[category].map(f => 
              f.id === fileId ? { ...f, status, backendFileId, error } : f
            )
          }));
        }
      );
    });
  };

  // 3. Hàm xóa file (Gọi khi cán bộ bấm nút Xóa trên giao diện)
  const handleRemove = async (category: FileCategory, fileId: string) => {
    const targetFile = filesMap[category]?.find(f => f.id === fileId);
    
    // Nếu file đã có id trên server backend, gọi hàm xóa ngầm trên server
    if (targetFile?.backendFileId) {
      try {
        await deleteFileFromServer(targetFile.backendFileId);
      } catch (error) {
        console.error("Xóa file trên server thất bại:", error);
      }
    }

    // Cập nhật lại State để xóa file khỏi giao diện
    setFilesMap(prev => ({
      ...prev,
      [category]: prev[category].filter(f => f.id !== fileId)
    }));
  };

  // 4. Hàm đóng gói Payload sạch để gửi qua API
  const getBackendPayload = () => {
    const payload: Record<string, string[]> = {};
    (Object.keys(filesMap) as FileCategory[]).forEach(category => {
      payload[category] = filesMap[category]
        .filter(f => f.status === 'SUCCESS' && f.backendFileId)
        .map(f => f.backendFileId as string);
    });
    return payload;
  };

  return {
    getFiles,
    handleUpload,
    handleRemove,
    getBackendPayload,
    filesMap
  };
}