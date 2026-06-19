import { useState, useMemo, useEffect } from 'react';
import {
  FileText, Upload, Calendar, ChevronDown, Info,
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles, X, File, Eye
} from 'lucide-react';
import { ContextualHelpPanel } from '../../components/ContextualHelpPanel';
import { fileApi } from '../../api/fileApi';
import { CreditEstimator } from '../../components/CreditEstimator';
import { UploadingFile, uploadFileToServer, deleteFileFromServer } from '../../services/fileUpload';
import { DocumentWorkspace } from '../../components/DocumentWorkspace';

interface VanKienDangFormProps {
  onGenerate?: (data: any) => void;
  initialSessionData?: { formData: FormData; filesMap: Record<string, UploadingFile[]> }; // Nhận dữ liệu khôi phục từ file cha nếu có
}

type MenuSection = 1 | 2 | 3 | 4 | 5 | 6;
export type FileCategory = 'DIRECTIVE' | 'LEGAL' | 'CONTENT' | 'TEMPLATE' | 'RELATED' | 'EVIDENCE';

interface FormData {
  // Menu 1
  loaiVanBan: string;
  tenVanBan: string;
  coQuanChuQuan: string;
  coQuanBanHanh: string;
  diaDanh: string;
  nguoiKy: string;
  soKyHieu: string;
  noiNhan: string;
  noiNhanBaoCao: string;
  ngayBanHanh: string;

  // Menu 2
  vanBanChiDao: string;
  vanBanPhapLy: string;

  // Menu 3
  noiDungChinh: string;
  bangBieuSoLieu: string;
  taiLieuMinhChung: File[];

  // Menu 4
  mauVanBan: string;
  deCuongDanY: string;

  // Menu 5
  vanBanLienQuan: string;
  taophuluc: boolean;
  doiChieu: boolean;
  bamCanCu: boolean;
  theThucc: boolean;

  // Menu 6
  phongCach: string;
  doDai: string;
  mucDoHoanChinh: string;
  selectedModel: string;
  outputSize: string;
}

