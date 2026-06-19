import { useState } from 'react';
import {
  FileText, Upload, Calendar, ChevronDown, Info,
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles, X, File, Eye
} from 'lucide-react';
import { ContextualHelpPanel } from '../../components/ContextualHelpPanel';
import { UploadingFile } from '../../services/fileUpload';
import { useAssistantFiles } from '../../services/useAssistantFiles';

interface QuanLyGiaoDucFormProps {
  onGenerate?: (data: any) => void;
}

type MenuSection = 1 | 2 | 3 | 4 | 5 | 6;

interface FormData {
  // Menu 1
  loaiVanBan: string;
  capHoc: string;
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
  vanBanChiDaoTrucTiep: string;
  huongDanChuongTrinhBoGD: string;
  vanBanPhapLyKhac: string;

  // Menu 3
  noiDung: string;
  namHoc: string;
  noiDungTheoKy: string;
  bangBieuSoLieu: string;
  taiLieuMinhChung: File[];

  // Menu 4
  mauVanBan: string;
  mauDeCuong: string;

  // Menu 5
  vanBanLienQuan: string;
  taiLieuHocThuyet: string;
  taoPhuluc: boolean;
  doiChieu: boolean;
  kiemTraBamCanCu: boolean;
  kiemTraTheThuc: boolean;
  

  // Menu 6
  phongCach: string;
  doDai: string;
  mucDoHoanChinh: string;
  selectedModel: string;
}

