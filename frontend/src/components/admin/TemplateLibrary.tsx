import React, { useState } from 'react';
import {
  FileText, Upload, Eye, Edit, Trash2, Download, Search, Tag, Calendar, 
  User, CheckCircle, XCircle, Plus
} from 'lucide-react';

import { fileApi } from '../../api/fileApi';

type TemplateCategory =
  | 'party'
  | 'state'
  | 'mass-org'
  | 'education'
  | 'school'
  | 'lesson-plan'
  | 'test'
  | 'legal'
  | 'internal';

interface Template {
  id: string;
  title: string;
  category: TemplateCategory;
  subcategory: string;
  description: string;
  uploadDate: string;
  uploadedBy: string;
  downloads: number;
  fileSize: string;
  status: 'Active' | 'Draft' | 'Archived';
  tags: string[];
}

interface UserUpload {
  id: string;
  fileName: string;
  formType: string;
  userName: string;
  agency: string;
  uploadDate: string;
  fileSize: string;
  status: 'SAFE' | 'WARNING' | 'BLOCKED';
}

const categoryConfig = {
  'party': {
    label: 'Văn bản Đảng',
    icon: '🚩',
    subcategories: ['Nghị quyết', 'Chỉ thị', 'Kết luận', 'Quy định', 'Quyết định']
  },
  'state': {
    label: 'Văn bản Nhà nước',
    icon: '🏛️',
    subcategories: ['Luật', 'Nghị định', 'Thông tư', 'Quyết định', 'Công văn']
  },
  'mass-org': {
    label: 'MTTQ - Đoàn thể',
    icon: '🤝',
    subcategories: ['Nghị quyết', 'Kế hoạch', 'Báo cáo', 'Tờ trình']
  },
  'education': {
    label: 'Văn bản Giáo dục',
    icon: '📚',
    subcategories: ['Thông tư', 'Công văn', 'Quyết định', 'Kế hoạch']
  },
  'school': {
    label: 'Văn bản Nhà trường',
    icon: '🏫',
    subcategories: ['Quyết định', 'Kế hoạch', 'Báo cáo', 'Biên bản', 'Công văn']
  },
  'lesson-plan': {
    label: 'Giáo án',
    icon: '📝',
    subcategories: ['Tiểu học', 'THCS', 'THPT', 'Giáo án điện tử']
  },
  'test': {
    label: 'Đề kiểm tra',
    icon: '📋',
    subcategories: ['Kiểm tra 15 phút', 'Kiểm tra 1 tiết', 'Thi học kỳ', 'Thi THPT QG']
  },
  'legal': {
    label: 'Văn bản Pháp luật',
    icon: '⚖️',
    subcategories: ['Hiến pháp', 'Bộ luật', 'Luật', 'Nghị định', 'Thông tư']
  },
  'internal': {
    label: 'Tài liệu Nội bộ',
    icon: '🔒',
    subcategories: ['Quy trình', 'Hướng dẫn', 'Biểu mẫu', 'Báo cáo']
  }
};