export function VanKienDangForm({ onGenerate, initialSessionData }: VanKienDangFormProps) {
  const [currentMenu, setCurrentMenu] = useState<MenuSection>(1);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showWorkspace, setShowWorkspace] = useState(false);

  // 🎯 QUY HOẠCH TẬP TRUNG: Gom 6 mảng file upload rời rạc thành 1 State Map duy nhất
  const [filesMap, setFilesMap] = useState<Record<FileCategory, UploadingFile[]>>({
    DIRECTIVE: [],
    LEGAL: [],
    CONTENT: [],
    TEMPLATE: [],
    RELATED: [],
    EVIDENCE: [],
  });

  const [formData, setFormData] = useState<FormData>({
    loaiVanBan: '',
    tenVanBan: '',
    coQuanChuQuan: '',
    coQuanBanHanh: '',
    diaDanh: '',
    nguoiKy: '',
    soKyHieu: '',
    noiNhan: '',
    noiNhanBaoCao: '',
    ngayBanHanh: new Date().toISOString().split('T')[0],
    vanBanChiDao: '',
    vanBanPhapLy: '',
    noiDungChinh: '',
    bangBieuSoLieu: '',
    taiLieuMinhChung: [],
    mauVanBan: '',
    deCuongDanY: '',
    vanBanLienQuan: '',
    taophuluc: false,
    doiChieu: false,
    bamCanCu: false,
    theThucc: false,
    phongCach: '',
    doDai: '',
    mucDoHoanChinh: '',
    selectedModel: 'claude-sonnet-4.6',
    outputSize: '',
  });

  // 🔄 HYDRATION FLOW: Tự động đổ ngược dữ liệu từ Backend vào các Field khi component nhận dữ liệu cũ
  useEffect(() => {
    if (initialSessionData) {
      if (initialSessionData.formData) {
        setFormData(initialSessionData.formData);
      }
      if (initialSessionData.filesMap) {
        setFilesMap(initialSessionData.filesMap);
      }
    }
  }, [initialSessionData]);

  // Tính toán tổng text input từ TẤT CẢ các field text[cite: 2]
  const combinedInputText = useMemo(() => {
    return [
      formData.tenVanBan,
      formData.coQuanChuQuan,
      formData.coQuanBanHanh,
      formData.diaDanh,
      formData.nguoiKy,
      formData.soKyHieu,
      formData.noiNhan,
      formData.noiNhanBaoCao,
      formData.vanBanChiDao,
      formData.vanBanPhapLy,
      formData.noiDungChinh,
      formData.bangBieuSoLieu,
      formData.mauVanBan,
      formData.deCuongDanY,
      formData.vanBanLienQuan,
    ].filter(Boolean).join('\n\n'); // Dùng \n\n để dễ đọc khi debug[cite: 2]
  }, [
    formData.tenVanBan,
    formData.coQuanChuQuan,
    formData.coQuanBanHanh,
    formData.diaDanh,
    formData.nguoiKy,
    formData.soKyHieu,
    formData.noiNhan,
    formData.noiNhanBaoCao,
    formData.vanBanChiDao,
    formData.vanBanPhapLy,
    formData.noiDungChinh,
    formData.bangBieuSoLieu,
    formData.mauVanBan,
    formData.deCuongDanY,
    formData.vanBanLienQuan,
  ]);

  // Tổng hợp tất cả files từ cấu trúc Map mới để hiển thị trong Credit Estimator[cite: 2]
  const allUploadedFiles = useMemo(() => {
    const allFiles = Object.values(filesMap).flat();
    return allFiles.map(f => f.file);
  }, [filesMap]);

  // Đếm số files theo trạng thái từ cấu trúc Map mới[cite: 2]
  const fileStats = useMemo(() => {
    const allFiles = Object.values(filesMap).flat();
    return {
      total: allFiles.length,
      uploading: allFiles.filter(f => f.status === 'UPLOADING').length,
      success: allFiles.filter(f => f.status === 'SUCCESS').length,
      failed: allFiles.filter(f => f.status === 'FAILED').length,
    };
  }, [filesMap]);

  const menus = [
    { id: 1 as MenuSection, title: 'Thông tin văn bản', completed: false },
    { id: 2 as MenuSection, title: 'Văn bản chỉ đạo', completed: false },
    { id: 3 as MenuSection, title: 'Nội dung, kết quả thực hiện', completed: false },
    { id: 4 as MenuSection, title: 'Mẫu văn bản', completed: false },
    { id: 5 as MenuSection, title: 'Văn bản liên quan', completed: false },
    { id: 6 as MenuSection, title: 'Tạo và xuất bản', completed: false },
  ];

  const loaiVanBanOptions = [
    'Nghị quyết',
    'Quyết định',
    'Chỉ thị',
    'Kế hoạch',
    'Báo cáo',
    'Tờ trình',
    'Công văn',
    'Thông báo',
  ];

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentMenu < 6) {
      setCurrentMenu((currentMenu + 1) as MenuSection);
    }
  };

  const handleBack = () => {
    if (currentMenu > 1) {
      setCurrentMenu((currentMenu - 1) as MenuSection);
    }
  };

  const handleComplete = () => {
    // 📦 ĐÓNG GÓI PAYLOAD GỬI BACKEND: Gom gọn gàng ID thành công theo từng key sạch sẽ
    const uploadedFileIds = {
      directive: (filesMap.DIRECTIVE || []).filter(f => f.status === 'SUCCESS' && f.backendFileId).map(f => f.backendFileId!),
      legal: (filesMap.LEGAL || []).filter(f => f.status === 'SUCCESS' && f.backendFileId).map(f => f.backendFileId!),
      content: (filesMap.CONTENT || []).filter(f => f.status === 'SUCCESS' && f.backendFileId).map(f => f.backendFileId!),
      template: (filesMap.TEMPLATE || []).filter(f => f.status === 'SUCCESS' && f.backendFileId).map(f => f.backendFileId!),
      related: (filesMap.RELATED || []).filter(f => f.status === 'SUCCESS' && f.backendFileId).map(f => f.backendFileId!),
      evidence: (filesMap.EVIDENCE || []).filter(f => f.status === 'SUCCESS' && f.backendFileId).map(f => f.backendFileId!),
    };

    const wordCount = combinedInputText.trim().split(/\s+/).filter(Boolean).length;
    const fileCount = allUploadedFiles.length;

    if (onGenerate) {
      onGenerate({
        ...formData,
        uploadedFileIds,
        wordCount,
        fileCount
      });
    }

    setShowWorkspace(true);
  };

  // Nếu đã complete, hiển thị DocumentWorkspace[cite: 2]
  if (showWorkspace) {
    const initialContent = generateDocumentContent(formData);
    return (
      <DocumentWorkspace
        documentTitle={formData.tenVanBan || 'Văn bản mới'}
        initialContent={initialContent}
        onBack={() => setShowWorkspace(false)}
      />
    );
  }

  const handleExampleClick = (value: string) => {
    if (!focusedField) return;

    const fieldMap: Record<string, keyof FormData> = {
      '1': 'tenVanBan',
      '2': 'coQuanChuQuan',
      '3': 'coQuanBanHanh',
      '4': 'diaDanh',
      '5': 'soKyHieu',
      '6': 'noiNhan',
      '7': 'noiNhanBaoCao',
      '8': 'vanBanChiDao',
      '9': 'vanBanPhapLy',
      '10': 'noiDungChinh',
      '11': 'bangBieuSoLieu',
      '12': 'mauVanBan',
      '14': 'vanBanLienQuan',
      '15': 'phongCach',
      '16': 'outputSize',
      '17': 'mucDoHoanChinh',
    };

    const fieldName = fieldMap[focusedField];
    if (fieldName) {
      updateField(fieldName, value);
    }
  };

  return (
    <div className="flex h-full w-full bg-gray-50">
      {/* Left Preview Panel */}
      <div className="flex-[5.5] min-w-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Xem trước văn bản</h3>
          </div>
          <button className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
            Đóng
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <DocumentPreview formData={formData} />
        </div>
      </div>

      {/* Center Form Content */}
      <div className="flex-[2.5] min-w-0 flex flex-col overflow-hidden bg-white">

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* Menu 1: Thông tin văn bản */}
            {currentMenu === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 1 - Thông tin văn bản</h2>
                  <p className="text-sm text-gray-500">Nhập thông tin cơ bản về văn bản cần soạn thảo</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Loại văn bản <span className="text-red-500">*</span>
                    <TooltipIcon text="Chọn loại văn bản: Nghị quyết, Quyết định, Chỉ thị, Kế hoạch, Báo cáo, Tờ trình, Công văn, Thông báo, v.v..." />
                  </label>
                  <select
                    value={formData.loaiVanBan}
                    onChange={e => updateField('loaiVanBan', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  >
                    <option value="">-- Chọn loại văn bản --</option>
                    {loaiVanBanOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Tên văn bản [1] <span className="text-red-500">*</span>
                    <TooltipIcon text="Tên văn bản muốn ban hành" />
                  </label>
                  <input
                    type="text"
                    value={formData.tenVanBan}
                    onChange={e => updateField('tenVanBan', e.target.value)}
                    onFocus={() => setFocusedField('1')}
                    placeholder="Ví dụ: Về việc triển khai nhiệm vụ chính trị năm 2026"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Cơ quan chủ quản [2]
                    <TooltipIcon text="Tổ chức Đảng quản lý cấp trên trực tiếp" />
                  </label>
                  <input
                    type="text"
                    value={formData.coQuanChuQuan}
                    onChange={e => updateField('coQuanChuQuan', e.target.value)}
                    onFocus={() => setFocusedField('2')}
                    placeholder="Ví dụ: Tỉnh ủy, Đảng ủy..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Cơ quan ban hành [3]
                    <TooltipIcon text="Chọn File trong các File đã lưu hoặc tạo mới đơn vị ban hành văn bản (Quy định 399/QĐTW)" />
                  </label>
                  <input
                    type="text"
                    value={formData.coQuanBanHanh}
                    onChange={e => updateField('coQuanBanHanh', e.target.value)}
                    onFocus={() => setFocusedField('3')}
                    placeholder="Ví dụ: Ban Thường vụ Tỉnh ủy..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Địa danh [4]
                    <TooltipIcon text="Địa danh nơi ban hành văn bản" />
                  </label>
                  <input
                    type="text"
                    value={formData.diaDanh}
                    onChange={e => updateField('diaDanh', e.target.value)}
                    onFocus={() => setFocusedField('4')}
                    placeholder="Ví dụ: Hà Nội, TP. HCM..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Ngày ban hành
                    <TooltipIcon text="Ngay/tháng/năm" />
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.ngayBanHanh}
                      onChange={e => updateField('ngayBanHanh', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                    />
                    <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Số, ký hiệu văn bản [5]
                    <TooltipIcon text="Số văn bản. Ký hiệu" />
                  </label>
                  <input
                    type="text"
                    value={formData.soKyHieu}
                    onChange={e => updateField('soKyHieu', e.target.value)}
                    onFocus={() => setFocusedField('5')}
                    placeholder="Ví dụ: 123-KH/TU"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Kinh gửi / Nơi nhận chính [6]
                    <TooltipIcon text="Cơ quan, đơn vị, cá nhân nhận văn bản" />
                  </label>
                  <textarea
                    value={formData.noiNhan}
                    onChange={e => updateField('noiNhan', e.target.value)}
                    onFocus={() => setFocusedField('6')}
                    placeholder="Ví dụ: Các ban Đảng, các đơn vị trực thuộc..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Nơi nhận (báo cáo / biết / thực hiện) [7]
                    <TooltipIcon text="Nơi nhận (báo cao / biết / thực hiện)" />
                  </label>
                  <textarea
                    value={formData.noiNhanBaoCao}
                    onChange={e => updateField('noiNhanBaoCao', e.target.value)}
                    onFocus={() => setFocusedField('7')}
                    placeholder="Ví dụ: Để biết, để thực hiện..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Người ký
                    <TooltipIcon text="Chức danh, Họ và tên" />
                  </label>
                  <input
                    type="text"
                    value={formData.nguoiKy}
                    onChange={e => updateField('nguoiKy', e.target.value)}
                    placeholder="Ví dụ: Bí thư Tỉnh ủy..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Menu 2: Văn bản chỉ đạo */}
            {currentMenu === 2 && (
              <div className="space-y-6">
                <div className="border-b border-red-200 pb-3">
                  <h2 className="text-lg font-bold text-red-600">2. Văn bản chỉ đạo</h2>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Văn bản chỉ đạo trực tiếp [8]
                    <TooltipIcon text="Upload tối đa 5 file văn bản chỉ đạo hoặc nhập nội dung" />
                  </label>
                  <FileUploadZone
                    maxFiles={5}
                    category="DIRECTIVE"
                    files={filesMap.DIRECTIVE}
                    onFilesChange={(newFiles: UploadingFile[] | ((prev: UploadingFile[]) => UploadingFile[])) => 
                      setFilesMap(prev => ({ 
                        ...prev, 
                        DIRECTIVE: typeof newFiles === 'function' ? newFiles(prev.DIRECTIVE) : newFiles 
                      }))
                    }
                  />
                  <textarea
                    value={formData.vanBanChiDao}
                    onChange={e => updateField('vanBanChiDao', e.target.value)}
                    onFocus={() => setFocusedField('8')}
                    placeholder="Hoặc nhập nội dung văn bản chỉ đạo tại đây..."
                    rows={6}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Văn bản pháp lý [9]
                    <TooltipIcon text="Upload tối đa 5 file văn bản pháp lý liên quan" />
                  </label>
                  {/* Văn bản pháp lý */}
                    <FileUploadZone
                      maxFiles={5}
                      category="LEGAL"
                      files={filesMap.LEGAL}
                      onFilesChange={(newFiles: UploadingFile[] | ((prev: UploadingFile[]) => UploadingFile[])) => 
                        setFilesMap(prev => ({ 
                          ...prev, 
                          LEGAL: typeof newFiles === 'function' ? newFiles(prev.LEGAL) : newFiles 
                        }))
                      }
                    />
                  <textarea
                    value={formData.vanBanPhapLy}
                    onChange={e => updateField('vanBanPhapLy', e.target.value)}
                    onFocus={() => setFocusedField('9')}
                    placeholder="Hoặc nhập nội dung văn bản pháp lý tại đây..."
                    rows={6}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* Menu 3: Nội dung, kết quả thực hiện */}
            {currentMenu === 3 && (
              <div className="space-y-6">
                <div className="border-b border-red-200 pb-3">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Menu 3 - Nội dung, kết quả thực hiện</h2>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Nội dung chính [10] <span className="text-red-500">*</span>
                    <TooltipIcon text="Nhập nội dung chính của văn bản hoặc upload file" />
                  </label>
                  <FileUploadZone
                    acceptedTypes=".doc,.docx,.pdf"
                    category="CONTENT"
                    files={filesMap.CONTENT}
                    onFilesChange={(newFiles: UploadingFile[] | ((prev: UploadingFile[]) => UploadingFile[])) => 
                      setFilesMap(prev => ({ 
                        ...prev, 
                        CONTENT: typeof newFiles === 'function' ? newFiles(prev.CONTENT) : newFiles 
                      }))
                    }
                    multiple
                  />
                  <textarea
                    value={formData.noiDungChinh}
                    onChange={e => updateField('noiDungChinh', e.target.value)}
                    onFocus={() => setFocusedField('10')}
                    placeholder="Hoặc nhập nội dung chính tại đây..."
                    rows={8}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white resize-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Tài liệu minh chứng [11]
                    <TooltipIcon text="Tài liệu minh chứng cho nội dung (phụ lục, bảng biểu, ảnh...)" />
                  </label>
                  <FileUploadZone
                    acceptedTypes=".doc,.docx,.pdf,.xls,.xlsx,.png,.jpg,.jpeg"
                    category="EVIDENCE"
                    files={filesMap.EVIDENCE}
                    onFilesChange={(newFiles: UploadingFile[] | ((prev: UploadingFile[]) => UploadingFile[])) => 
                      setFilesMap(prev => ({ 
                        ...prev, 
                        EVIDENCE: typeof newFiles === 'function' ? newFiles(prev.EVIDENCE) : newFiles 
                      }))
                    }
                    multiple
                  />
                  <textarea
                    value={formData.bangBieuSoLieu}
                    onChange={e => updateField('bangBieuSoLieu', e.target.value)}
                    onFocus={() => setFocusedField('11')}
                    placeholder="Hoặc nhập diễn giải tài liệu minh chứng, bảng biểu số liệu tại đây..."
                    rows={4}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* Menu 4: Mẫu văn bản */}
            {currentMenu === 4 && (
              <div className="space-y-6">
                <div className="border-b border-red-200 pb-3">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Menu 4 - Mẫu văn bản</h2>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Mẫu văn bản áp dụng [12]
                    <TooltipIcon text="Upload file mẫu hoặc nhập nội dung mẫu tham khảo" />
                  </label>
                  <FileUploadZone
                      category="TEMPLATE"
                      files={filesMap.TEMPLATE}
                      onFilesChange={(newFiles: UploadingFile[] | ((prev: UploadingFile[]) => UploadingFile[])) => 
                        setFilesMap(prev => ({ 
                          ...prev, 
                          TEMPLATE: typeof newFiles === 'function' ? newFiles(prev.TEMPLATE) : newFiles 
                        }))
                      }
                      multiple
                    />
                  <textarea
                    value={formData.mauVanBan}
                    onChange={e => updateField('mauVanBan', e.target.value)}
                    onFocus={() => setFocusedField('12')}
                    placeholder="Hoặc nhập nội dung mẫu văn bản tại đây..."
                    rows={8}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* Menu 5: Văn bản liên quan */}
            {currentMenu === 5 && (
              <div className="space-y-6">
                <div className="border-b border-red-200 pb-3">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Menu 5 - Văn bản liên quan</h2>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Văn bản / Tài liệu liên quan [14]
                    <TooltipIcon text="Upload nhiều file văn bản liên quan (tối đa 150 văn bản)" />
                  </label>
                  <FileUploadZone
                      multiple
                      maxFiles={150}
                      category="RELATED"
                      files={filesMap.RELATED}
                      onFilesChange={(newFiles: UploadingFile[] | ((prev: UploadingFile[]) => UploadingFile[])) => 
                        setFilesMap(prev => ({ 
                          ...prev, 
                          RELATED: typeof newFiles === 'function' ? newFiles(prev.RELATED) : newFiles 
                        }))
                      }
                    />
                </div>

                <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">Tùy chọn kiểm tra</h3>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.taophuluc}
                      onChange={e => updateField('taophuluc', e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-700 group-hover:text-gray-900">Tạo phụ lục tổng hợp kèm theo văn bản</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.doiChieu}
                      onChange={e => updateField('doiChieu', e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-700 group-hover:text-gray-900">Đối chiếu</div>
                      <div className="text-xs text-gray-500 mt-0.5">Kiểm tra sự thống nhất với văn bản liên quan</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.bamCanCu}
                      onChange={e => updateField('bamCanCu', e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-700 group-hover:text-gray-900">Bám căn cứ</div>
                      <div className="text-xs text-gray-500 mt-0.5">Đảm bảo tuân thủ các căn cứ pháp lý</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.theThucc}
                      onChange={e => updateField('theThucc', e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-700 group-hover:text-gray-900">Thể thức</div>
                      <div className="text-xs text-gray-500 mt-0.5">Kiểm tra thể thức văn bản theo quy chuẩn</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Menu 6: Tạo và xuất bản */}
            {currentMenu === 6 && (
              <div className="space-y-6">
                <div className="border-b border-red-200 pb-3">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Menu 6 - Tạo và xuất bản</h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mô hình AI
                  </label>
                  <select
                    value={formData.selectedModel}
                    onChange={e => updateField('selectedModel', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white"
                  >
                    <option value="claude-sonnet-4.6">Claude Sonnet 4.6 (Khuyến nghị)</option>
                    <option value="gpt-5.4-mini">GPT-5.4 Mini</option>
                    <option value="deepseek-v4-flash">DeepSeek V4 Flash</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Phong cách trình bày [15]
                    <TooltipIcon text="Sử dụng văn phong chính luận - hành chính Đảng" />
                  </label>
                  <input
                    type="text"
                    value={formData.phongCach}
                    onChange={e => updateField('phongCach', e.target.value)}
                    onFocus={() => setFocusedField('15')}
                    placeholder="Ví dụ: Trang trọng, chính thống..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Độ dài văn bản đầu ra [16]
                    <TooltipIcon text="Chỉ định độ dài văn bản mong muốn" />
                  </label>
                  <input
                    type="text"
                    value={formData.outputSize}
                    onChange={e => updateField('outputSize', e.target.value)}
                    onFocus={() => setFocusedField('16')}
                    placeholder="Ví dụ: Ngắn gọn (1-2 trang), Trung bình..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Mức độ hoàn chỉnh [17]
                    <TooltipIcon text="Trạng thái văn bản đầu ra" />
                  </label>
                  <select
                    value={formData.mucDoHoanChinh}
                    onChange={e => updateField('mucDoHoanChinh', e.target.value)}
                    onFocus={() => setFocusedField('17')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white"
                  >
                    <option value="">-- Chọn mức độ --</option>
                    <option value="ban-thao">Bản thảo sơ bộ</option>
                    <option value="hoan-chinh">Hoàn chỉnh</option>
                  </select>
                </div>

                {fileStats.total > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-xs font-semibold text-slate-700 mb-2">Trạng thái tải file</div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-slate-600">Thành công: {fileStats.success}</span>
                      </div>
                      {fileStats.uploading > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                          <span className="text-slate-600">Đang tải: {fileStats.uploading}</span>
                        </div>
                      )}
                      {fileStats.failed > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <span className="text-slate-600">Thất bại: {fileStats.failed}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <CreditEstimator
                  inputText={combinedInputText}
                  uploadedFiles={allUploadedFiles}
                  selectedModel={formData.selectedModel}
                  outputSize={formData.outputSize}
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <Sparkles size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm mb-2">Sẵn sàng tạo văn bản</h4>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        AI sẽ phân tích thông tin và tạo văn bản hoàn chỉnh theo quy chuẩn Đảng.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 bg-white px-8 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentMenu === 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentMenu === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            <ArrowLeft size={16} />
            Quay lại
          </button>

          <div className="text-xs text-gray-500">
            Bước {currentMenu} / 6
          </div>

          {/* Khu vực xử lý các nút bấm bên phải */}
          <div className="flex items-center gap-3">
            {currentMenu === 6 ? (
              <>
                {/* 📥 NÚT MỚI THÊM: Xuất file Word dang dở gửi về Backend */}
                <button
                  onClick={async () => {
                    // 📦 Đóng gói payload sạch sẽ tương tự cấu trúc lưu nháp đám mây
                    const uploadedFileIds = {
                      directive: (filesMap.DIRECTIVE || []).filter(f => f.status === 'SUCCESS' && f.backendFileId).map(f => f.backendFileId!),
                      legal: (filesMap.LEGAL || []).filter(f => f.status === 'SUCCESS' && f.backendFileId).map(f => f.backendFileId!),
                      content: (filesMap.CONTENT || []).filter(f => f.status === 'SUCCESS' && f.backendFileId).map(f => f.backendFileId!),
                      template: (filesMap.TEMPLATE || []).filter(f => f.status === 'SUCCESS' && f.backendFileId).map(f => f.backendFileId!),
                      related: (filesMap.RELATED || []).filter(f => f.status === 'SUCCESS' && f.backendFileId).map(f => f.backendFileId!),
                      evidence: (filesMap.EVIDENCE || []).filter(f => f.status === 'SUCCESS' && f.backendFileId).map(f => f.backendFileId!),
                    };

                    const wordCount = combinedInputText.trim().split(/\s+/).filter(Boolean).length;
                    const fileCount = allUploadedFiles.length;

                    const payload = {
                      formData,
                      uploadedFileIds,
                      status: "DRAFT",
                      wordCount,
                      fileCount
                    };

                    try {
                      // 🚀 BẮN API NGẦM VỀ BACKEND SPRING BOOT
                      const response = await fileApi.exportWordDraft(payload);
                      
                      // 💾 XỬ LÝ TỰ ĐỘNG TẢI FILE (.docx) VỀ MÁY CÁN BỘ (Nếu backend trả về file)
                      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                      const downloadUrl = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      link.download = `${formData.tenVanBan || 'Van_Ban_Dang_Do'}.docx`;
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                      window.URL.revokeObjectURL(downloadUrl);

                      alert("Đã xuất file Word và lưu bản nháp thành công!");
                    } catch (error) {
                      console.error("Lỗi khi gọi API xuất file Word:", error);
                      alert("Có lỗi xảy ra khi kết nối với hệ thống!");
                    }
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Upload size={16} className="rotate-180 text-gray-500" /> {/* Dùng icon Upload xoay ngược làm biểu tượng Download */}
                  Xuất file Word
                </button>

                {/* Nút Hoàn tất cũ của bạn */}
                <button
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md"
                >
                  <Sparkles size={16} />
                  Hoàn tất / Tạo nội dung
                </button>
              </>
            ) : (
              /* Nút Tiếp tục tại các bước 1-5 */
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Tiếp tục
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Contextual Help Panel */}
      <ContextualHelpPanel
        focusedField={focusedField}
        onExampleClick={handleExampleClick}
      />
    </div>
  );
}

/* Helper Functions[cite: 2] */

function generateDocumentContent(formData: FormData): string {
  const date = new Date(formData.ngayBanHanh);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="font-size: 11pt; font-weight: bold; margin-bottom: 8px;">${formData.coQuanBanHanh || '[CƠ QUAN BAN HÀNH]'}</div>
      <div style="font-size: 12pt; font-weight: bold; margin-bottom: 4px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
      <div style="font-size: 11pt; margin-bottom: 4px;">Độc lập - Tự do - Hạnh phúc</div>
      <div style="border-bottom: 1px solid #000; width: 120px; margin: 8px auto;"></div>
      <div style="font-size: 10pt; font-style: italic; color: #666;">${formData.diaDanh || 'Hà Nội'}, ngày ${day} tháng ${month} năm ${year}</div>
    </div>

    <div style="margin-bottom: 16px;">
      <div style="font-size: 11pt; font-weight: 600;">Số: ${formData.soKyHieu || '01/BC-XXX'}</div>
    </div>

    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="font-size: 14pt; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">${formData.loaiVanBan || 'BÁO CÁO'}</h1>
      <div style="font-size: 12pt;">Về việc ${formData.tenVanBan || '___________'}</div>
      <div style="border-bottom: 1px solid #000; width: 80px; margin: 12px auto;"></div>
    </div>

    <div style="margin-bottom: 24px;">
      ${formData.noiNhan ? `<p style="text-indent: 40px; margin-bottom: 16px;">Kính gửi: ${formData.noiNhan}</p>` : ''}

      ${formData.noiDungChinh ? `
        <p style="text-indent: 40px; margin-bottom: 16px; white-space: pre-wrap;">${formData.noiDungChinh}</p>
      ` : `
        <p style="text-indent: 40px; margin-bottom: 16px;">
          Thực hiện chỉ đạo của ${formData.coQuanChuQuan || '[Cơ quan chủ quản]'}, ${formData.coQuanBanHanh || '[Đơn vị]'} báo cáo kết quả thực hiện nhiệm vụ như sau:
        </p>

        <p style="font-weight: bold; margin-top: 24px; margin-bottom: 12px;">I. TÌNH HÌNH CHUNG</p>
        <p style="text-indent: 40px; margin-bottom: 16px;">
          [Nội dung sẽ được AI tạo dựa trên dữ liệu bạn cung cấp. Bạn có thể chỉnh sửa trực tiếp hoặc yêu cầu AI tinh chỉnh...]
        </p>

        <p style="font-weight: bold; margin-top: 24px; margin-bottom: 12px;">II. KẾT QUẢ ĐẠT ĐƯỢC</p>
        <p style="text-indent: 40px; margin-bottom: 16px;">
          [Nội dung chi tiết về kết quả thực hiện...]
        </p>

        <p style="font-weight: bold; margin-top: 24px; margin-bottom: 12px;">III. NHỮNG TỒN TẠI, HẠN CHẾ</p>
        <p style="text-indent: 40px; margin-bottom: 16px;">
          [Phân tích những khó khăn, hạn chế trong quá trình thực hiện...]
        </p>

        <p style="font-weight: bold; margin-top: 24px; margin-bottom: 12px;">IV. PHƯƠNG HƯỚNG NHIỆM VỤ THỜI GIAN TỚI</p>
        <p style="text-indent: 40px; margin-bottom: 16px;">
          [Đề xuất phương hướng, nhiệm vụ, giải pháp thời gian tới...]
        </p>
      `}

      ${formData.noiNhanBaoCao ? `
        <div style="margin-top: 32px;">
          <p style="font-weight: bold; margin-bottom: 8px;">Nơi nhận:</p>
          <p style="white-space: pre-wrap; font-size: 10.5pt;">${formData.noiNhanBaoCao}</p>
        </div>
      ` : ''}
    </div>

    <div style="margin-top: 48px; text-align: right;">
      <div style="font-weight: bold; margin-bottom: 4px;">${formData.nguoiKy || '[Chức danh người ký]'}</div>
      <div style="margin-top: 60px; font-weight: bold;">[Họ và tên]</div>
    </div>
  `;
}

/* Helper Components[cite: 2] */

function DocumentPreview({ formData }: { formData: FormData }) {
  return (
    <div className="max-w-2xl mx-auto py-12 px-12 bg-white min-h-full">
      <div className="text-center mb-8">
        <div className="text-xs font-semibold mb-2">[CƠ QUAN BAN HÀNH]</div>
        <div className="text-sm font-bold mb-1">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div className="text-xs mb-1">Độc lập - Tự do - Hạnh phúc</div>
        <div className="w-32 h-px bg-gray-400 mx-auto mb-1" />
        <div className="text-xs text-gray-500 italic">
          [{formData.diaDanh || 'Địa danh'}, ngày {new Date(formData.ngayBanHanh).getDate()} tháng {new Date(formData.ngayBanHanh).getMonth() + 1} năm {new Date(formData.ngayBanHanh).getFullYear()}]
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xs font-semibold mb-2">Số: {formData.soKyHieu || '01/TB-XXX'}</div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-lg font-bold mb-2">
          {formData.loaiVanBan || 'THÔNG BÁO'}
        </h1>
        <div className="text-sm">
          Về việc {formData.tenVanBan || '___________'}
        </div>
        <div className="w-20 h-px bg-gray-900 mx-auto mt-2" />
      </div>

      <div className="space-y-4 text-sm leading-relaxed">
        <div>
          <span className="font-semibold">Nơi nhận:</span>
          <div className="ml-4 mt-1 text-gray-700">
            {formData.noiNhan || '[CHỨC VỤ]'}
          </div>
        </div>

        {formData.noiDungChinh && (
          <div className="mt-6">
            <div className="whitespace-pre-wrap text-gray-700">
              {formData.noiDungChinh}
            </div>
          </div>
        )}

        {!formData.noiDungChinh && (
          <div className="text-gray-400 text-center py-8 italic text-xs">
            AI có thể mắc sai sót. Hãy kiểm tra lại thông tin quan trọng.
          </div>
        )}
      </div>

      <div className="mt-12 text-right text-sm">
        <div className="font-semibold mb-1">[Họ và tên]</div>
      </div>
    </div>
  );
}

function TooltipIcon({ text }: { text: string }) {
  return (
    <div className="group relative inline-block">
      <Info size={14} className="text-gray-400 cursor-help" />
      <div className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}

function FileUploadZone({
  multiple = false,
  maxFiles = 5,
  acceptedTypes = '.doc,.docx,.pdf,.xls,.xlsx',
  category,
  files = [],
  onFilesChange
}: {
  multiple?: boolean;
  maxFiles?: number;
  acceptedTypes?: string;
  category: FileCategory;
  files: UploadingFile[];
  onFilesChange: React.Dispatch<React.SetStateAction<UploadingFile[]>> | ((files: UploadingFile[]) => void);
}) {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const currentCount = files.length;
    const availableSlots = maxFiles - currentCount;
    const filesToAdd = selectedFiles.slice(0, availableSlots);

    if (filesToAdd.length === 0) {
      alert(`Đã đạt giới hạn tối đa ${maxFiles} file`);
      return;
    }

    const newUploadingFiles: UploadingFile[] = filesToAdd.map((file, index) => ({
      id: `tmp_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
      file: file,
      progress: 0,
      status: 'PENDING'
    }));

    // Bọc logic cập nhật tương thích với cấu trúc cha Map mới
    const updateHook = (updater: any) => {
      if (typeof onFilesChange === 'function' && onFilesChange.prototype === undefined) {
        const nextFiles = typeof updater === 'function' ? updater(files) : updater;
        (onFilesChange as (files: UploadingFile[]) => void)(nextFiles);
      }
    };

    updateHook([...files, ...newUploadingFiles]);

    newUploadingFiles.forEach((fileItem) => {
      uploadFileToServer(
        fileItem,
        category,
        (fileId, progress) => {
          if (typeof onFilesChange === 'function') {
            onFilesChange(prev => prev.map(f => f.id === fileId ? { ...f, progress } : f));
          }
        },
        (fileId, status, backendFileId, error) => {
          if (typeof onFilesChange === 'function') {
            onFilesChange(prev => prev.map(f => f.id === fileId ? { ...f, status, backendFileId, error } : f));
          }
        }
      );
    });

    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    const input = document.createElement('input');
    input.type = 'file';
    const dataTransfer = new DataTransfer();
    droppedFiles.forEach(file => dataTransfer.items.add(file));
    input.files = dataTransfer.files;

    handleFileInput({ target: input } as any);
  };

  const removeFile = async (fileItem: UploadingFile, index: number) => {
    if (fileItem.status === 'SUCCESS' && fileItem.backendFileId) {
      await deleteFileFromServer(fileItem.backendFileId);
    }

    const newFiles = files.filter((_, i) => i !== index);
    if (typeof onFilesChange === 'function') {
      onFilesChange(newFiles);
    }
  };

  return (
    <div>
      <label
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer block"
      >
        <input
          type="file"
          multiple={multiple}
          accept={acceptedTypes}
          onChange={handleFileInput}
          className="hidden"
        />
        <Upload size={32} className="mx-auto text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-700 mb-1">
          Kéo thả file vào đây hoặc click để chọn
        </p>
        <p className="text-xs text-gray-500">
          {multiple && `Hỗ trợ nhiều file (tối đa ${maxFiles}) • `}
          {acceptedTypes}
        </p>
        {files.length > 0 && (
          <p className="text-xs text-blue-600 mt-1 font-medium">
            Đã tải: {files.filter(f => f.status === 'SUCCESS').length}/{files.length}
          </p>
        )}
      </label>

      {files.length > 0 && (
        <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
          {files.map((fileItem, index) => (
            <div key={fileItem.id} className="flex flex-col p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <File size={14} className={`flex-shrink-0 ${
                    fileItem.status === 'SUCCESS' ? 'text-green-600' :
                    fileItem.status === 'FAILED' ? 'text-red-500' :
                    'text-blue-600'
                  }`} />
                  <span className="font-medium text-slate-700 truncate">{fileItem.file.name}</span>
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {(fileItem.file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  onClick={() => removeFile(fileItem, index)}
                  className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-red-600 transition-colors ml-2"
                  disabled={fileItem.status === 'UPLOADING'}
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${
                  fileItem.status === 'SUCCESS' ? 'text-green-600' :
                  fileItem.status === 'FAILED' ? 'text-red-500' :
                  fileItem.status === 'UPLOADING' ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {fileItem.status === 'SUCCESS' && '✓ Đã lên hệ thống'}
                  {fileItem.status === 'UPLOADING' && `Đang tải... ${fileItem.progress}%`}
                  {fileItem.status === 'FAILED' && `✕ Lỗi: ${fileItem.error || 'Upload failed'}`}
                  {fileItem.status === 'PENDING' && 'Chờ tải...'}
                </span>

                {fileItem.backendFileId && (
                  <span className="text-xs text-gray-400 font-mono">ID: {fileItem.backendFileId.slice(0, 12)}...</span>
                )}
              </div>

              {fileItem.status === 'UPLOADING' && (
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-blue-600 h-full transition-all duration-200"
                    style={{ width: `${fileItem.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}