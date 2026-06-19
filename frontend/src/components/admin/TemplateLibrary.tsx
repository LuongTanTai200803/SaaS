import React, { useState } from 'react';
import {
  FileText, Upload, Eye, Edit, Trash2, Download, Search, Filter,
  Plus, Tag, Calendar, User, CheckCircle, XCircle, MoreVertical
} from 'lucide-react';

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

  const mockTemplates: Template[] = [
    {
      id: 'TPL001',
      title: 'Nghị quyết Đại hội Đảng bộ cơ sở',
      category: 'party',
      subcategory: 'Nghị quyết',
      description: 'Mẫu nghị quyết đại hội đảng bộ cơ sở theo quy định mới nhất',
      uploadDate: '2026-05-15',
      uploadedBy: 'Admin Nguyễn Văn A',
      downloads: 1247,
      fileSize: '245 KB',
      status: 'Active',
      tags: ['Đại hội', 'Nghị quyết', 'Đảng bộ cơ sở']
    },
    {
      id: 'TPL002',
      title: 'Chỉ thị về công tác tư tưởng',
      category: 'party',
      subcategory: 'Chỉ thị',
      description: 'Mẫu chỉ thị về công tác tư tưởng trong giai đoạn mới',
      uploadDate: '2026-05-10',
      uploadedBy: 'Admin Trần Thị B',
      downloads: 892,
      fileSize: '198 KB',
      status: 'Active',
      tags: ['Chỉ thị', 'Công tác tư tưởng']
    },
    {
      id: 'TPL003',
      title: 'Quyết định về khen thưởng',
      category: 'state',
      subcategory: 'Quyết định',
      description: 'Mẫu quyết định khen thưởng cá nhân, tập thể',
      uploadDate: '2026-05-08',
      uploadedBy: 'Admin Lê Văn C',
      downloads: 2104,
      fileSize: '312 KB',
      status: 'Active',
      tags: ['Quyết định', 'Khen thưởng']
    },
  ];

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesCategory = template.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || template.subcategory === selectedSubcategory;
    const matchesSearch = template.title.toLowerCase().includes(systemSearchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(systemSearchQuery.toLowerCase());
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  const mockUserUploads: UserUpload[] = [
    {
      id: 'UPL001',
      fileName: 'Biên bản họp tổ chuyên môn.pdf',
      formType: 'Báo cáo đánh giá',
      userName: 'Nguyễn Thị Hương',
      agency: 'Phòng GD&ĐT Quận 1',
      uploadDate: '2026-06-16 09:42',
      fileSize: '1.2 MB',
      status: 'SAFE'
    },
    {
      id: 'UPL002',
      fileName: 'Chứng cứ nghiệm thu dự án.docx',
      formType: 'Tài liệu chứng cứ',
      userName: 'Lê Văn Bình',
      agency: 'Trường THCS Nguyễn Du',
      uploadDate: '2026-06-17 14:08',
      fileSize: '842 KB',
      status: 'WARNING'
    },
    {
      id: 'UPL003',
      fileName: 'Văn bản chỉ đạo phòng học trực tuyến.pdf',
      formType: 'Công văn chỉ đạo',
      userName: 'Trần An',
      agency: 'Sở GD&ĐT TP.HCM',
      uploadDate: '2026-06-18 08:21',
      fileSize: '2.1 MB',
      status: 'BLOCKED'
    }
  ];

  const filteredUserUploads = mockUserUploads.filter(upload => {
    const matchesSearch = upload.fileName.toLowerCase().includes(uploadSearchQuery.toLowerCase()) ||
                          upload.userName.toLowerCase().includes(uploadSearchQuery.toLowerCase()) ||
                          upload.agency.toLowerCase().includes(uploadSearchQuery.toLowerCase());
    const matchesStatus = uploadStatusFilter === 'all' || upload.status === uploadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Archived':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getUploadStatusColor = (status: UserUpload['status']) => {
    switch (status) {
      case 'SAFE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'WARNING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'BLOCKED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const translateTemplateStatus = (status: Template['status']) => {
    switch (status) {
      case 'Active':
        return 'Đang hoạt động';
      case 'Draft':
        return 'Bản nháp';
      case 'Archived':
        return 'Đã lưu trữ';
      default:
        return status;
    }
  };

  const translateUploadStatus = (status: UserUpload['status']) => {
    switch (status) {
      case 'SAFE':
        return '✓ Đã quét (An toàn)';
      case 'WARNING':
        return '⚠️ Nghi vấn (Chờ check)';
      case 'BLOCKED':
        return '❌ Đã khóa (Vi phạm)';
      default:
        return status;
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
              onClick={() => setShowUploadModal(true)}
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
          {/* Search */}
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

          {/* Subcategory Filter */}
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                  Tên mẫu văn bản
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                  Người tải lên
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                  Lượt tải
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-slate-800/50 transition-colors">
                    {/* Template Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-cyan-500/10 rounded-lg">
                          <FileText size={18} className="text-cyan-300" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-100 mb-1">
                            {template.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            {template.description}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            {template.tags.map(tag => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 text-slate-200 rounded text-xs"
                              >
                                <Tag size={10} />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Subcategory */}
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {template.subcategory}
                      </span>
                    </td>

                    {/* Uploader */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-slate-500" />
                        <div className="text-slate-200">
                          <div className="text-sm">{template.uploadedBy}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar size={10} />
                            {template.uploadDate}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Downloads */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Download size={14} className="text-green-500" />
                        <span className="text-sm font-semibold text-green-400">
                          {template.downloads.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{template.fileSize}</div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(template.status)}`}>
                        {template.status === 'Active' && <CheckCircle size={12} />}
                        {template.status === 'Archived' && <XCircle size={12} />}
                        {translateTemplateStatus(template.status)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 rounded-lg transition-colors text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                          title="Xem trước"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-2 rounded-lg transition-colors text-slate-300 hover:bg-slate-800 hover:text-amber-300"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-2 rounded-lg transition-colors text-slate-300 hover:bg-slate-800 hover:text-emerald-300"
                          title="Tải xuống"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          className="p-2 rounded-lg transition-colors text-slate-300 hover:bg-slate-800 hover:text-rose-400"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FileText size={48} className="text-slate-700" />
                      <div className="text-slate-300">
                        Không tìm thấy mẫu văn bản nào
                      </div>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Plus size={16} />
                        Tạo mẫu mới
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredTemplates.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Hiển thị <span className="font-medium text-slate-200">1-{filteredTemplates.length}</span> trong tổng số{' '}
              <span className="font-medium text-slate-200">{filteredTemplates.length}</span> mẫu
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm transition-colors">
                Trước
              </button>
              <button className="px-3 py-1.5 bg-cyan-600 text-white rounded text-sm">1</button>
              <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm transition-colors">
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal Placeholder */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Tải lên mẫu văn bản mới</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tên mẫu văn bản</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100"
                  placeholder="Nhập tên mẫu..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Danh mục</label>
                <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100">
                  {categoryConfig[selectedCategory].subcategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tệp tin</label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-cyan-500 transition-colors cursor-pointer">
                  <Upload size={32} className="mx-auto text-cyan-400 mb-2" />
                  <p className="text-sm text-slate-300">Kéo thả hoặc click để tải lên</p>
                  <p className="text-xs text-slate-500 mt-1">DOCX, PDF (tối đa 5MB)</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
              >
                Hủy
              </button>
              <button className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors">
                Tải lên
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Nhật ký upload người dùng</h2>
              <p className="text-sm text-slate-400 mt-1">Theo dõi danh sách tệp chứng cứ do người dùng tải lên khi điền form, giúp Admin kiểm tra nội dung và dung lượng thực tế.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">
                Tổng file: {filteredUserUploads.length}
              </div>
              <div className="rounded-full border border-emerald-200 bg-transparent px-3 py-2 text-sm font-semibold text-emerald-700">
                An toàn: {filteredUserUploads.filter(upload => upload.status === 'SAFE').length}
              </div>
              <div className="rounded-full border border-amber-200 bg-transparent px-3 py-2 text-sm font-semibold text-amber-700">
                Nghi vấn: {filteredUserUploads.filter(upload => upload.status === 'WARNING').length}
              </div>
              <div className="rounded-full border border-rose-200 bg-transparent px-3 py-2 text-sm font-semibold text-rose-700">
                Đã khóa: {filteredUserUploads.filter(upload => upload.status === 'BLOCKED').length}
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
                          <div className="text-sm text-slate-100">{upload.userName}</div>
                          <div className="text-xs text-slate-500">{upload.agency}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-100">{upload.uploadDate}</div>
                          <div className="text-xs text-slate-500">{upload.fileSize}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getUploadStatusColor(upload.status)} ${upload.status === 'BLOCKED' ? 'animate-pulse' : ''}`}>
                            {translateUploadStatus(upload.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm transition-colors">
                            Xem
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-300">
                        Không tìm thấy tệp upload nào phù hợp.
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