export function TemplateLibrary() {
  const [activeTab, setActiveTab] = useState<'system' | 'uploads'>('system');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('party');
  const [systemSearchQuery, setSystemSearchQuery] = useState('');
  const [uploadSearchQuery, setUploadSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [uploadStatusFilter, setUploadStatusFilter] = useState<'all' | 'SAFE' | 'WARNING' | 'BLOCKED'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [userUploads, setUserUploads] = useState<UserUpload[]>([]);

  // 🚀 ĐÃ BỔ SUNG: Khai báo đầy đủ các State quản lý tệp tin và dữ liệu form tải lên
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateSubcategory, setNewTemplateSubcategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // ── 🛠️ HÀM XỬ LÝ HÀNH ĐỘNG DÀNH CHO MẪU HỆ THỐNG ──
  
  const handlePreview = (template: Template) => {
    console.log(`👁️ Xem trước mẫu văn bản ID: ${template.id}`);
    alert(`Đang mở chế độ xem trước cho văn bản:\n"${template.title}"`);
  };

  const handleEdit = (template: Template) => {
    console.log(`📝 Chỉnh sửa mẫu văn bản ID: ${template.id}`);
    alert(`Mở trình cấu hình chỉnh sửa mẫu văn bản:\n"${template.title}"`);
  };

  const handleDownload = async (template: Template) => {
    console.log(`📥 Tải xuống mẫu văn bản ID: ${template.id}`);
    try {
      alert(`Hệ thống đang chuẩn bị tệp tin tải xuống cho mẫu: ${template.title}`);
    } catch (error) {
      console.error("Lỗi khi tải tệp tin mẫu:", error);
    }
  };

  const handleUploadSubmit = async () => {
    if (!newTemplateTitle.trim()) {
      alert("Vui lòng nhập tên mẫu văn bản.");
      return;
    }
    if (!selectedFile) {
      alert("Vui lòng chọn hoặc kéo thả tệp tài liệu đính kèm.");
      return;
    }

    setIsUploading(true);

    // 1. Đóng gói dữ liệu dạng Multipart Form Data chuẩn cấu hình Backend nhận diện
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', 'TEMPLATE'); // Khớp với FileCategory bên fileApi của bạn

    try {
      // 2. Gọi API thật từ object fileApi của bạn thông qua Axios Client
      const response: any = await fileApi.uploadFiles(formData, (progressEvent) => {
        // Tính toán % tiến độ tải lên thực tế từ trình duyệt
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        console.log(`⏳ Tiến độ tải File lên Server: ${percentCompleted}%`);
      });

      // 3. Xử lý khi Backend phản hồi thành công (Bốc tách dữ liệu trả về từ response của axiosClient)
      // Căn cứ theo type UploadFileResponse của bạn: { fileId, fileName, fileUrl, fileSize }
      const fileData = response;
      
      const newTemplate: Template = {
        id: fileData?.fileId || `TPL-${Date.now()}`, // Lấy fileId thật từ Spring Boot trả về
        title: newTemplateTitle,
        category: selectedCategory,
        subcategory: newTemplateSubcategory || categoryConfig[selectedCategory].subcategories[0],
        description: `Tài liệu chuẩn phân hệ ${categoryConfig[selectedCategory].label}`,
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: 'Quản trị viên Hệ thống',
        downloads: 0,
        fileSize: fileData?.fileSize ? `${(fileData.fileSize / 1024).toFixed(0)} KB` : `${(selectedFile.size / 1024).toFixed(0)} KB`,
        status: 'Active',
        tags: [categoryConfig[selectedCategory].label, 'Hệ thống']
      };

      // Đẩy mảng chứa mẫu mới lên đầu Table render danh sách dữ liệu động
      setTemplates(prev => [newTemplate, ...prev]);
      alert(`🎉 Tải lên thành công mẫu văn bản: ${newTemplateTitle}`);
      
      // Reset trạng thái form về mặc định
      setNewTemplateTitle('');
      setSelectedFile(null);
      setShowUploadModal(false);
    } catch (error: any) {
      console.error("Lỗi khi tải mẫu lên server:", error);
      const errMsg = error.response?.data?.message || error.message || 'Tải lên thất bại';
      alert(`❌ Lỗi hệ thống: ${errMsg}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDelete = async (templateId: string) => {
    if (!window.confirm("🚨 Cảnh báo tối cao: Bạn có chắc chắn muốn xóa vĩnh viễn mẫu văn bản này khỏi kho hệ thống không?")) {
      return;
    }

    try {
      // 🚀 KÍCH HOẠT: Gọi hàm DELETE thực tế truyền param id qua đường mạng
      await fileApi.deleteFile(templateId);

      // Sau khi Server gạt bỏ thành công, lọc bỏ id ra khỏi state giao diện
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      alert("Đã xóa mẫu văn bản khỏi hệ thống thành công.");
    } catch (error: any) {
      console.error("Lỗi xóa file:", error);
      const errMsg = error.response?.data?.message || error.message || 'Không thể xóa tệp tin';
      alert(`❌ Thao tác thất bại: ${errMsg}`);
    }
  };

  const handleViewUserUpload = (upload: UserUpload) => {
    console.log(`🔍 Kiểm tra tệp chứng cứ người dùng ID: ${upload.id}`);
    alert(`Đang tải tệp tin chứng cứ an toàn:\n"${upload.fileName}" từ đơn vị ${upload.agency}`);
  };

  // ── 📊 LOGIC BỘ LỌC DỮ LIỆU (FILTERS) ──
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = template.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || template.subcategory === selectedSubcategory;
    const matchesSearch = template.title.toLowerCase().includes(systemSearchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(systemSearchQuery.toLowerCase());
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  const filteredUserUploads = userUploads.filter(upload => {
    const matchesSearch = upload.fileName.toLowerCase().includes(uploadSearchQuery.toLowerCase()) ||
                          upload.userName.toLowerCase().includes(uploadSearchQuery.toLowerCase()) ||
                          upload.agency.toLowerCase().includes(uploadSearchQuery.toLowerCase());
    const matchesStatus = uploadStatusFilter === 'all' || upload.status === uploadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Archived': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getUploadStatusColor = (status: UserUpload['status']) => {
    switch (status) {
      case 'SAFE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'WARNING': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'BLOCKED': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const translateTemplateStatus = (status: Template['status']) => {
    switch (status) {
      case 'Active': return 'Đang hoạt động';
      case 'Draft': return 'Bản nháp';
      case 'Archived': return 'Đã lưu trữ';
      default: return status;
    }
  };

  const translateUploadStatus = (status: UserUpload['status']) => {
    switch (status) {
      case 'SAFE': return '✓ An toàn';
      case 'WARNING': return '⚠️ Nghi vấn';
      case 'BLOCKED': return '❌ Đã khóa';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Quản lý Mẫu & Upload Người Dùng</h1>
            <p className="text-sm text-slate-400 mt-1">Admin theo dõi mẫu chuẩn hệ thống và tài liệu chứng cứ người dùng gửi lên.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('system')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === 'system' ? 'bg-cyan-600 text-slate-100' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Mẫu hệ thống
            </button>
            <button
              onClick={() => setActiveTab('uploads')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === 'uploads' ? 'bg-cyan-600 text-slate-100' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Nhật ký upload
            </button>
          </div>
        </div>
        {activeTab === 'system' && (
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-slate-400">Đang xem: Mẫu hệ thống</div>
            <button
              onClick={() => {
                setNewTemplateSubcategory(categoryConfig[selectedCategory].subcategories[0]);
                setShowUploadModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Upload size={16} />
              Tải lên mẫu mới
            </button>
          </div>
        )}
      </div>

      {activeTab === 'system' ? (
      <>
      {/* Category Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
          {(Object.entries(categoryConfig) as [TemplateCategory, typeof categoryConfig[TemplateCategory]][]).map(([key, config]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedCategory(key);
                setSelectedSubcategory('all');
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                selectedCategory === key
                  ? 'bg-cyan-600 text-slate-100 shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100'
              }`}
            >
              <span className="text-2xl">{config.icon}</span>
              <span className="text-xs font-medium text-center leading-tight">{config.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Category Info & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{categoryConfig[selectedCategory].icon}</span>
            <div>
              <h2 className="text-lg font-bold text-slate-100">{categoryConfig[selectedCategory].label}</h2>
              <p className="text-xs text-slate-400">
                {filteredTemplates.length} mẫu văn bản
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mô tả..."
                value={systemSearchQuery}
                onChange={(e) => setSystemSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100"
            >
              <option value="all">Tất cả danh mục</option>
              {categoryConfig[selectedCategory].subcategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Templates Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Tên mẫu văn bản</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Danh mục</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Người tải lên</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Lượt tải</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Trạng thái</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-cyan-500/10 rounded-lg flex-shrink-0">
                          <FileText size={18} className="text-cyan-300" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-100 mb-1">{template.title}</div>
                          <div className="text-xs text-slate-500">{template.description}</div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {template.tags.map(tag => (
                              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 text-slate-200 rounded text-xs">
                                <Tag size={10} /> {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {template.subcategory}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-slate-500" />
                        <div>
                          <div className="text-sm text-slate-200">{template.uploadedBy}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar size={10} /> {template.uploadDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Download size={14} className="text-green-400" />
                        <span className="text-sm font-semibold text-green-400">{template.downloads.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{template.fileSize}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(template.status)}`}>
                        {template.status === 'Active' && <CheckCircle size={12} />}
                        {template.status === 'Archived' && <XCircle size={12} />}
                        {translateTemplateStatus(template.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handlePreview(template)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                          title="Xem trước"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleEdit(template)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-amber-400 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDownload(template)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
                          title="Tải xuống"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(template.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FileText size={44} className="text-slate-700" />
                      <div className="text-slate-400 text-sm">Kho dữ liệu trống hoặc chưa được nạp từ Server API</div>
                      <button
                        onClick={() => {
                          setNewTemplateSubcategory(categoryConfig[selectedCategory].subcategories[0]);
                          setShowUploadModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Plus size={16} /> Tạo cấu trúc mẫu mới
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🏛️ ĐÃ CẬP NHẬT: Tích hợp đầy đủ Input File và gán State hoàn chỉnh */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-100 mb-4">Tải lên mẫu văn bản mới</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Tên mẫu văn bản</label>
                <input
                  type="text"
                  value={newTemplateTitle}
                  onChange={(e) => setNewTemplateTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100"
                  placeholder="Nhập tên mẫu..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Danh mục phân hệ</label>
                <select 
                  value={newTemplateSubcategory}
                  onChange={(e) => setNewTemplateSubcategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100"
                >
                  {categoryConfig[selectedCategory].subcategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Tệp tài liệu đính kèm</label>
                
                {/* Sử dụng cấu trúc label bao quanh input file để tăng diện tích click */}
                <label className="block border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-cyan-500 transition-colors cursor-pointer bg-slate-950/30">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".docx,.pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                  />
                  <Upload size={28} className="mx-auto text-cyan-400 mb-2" />
                  
                  {selectedFile ? (
                    <div>
                      <p className="text-xs font-bold text-emerald-400 tracking-wide truncate max-w-xs mx-auto">
                        📎 {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        ({(selectedFile.size / 1024).toFixed(1)} KB) - Bấm để chọn lại
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-medium text-slate-300">Click vào đây để chọn tệp tin từ thiết bị</p>
                      <p className="text-[11px] text-slate-500 mt-1">Hỗ trợ định dạng DOCX, PDF (Tối đa 5MB)</p>
                    </>
                  )}
                </label>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                disabled={isUploading}
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                  setNewTemplateTitle('');
                }}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                Hủy lệnh
              </button>
              <button 
                type="button" 
                disabled={isUploading}
                onClick={handleUploadSubmit}
                className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 disabled:bg-cyan-800"
              >
                {isUploading ? "Đang xử lý..." : "Xác nhận tải lên"}
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      ) : (
        /* ── NK UPLOAD NGƯỜI DÙNG ── */
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100">Nhật ký upload người dùng</h2>
              <p className="text-xs text-slate-400 mt-0.5">Theo dõi hồ sơ, tệp chứng cứ do người dùng tải lên hệ thống biểu mẫu.</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <div className="rounded-lg border border-slate-700 bg-slate-950/70 px-2.5 py-1 text-xs text-slate-300">
                Tổng file: {filteredUserUploads.length}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm file, người dùng, đơn vị..."
                    value={uploadSearchQuery}
                    onChange={(e) => setUploadSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100"
                  />
                </div>
              </div>
              <div>
                <select
                  value={uploadStatusFilter}
                  onChange={(e) => setUploadStatusFilter(e.target.value as typeof uploadStatusFilter)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="SAFE">Đã quét (An toàn)</option>
                  <option value="WARNING">Nghi vấn (Chờ check)</option>
                  <option value="BLOCKED">Đã khóa (Vi phạm)</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-slate-700">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Tên file</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Người upload</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Ngày / Kích thước</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Trạng thái</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredUserUploads.length > 0 ? (
                    filteredUserUploads.map((upload) => (
                      <tr key={upload.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-100">{upload.fileName}</div>
                          <div className="text-xs text-slate-500">{upload.formType}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-200">{upload.userName}</div>
                          <div className="text-xs text-slate-500">{upload.agency}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-200">{upload.uploadDate}</div>
                          <div className="text-xs text-slate-500">{upload.fileSize}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getUploadStatusColor(upload.status)} ${upload.status === 'BLOCKED' ? 'animate-pulse' : ''}`}>
                            {translateUploadStatus(upload.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewUserUpload(upload)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition-colors"
                          >
                            Kiểm tra
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                        Không tìm thấy tệp upload nào phù hợp trong cơ sở dữ liệu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}