export function QuanLyGiaoDucForm({ onGenerate }: QuanLyGiaoDucFormProps) {
  const [currentMenu, setCurrentMenu] = useState<MenuSection>(1);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Khởi tạo hook để quản lý file
  const { getFiles, handleUpload, handleRemove, getBackendPayload } = useAssistantFiles();

  const [formData, setFormData] = useState<FormData>({
    loaiVanBan: '',
    capHoc: '',
    tenVanBan: '',
    coQuanChuQuan: '',
    coQuanBanHanh: '',
    diaDanh: '',
    nguoiKy: '',
    soKyHieu: '',
    noiNhan: '',
    noiNhanBaoCao: '',
    ngayBanHanh: new Date().toISOString().split('T')[0],
    vanBanChiDaoTrucTiep: '',
    huongDanChuongTrinhBoGD: '',
    vanBanPhapLyKhac: '',
    noiDung: '',
    namHoc: '',
    noiDungTheoKy: '',
    bangBieuSoLieu: '',
    taiLieuMinhChung: [],
    mauVanBan: '',
    mauDeCuong: '',
    vanBanLienQuan: '',
    taiLieuHocThuyet: '',
    taoPhuluc: false,
    doiChieu: false,
    kiemTraBamCanCu: false,
    kiemTraTheThuc: false,
    phongCach: '',
    doDai: '',
    mucDoHoanChinh: '',
    selectedModel: 'claude-sonnet-4.6',
  });

  const menus = [
    { id: 1 as MenuSection, title: 'Thông tin văn bản', completed: false },
    { id: 2 as MenuSection, title: 'Văn bản chỉ đạo', completed: false },
    { id: 3 as MenuSection, title: 'Nội dung, kết quả thực hiện', completed: false },
    { id: 4 as MenuSection, title: 'Mẫu văn bản', completed: false },
    { id: 5 as MenuSection, title: 'Văn bản liên quan', completed: false },
    { id: 6 as MenuSection, title: 'Tạo và xuất bản', completed: false },
  ];

  const loaiVanBanOptions = [
    'Công văn',
    'Thông báo',
    'Kế hoạch',
    'Báo cáo',
    'Thỏa thuận',
    'Dự án',
    'Tờ trình',
    'Hướng dẫn'
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
    if (onGenerate) {
      onGenerate({ ...formData, filePayloads: getBackendPayload() });
    }
  };

  const handleExampleClick = (value: string) => {
    if (!focusedField) return;

    const fieldMap: Record<string, keyof FormData> = {
      '35': 'tenVanBan',
      '36': 'coQuanChuQuan',
      '37': 'coQuanBanHanh',
      '38': 'diaDanh',
      '39': 'soKyHieu',
      '40': 'noiNhan',
      '41': 'noiNhanBaoCao',
      '42': 'vanBanChiDaoTrucTiep',
      '43': 'huongDanChuongTrinhBoGD',
      '43_2': 'vanBanPhapLyKhac',
      '45': 'noiDung',
      '46': 'bangBieuSoLieu',
      '47': 'mauVanBan',
      '48': 'mauDeCuong',
      '49': 'vanBanLienQuan',
      '50': 'phongCach',
      '51': 'doDai',
      '52': 'mucDoHoanChinh',
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
                  <p className="text-sm text-gray-500">Nhập thông tin cơ bản về văn bản giáo dục</p>
                </div>

                {/* Loại văn bản */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Loại văn bản <span className="text-red-500">*</span>
                    <TooltipIcon text="Công văn, Thông báo, Kế hoạch, Báo cáo, Thỏa thuận, Dự án" />
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

                {/* Tên văn bản */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Tên văn bản muốn ban hành [35] <span className="text-red-500">*</span>
                    <TooltipIcon text="VD: Báo cáo kết quả thực hiện năm học 2027 - 2028,...." />
                  </label>
                  <input
                    type="text"
                    value={formData.tenVanBan}
                    onChange={e => updateField('tenVanBan', e.target.value)}
                    onFocus={() => setFocusedField('35')}
                    placeholder="Ví dụ: Báo cáo kết quả thực hiện năm học 2027 - 2028..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Cơ quan chủ quản */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Cơ quan chủ quản [36]
                    <TooltipIcon text="Cơ quan quản lý NN cấp trên trực tiếp của cơ quan mình." />
                  </label>
                  <input
                    type="text"
                    value={formData.coQuanChuQuan}
                    onChange={e => updateField('coQuanChuQuan', e.target.value)}
                    onFocus={() => setFocusedField('36')}
                    placeholder="Ví dụ: Uỷ ban nhân dân tỉnh, Uỷ ban nhân dân xã..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Cơ quan ban hành */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Cơ quan ban hành [37]
                    <TooltipIcon text="Cơ quan NN ban hành văn bản" />
                  </label>
                  <input
                    type="text"
                    value={formData.coQuanBanHanh}
                    onChange={e => updateField('coQuanBanHanh', e.target.value)}
                    onFocus={() => setFocusedField('37')}
                    placeholder="Ví dụ: Sở GD&ĐT; Trường Tiểu học..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Địa danh */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Địa danh nơi ban hành văn bản [38]
                    <TooltipIcon text="Địa danh nơi ban hành văn bản." />
                  </label>
                  <input
                    type="text"
                    value={formData.diaDanh}
                    onChange={e => updateField('diaDanh', e.target.value)}
                    onFocus={() => setFocusedField('38')}
                    placeholder="Ví dụ: TP Hà Nội..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Ngày ban hành */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Ngày ban hành
                    <TooltipIcon text="Ngày/tháng/năm" />
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

                {/* Số, ký hiệu văn bản */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Số, ký hiệu văn bản [39]
                    <TooltipIcon text="Số văn bản, ký hiệu văn bản" />
                  </label>
                  <input
                    type="text"
                    value={formData.soKyHieu}
                    onChange={e => updateField('soKyHieu', e.target.value)}
                    onFocus={() => setFocusedField('39')}
                    placeholder="Ví dụ: 15-CV/SGD; 30-KH/TH..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Kinh gửi / Nơi nhận chính */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Kính gửi / nơi nhận chính [40]
                    <TooltipIcon text="Cơ quan, đơn vị, cá nhân nhận văn bản" />
                  </label>
                  <textarea
                    value={formData.noiNhan}
                    onChange={e => updateField('noiNhan', e.target.value)}
                    onFocus={() => setFocusedField('40')}
                    placeholder="Ví dụ: Đồng chí ...... UBND các xã,...."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {/* Nơi nhận (báo cáo / biết / thực hiện) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Nơi nhận (báo cáo / biết / thực hiện)  [41]
                    <TooltipIcon text="Gồm: Cấp trên, đơn vị phối hợp; Đơn vị chịu trách nhiệm triển khai, thực hiện" />
                  </label>
                  <textarea
                    value={formData.noiNhanBaoCao}
                    onChange={e => updateField('noiNhanBaoCao', e.target.value)}
                    onFocus={() => setFocusedField('41')}
                    placeholder="Ví dụ: Chi bộ trường, Tổ chuyên môn...."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {/* Người ký */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Người ký
                    <TooltipIcon text="Chức danh, Họ và tên" />
                  </label>
                  <input
                    type="text"
                    value={formData.nguoiKy}
                    onChange={e => updateField('nguoiKy', e.target.value)}
                    placeholder="Ví dụ: Hiệu trưởng..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Menu 2: Văn bản chỉ đạo */}
            {currentMenu === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 2 - Văn bản chỉ đạo</h2>
                  <p className="text-sm text-gray-500">Upload hoặc nhập văn bản chỉ đạo liên quan</p>
                </div>

                {/* Văn bản chỉ đạo trực tiếp */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Văn bản chỉ đạo trực tiếp [42]
                    <TooltipIcon text="Sử dụng văn bản này để: Bám sát / tổng hợp / tham khảo / Trích yếu văn bản làm căn cứ / đối chiếu / trích ý / theo yêu cầu chỉ đạo" />
                  </label>
                  <FileUploadZone
                    maxFiles={5}
                    files={getFiles('DIRECTIVE')}
                    onUpload={files => handleUpload('DIRECTIVE', files)}
                    onRemove={id => handleRemove('DIRECTIVE', id)}
                  />
                  <textarea
                    value={formData.vanBanChiDaoTrucTiep}
                    onChange={e => updateField('vanBanChiDaoTrucTiep', e.target.value)}
                    onFocus={() => setFocusedField('42')}
                    placeholder="Hoặc nhập nội dung văn bản chỉ đạo và yêu cầu sử dụng..."
                    rows={4}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {/* Hướng dẫn, chương trình của Bộ GD&ĐT */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Tải văn bản pháp lý / căn cứ liên quan [43]
                    <TooltipIcon text="Sử dụng văn bản này để: Bám sát / tổng hợp / tham khảo / Trích yếu văn bản làm căn cứ / đối chiếu / trích ý / nghiên cứu để lồng ghép / Trích dẫn trực tiếp..." />
                  </label>
                  <FileUploadZone
                    maxFiles={5}
                    files={getFiles('LEGAL')}
                    onUpload={files => handleUpload('LEGAL', files)}
                    onRemove={id => handleRemove('LEGAL', id)}
                  />
                  <textarea
                    value={formData.huongDanChuongTrinhBoGD}
                    onChange={e => updateField('huongDanChuongTrinhBoGD', e.target.value)}
                    onFocus={() => setFocusedField('43')}
                    placeholder="Hoặc nhập nội dung hướng dẫn từ Bộ GD&ĐT và yêu cầu sử dụng..."
                    rows={4}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* Menu 3: Nội dung, kết quả thực hiện */}
            {currentMenu === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 3 - Nội dung, kết quả thực hiện</h2>
                  <p className="text-sm text-gray-500">Nhập nội dung và kết quả theo năm học</p>
                </div>

                {/* Cấp học */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Cấp học [44]
                    <TooltipIcon text="Mầm non, Tiểu học, THCS, THPT, GDTX" />
                  </label>
                  <select
                    value={formData.capHoc}
                    onChange={e => updateField('capHoc', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  >
                    <option value="">-- Chọn cấp học --</option>
                    {['Mầm non', 'Tiểu học', 'THCS', 'THPT', 'GDTX'].map(op => <option key={op} value={op}>{op}</option>)}
                  </select>
                </div>

                {/* Nội dung */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Nội dung [45] <span className="text-red-500">*</span>
                    <TooltipIcon text="Nội dung chính; Tình hình nhà trường, số liệu lớp, học sinh, giáo viên, kết quả giáo dục, thi đua; hạn chế, khó khăn; Nguyên nhân; nhiệm vụ, giải pháp; đề xuất..." />
                  </label>
                  <FileUploadZone
                    acceptedTypes=".doc,.docx,.pdf"
                    files={getFiles('CONTENT')}
                    onUpload={files => handleUpload('CONTENT', files)}
                    onRemove={id => handleRemove('CONTENT', id)}
                    multiple
                  />
                  <textarea
                    value={formData.noiDung}
                    onChange={e => updateField('noiDung', e.target.value)}
                    onFocus={() => setFocusedField('45')}
                    placeholder="Hoặc nhập nội dung chính, tình hình, kết quả, giải pháp..."
                    rows={8}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {/* Năm học */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Năm học
                    <TooltipIcon text="Năm học, Học kỳ, Niên học: 2024-2025, 2025-2026, ..." />
                  </label>
                  <input
                    type="text"
                    value={formData.namHoc}
                    onChange={e => updateField('namHoc', e.target.value)}
                    placeholder="Ví dụ: 2025-2026, Học kỳ I năm học 2025-2026..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Nội dung, nhiệm vụ, quý (nếu có) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Bảng biểu, số liệu thực hiện kèm theo (File Word, Excel,...) (nếu có)
                    <TooltipIcon text="Kỳ trước, Học kỳ, Quý, Các quý trước đó, Các nội dung theo thời gian" />
                  </label>
                  <FileUploadZone
                    files={getFiles('CONTENT')}
                    onUpload={files => handleUpload('CONTENT', files)}
                    onRemove={id => handleRemove('CONTENT', id)}
                  />
                  <textarea
                    value={formData.noiDungTheoKy}
                    onChange={e => updateField('noiDungTheoKy', e.target.value)}
                    placeholder="Ví dụ: Kết quả Học kỳ I, Quý 1..."
                    rows={4}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {/* Bảng biểu, số liệu bình luận kèm theo */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Tài liệu minh chứng [46]
                    <TooltipIcon text="Nội dung hoặc File phụ lục, bảng biểu, ảnh, biên bản, báo cáo con" />
                  </label>
                  <FileUploadZone
                    acceptedTypes=".xls,.xlsx,.doc,.docx,.pdf,.png,.jpg"
                    files={getFiles('EVIDENCE')}
                    onUpload={files => handleUpload('EVIDENCE', files)}
                    onRemove={id => handleRemove('EVIDENCE', id)}
                    multiple
                  />
                  <textarea
                    value={formData.bangBieuSoLieu}
                    onChange={e => updateField('bangBieuSoLieu', e.target.value)}
                    onFocus={() => setFocusedField('46')}
                    placeholder="Tài liệu minh chứng nội dung nào"
                    rows={4}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* Menu 4: Mẫu văn bản */}
            {currentMenu === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 4 - Mẫu văn bản</h2>
                  <p className="text-sm text-gray-500">Cung cấp mẫu văn bản và đề cương tham khảo</p>
                </div>

                {/* Mẫu văn bản áp dụng */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Mẫu văn bản áp dụng [47]
                    <TooltipIcon text="Tải văn bản thực tế chuẩn bạn đã dùng trước đó để sử dụng làm mẫu. Yêu cầu: Sử dụng mẫu đó làm chuẩn về bố cục, dàn ý, thể thức, phong cách trình bày, văn phong." />
                  </label>
                  <FileUploadZone
                    files={getFiles('TEMPLATE')}
                    onUpload={files => handleUpload('TEMPLATE', files)}
                    onRemove={id => handleRemove('TEMPLATE', id)}
                  />
                  <textarea
                    value={formData.mauVanBan}
                    onChange={e => updateField('mauVanBan', e.target.value)}
                    onFocus={() => setFocusedField('47')}
                    placeholder="Hoặc nhập nội dung mẫu văn bản tại đây..."
                    rows={8}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {/* Mẫu Đề cương: Dàn ý văn bản */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Mẫu Đề cương: Dàn ý văn bản [48]
                    <TooltipIcon text="Sử dụng đề cương đó làm khung nội dung chính." />
                  </label>
                  <FileUploadZone
                    files={getFiles('TEMPLATE')}
                    onUpload={files => handleUpload('TEMPLATE', files)}
                    onRemove={id => handleRemove('TEMPLATE', id)}
                  />
                  <textarea
                    value={formData.mauDeCuong}
                    onChange={e => updateField('mauDeCuong', e.target.value)}
                    onFocus={() => setFocusedField('48')}
                    placeholder="Hoặc nhập đề cương dàn ý tại đây..."
                    rows={8}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* Menu 5: Văn bản liên quan */}
            {currentMenu === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 5 - Văn bản liên quan</h2>
                  <p className="text-sm text-gray-500">Upload văn bản và tài liệu liên quan</p>
                </div>

                {/* Văn bản/Tài liệu liên quan */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Văn bản / Tài liệu liên quan [49]
                    <TooltipIcon text="Yêu cầu theo từng văn bản: - ưu tiên Văn bản nào ? - Dùng để: Tổng hợp, đối chiếu, trích ý, làm phụ lục, Trích dẫn trực tiếp, tham khảo nội dung, tổng hợp ý chính,..." />
                  </label>
                  <FileUploadZone
                    multiple maxFiles={150}
                    files={getFiles('RELATED')}
                    onUpload={files => handleUpload('RELATED', files)}
                    onRemove={id => handleRemove('RELATED', id)}
                  />
                  <textarea
                    value={formData.vanBanLienQuan}
                    onChange={e => updateField('vanBanLienQuan', e.target.value)}
                    onFocus={() => setFocusedField('49')}
                    placeholder="Hoặc nhập danh sách văn bản liên quan..."
                    rows={4}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>


                {/* Tùy chọn kiểm tra */}
                <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">Tùy chọn kiểm tra</h3>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.taoPhuluc}
                      onChange={e => updateField('taoPhuluc', e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-700 group-hover:text-gray-900">Tạo phụ lục tổng hợp kèm theo văn bản</div>
                      <div className="text-xs text-gray-500 mt-0.5"></div>
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
                      checked={formData.kiemTraBamCanCu}
                      onChange={e => updateField('kiemTraBamCanCu', e.target.checked)}
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
                      checked={formData.kiemTraTheThuc}
                      onChange={e => updateField('kiemTraTheThuc', e.target.checked)}
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
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 6 - Tạo và xuất bản</h2>
                  <p className="text-sm text-gray-500">Tùy chỉnh yêu cầu văn bản đầu ra</p>
                </div>

                {/* Mô hình AI */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mô hình AI
                  </label>
                  <select
                    value={formData.selectedModel}
                    onChange={e => updateField('selectedModel', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  >
                    <option value="claude-sonnet-4.6">Claude Sonnet 4.6 (Khuyến nghị)</option>
                    <option value="gpt-5.4-mini">GPT-5.4 Mini</option>
                    <option value="deepseek-v4-flash">DeepSeek V4 Flash</option>
                  </select>
                </div>

                {/* Phong cách trình bày */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Phong cách trình bày [50]
                    <TooltipIcon text="Văn phong phải chuẩn hành chính, trang trọng, chính xác, mạch lạc, phù hợp với ngành giáo dục và nhà trường." />
                  </label>
                  <input
                    type="text"
                    value={formData.phongCach}
                    onChange={e => updateField('phongCach', e.target.value)}
                    onFocus={() => setFocusedField('50')}
                    placeholder="Ví dụ: Trang trọng, chính xác, mạch lạc..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Độ dài văn bản */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Độ dài văn bản [51]
                    <TooltipIcon text="Trình bày: Ngắn gọn, trung bình, đầy đủ, chi tiết; khoảng ....... từ (560 từ - 580 từ = 1 trang A4)" />
                  </label>
                  <input
                    type="text"
                    value={formData.doDai}
                    onChange={e => updateField('doDai', e.target.value)}
                    onFocus={() => setFocusedField('51')}
                    placeholder="Ví dụ: Trung bình (3 trang A4), khoảng 1500 từ..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Mức độ hoàn chỉnh */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Mức độ hoàn chỉnh [52]
                    <TooltipIcon text="Tạo Bản nháp, bản rút gọn, bản hoàn chỉnh, bản trình ký" />
                  </label>
                  <select
                    value={formData.mucDoHoanChinh}
                    onChange={e => updateField('mucDoHoanChinh', e.target.value)}
                    onFocus={() => setFocusedField('52')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  >
                    <option value="">-- Chọn mức độ --</option>
                    <option value="ban-nhap">Bản nháp</option>
                    <option value="rut-gon">Bản rút gọn</option>
                    <option value="hoan-chinh">Bản hoàn chỉnh</option>
                    <option value="trinh-ky">Bản trình ký</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <Sparkles size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm mb-2">Sẵn sàng tạo văn bản</h4>
                      <p className="text-xs text-blue-700 leading-relaxed mb-3">
                        AI sẽ phân tích thông tin và tạo văn bản giáo dục hoàn chỉnh.
                      </p>
                      <div className="text-xs text-blue-600 space-y-1">
                        <div>• <strong>Nháp = Bật phát gợi</strong> - Mode 1</div>
                        <div>• <strong>Hoàn chỉnh - Trình Ký</strong> - Mode 2</div>
                      </div>
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

          {currentMenu < 6 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Tiếp tục
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md"
            >
              <Sparkles size={16} />
              Hoàn tất / Tạo nội dung
            </button>
          )}
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

/* Helper Components */

function DocumentPreview({ formData }: { formData: FormData }) {
  return (
    <div className="max-w-2xl mx-auto py-12 px-12 bg-white min-h-full">
      {/* Header */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="text-left text-xs">
          <div className="font-semibold mb-1">{formData.coQuanChuQuan || '[CƠ QUAN CHỦ QUẢN]'}</div>
          <div className="font-semibold">{formData.coQuanBanHanh || '[CƠ QUAN BAN HÀNH]'}</div>
        </div>
        <div className="text-center text-xs">
          <div className="font-bold mb-1">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div className="mb-1">Độc lập - Tự do - Hạnh phúc</div>
          <div className="w-24 h-px bg-gray-400 mx-auto mb-1" />
          <div className="italic text-gray-500">
            {formData.diaDanh || 'Địa danh'}, ngày {new Date(formData.ngayBanHanh).getDate()} tháng {new Date(formData.ngayBanHanh).getMonth() + 1} năm {new Date(formData.ngayBanHanh).getFullYear()}
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-lg font-bold mb-2">
          {formData.loaiVanBan || 'LOẠI VĂN BẢN'}
        </h1>
        <div className="text-sm mb-1">
          Về việc {formData.tenVanBan || '___________'}
        </div>
        <div className="text-xs italic text-gray-600">
          ({formData.namHoc || 'Năm học ...'})
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 text-sm leading-relaxed">
        {formData.noiDung && (
          <div className="whitespace-pre-wrap text-gray-700">
            {formData.noiDung}
          </div>
        )}

        {!formData.noiDung && (
          <div className="text-gray-400 text-center py-8 italic text-xs">
            Nhập nội dung để xem trước văn bản
          </div>
        )}
      </div>

      {/* Signature */}
      <div className="mt-12 grid grid-cols-2 gap-8 text-sm">
        <div className="text-center">
          <div className="font-semibold mb-8">Nơi nhận:</div>
          <div className="text-xs text-gray-600">
            {formData.noiNhan || '- ...'}
          </div>
        </div>
        <div className="text-center">
          <div className="font-semibold mb-1">{formData.nguoiKy || '[Người ký]'}</div>
        </div>
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
  files,
  onUpload,
  onRemove
}: {
  multiple?: boolean;
  maxFiles?: number;
  acceptedTypes?: string;
  files: UploadingFile[];
  onUpload: (files: File[]) => void;
  onRemove: (fileId: string) => void;
}) {
  const processFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;
    const currentCount = files.length;
    const availableSlots = maxFiles - currentCount;
    const filesToAdd = selectedFiles.slice(0, availableSlots);

    if (filesToAdd.length === 0) {
      alert(`Đã đạt giới hạn tối đa ${maxFiles} file`);
      return;
    }
    onUpload(filesToAdd);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(Array.from(e.target.files || []));
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    processFiles(Array.from(e.dataTransfer.files));
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
          {files.map((fileItem) => (
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
                  onClick={() => onRemove(fileItem.id)}
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
