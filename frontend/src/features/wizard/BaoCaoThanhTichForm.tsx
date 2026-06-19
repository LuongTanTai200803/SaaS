import { useState } from 'react';
import {
  Upload, Info, CheckCircle2, Sparkles, X, File, Eye, ChevronLeft, ChevronRight, FileDown, MessageSquare, Save
} from 'lucide-react';
import { EXTERNAL_LINKS } from '../../api/urls';
import { ContextualHelpPanel } from '../../components/ContextualHelpPanel';

interface BaoCaoThanhTichFormProps {
  onGenerate?: (data: any) => void;
}

type MenuSection = 'menu1' | 'menu2' | 'menu3' | 'menu4';

interface FormData {
  // Menu 1
  loaiVanBan: string;
  tenTieuDe: string;
  vanBanCuaDoiTuong: string;
  hoTen: string;
  chucVu: string;
  donViCongTac: string;

  // Menu 2
  noiDungChinhKetQua: string;
  bangBieuSoLieu: string;
  tuDanhGiaXepLoai: string;

  // Menu 3
  mauVanBan: string;
  deCuongDanY: string;

  // Menu 4
  phongCachTrinhBay: string;
  doDaiVanBan: string;
  mucDoHoanChinh: string;
}

export function BaoCaoThanhTichForm({ onGenerate }: BaoCaoThanhTichFormProps) {
  const [currentMenu, setCurrentMenu] = useState<MenuSection>('menu1');
  const [generatedContent, setGeneratedContent] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    loaiVanBan: '',
    tenTieuDe: '',
    vanBanCuaDoiTuong: '',
    hoTen: '',
    chucVu: '',
    donViCongTac: '',
    noiDungChinhKetQua: '',
    bangBieuSoLieu: '',
    tuDanhGiaXepLoai: '',
    mauVanBan: '',
    deCuongDanY: '',
    phongCachTrinhBay: '',
    doDaiVanBan: '',
    mucDoHoanChinh: '',
  });

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    setGeneratedContent(`${formData.tenTieuDe || 'BÁO CÁO THÀNH TÍCH'}

Họ và tên: ${formData.hoTen}
Chức vụ: ${formData.chucVu}
Đơn vị: ${formData.donViCongTac}

I. THÔNG TIN CHUNG
...

II. KẾT QUẢ THỰC HIỆN NHIỆM VỤ
${formData.noiDungChinhKetQua || '...'}

III. ĐÁNH GIÁ XẾP LOẠI
Tự đánh giá: ${formData.tuDanhGiaXepLoai || '...'}

IV. KẾT LUẬN
...`);
    setShowEditOptions(true);
    if (onGenerate) {
      onGenerate(formData);
    }
  };

  const goToMenu = (menu: MenuSection) => {
    setCurrentMenu(menu);
  };

  const menuItems: { id: MenuSection; label: string; number: number }[] = [
    { id: 'menu1', label: 'Thông tin Tiêu đề văn bản', number: 1 },
    { id: 'menu2', label: 'Kết quả, Thành tích đạt được', number: 2 },
    { id: 'menu3', label: 'Mẫu văn bản', number: 3 },
    { id: 'menu4', label: 'Tạo và xuất bản', number: 4 },
  ];

  const handleExampleClick = (value: string) => {
    if (!focusedField) return;

    const fieldMap: Record<string, keyof FormData> = {
      '87': 'loaiVanBan',
      '88': 'tenTieuDe',
      '89': 'vanBanCuaDoiTuong',
      '90': 'noiDungChinhKetQua',
      '91': 'tuDanhGiaXepLoai',
      '92': 'mauVanBan',
      '93': 'deCuongDanY',
      '94': 'phongCachTrinhBay',
      '95': 'doDaiVanBan',
      '96': 'mucDoHoanChinh',
    };

    const fieldName = fieldMap[focusedField];
    if (fieldName) {
      const multiSelectFields = ['noiDungChinhKetQua', 'phongCachTrinhBay'];

      if (multiSelectFields.includes(fieldName)) {
        const currentValue = formData[fieldName] as string;
        if (currentValue && !currentValue.includes(value)) {
          updateField(fieldName, currentValue ? currentValue + ', ' + value : value);
        } else if (!currentValue) {
          updateField(fieldName, value);
        }
      } else {
        updateField(fieldName, value);
      }
    }
  };

  return (
    <div className="flex h-full w-full bg-gray-50">
      {/* Left Preview Panel */}
      <div className="flex-[5.5] min-w-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Xem trước Báo cáo</h3>
          </div>
          <button className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
            Đóng
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <DocumentPreview formData={formData} generatedContent={generatedContent} />
        </div>
      </div>

      {/* Center Form Content */}
      <div className="flex-[2.5] min-w-0 flex flex-col overflow-hidden bg-white">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* Menu 1: Thông tin Tiêu đề văn bản */}
            {currentMenu === 'menu1' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 1 - Thông tin Tiêu đề văn bản</h2>
                  <p className="text-sm text-gray-500">Thông tin cơ bản về văn bản và người viết</p>
                </div>

                {/* Cửa sổ Workflow */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-amber-600" />
                    <span className="text-sm font-semibold text-amber-900">Cửa sổ Workflow</span>
                  </div>
                  <a
                    href={EXTERNAL_LINKS.WORKFLOWS.BAO_CAO_THANH_TICH}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-600 hover:underline break-all"
                  >
                    {EXTERNAL_LINKS.WORKFLOWS.BAO_CAO_THANH_TICH}
                  </a>
                </div>

                {/* Loại văn bản */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Loại văn bản [87] <span className="text-red-500">*</span>
                    <TooltipIcon text="Đánh giá công chức, viên chức; Đánh giá đảng viên; Báo cáo thành tích; Sáng kiến kinh nghiệm" />
                  </label>
                  <input
                    type="text"
                    value={formData.loaiVanBan}
                    onChange={e => updateField('loaiVanBan', e.target.value)}
                    onFocus={() => setFocusedField('87')}
                    placeholder="Ví dụ: Báo cáo thành tích..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Tên Tiêu đề Văn bản */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Tên Tiêu đề Văn bản [88] <span className="text-red-500">*</span>
                    <TooltipIcon text="Tiêu đề: Phiếu đánh giá, xếp loại chất lượng cán bộ; Phiếu đánh giá, xếp loại chất lượng công chức..." />
                  </label>
                  <input
                    type="text"
                    value={formData.tenTieuDe}
                    onChange={e => updateField('tenTieuDe', e.target.value)}
                    onFocus={() => setFocusedField('88')}
                    placeholder="Ví dụ: Phiếu đánh giá, xếp loại chất lượng cán bộ năm 2026"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Văn bản của Tập thể / Cá nhân */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Văn bản của Tập thể / Cá nhân [89]
                    <TooltipIcon text="Văn bản của: Tập thể / Cá nhân / Đảng viên / Cán bộ / Công chức / Viên chức" />
                  </label>
                  <input
                    type="text"
                    value={formData.vanBanCuaDoiTuong}
                    onChange={e => updateField('vanBanCuaDoiTuong', e.target.value)}
                    onFocus={() => setFocusedField('89')}
                    placeholder="Ví dụ: Tập thể, Cá nhân, Đảng viên..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Họ và tên */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Họ và tên
                    <TooltipIcon text="Nhập họ và tên đầy đủ" />
                  </label>
                  <input
                    type="text"
                    value={formData.hoTen}
                    onChange={e => updateField('hoTen', e.target.value)}
                    placeholder="Ví dụ: Nguyễn Hoàng Đại"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Chức vụ công tác */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Chức vụ công tác (Chính quyền, Đoàn thể)
                    <TooltipIcon text="Bí thư, Chủ tịch, Hiệu trưởng,... Xác định chức vụ quản lý hay không" />
                  </label>
                  <input
                    type="text"
                    value={formData.chucVu}
                    onChange={e => updateField('chucVu', e.target.value)}
                    placeholder="Ví dụ: Bí thư, Chủ tịch, Hiệu trưởng"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Đơn vị công tác */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Đơn vị công tác
                    <TooltipIcon text="UBND xã, Trường THCS,..." />
                  </label>
                  <input
                    type="text"
                    value={formData.donViCongTac}
                    onChange={e => updateField('donViCongTac', e.target.value)}
                    placeholder="Ví dụ: UBND xã, Trường THCS"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Menu 2: Kết quả, Thành tích đạt được */}
            {currentMenu === 'menu2' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 2 - Kết quả, Thành tích đạt được</h2>
                  <p className="text-sm text-gray-500">Nội dung và kết quả thực hiện nhiệm vụ</p>
                </div>

                {/* Nội dung chính, kết quả thực hiện */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Nội dung chính, kết quả thực hiện [90] <span className="text-red-500">*</span>
                    <TooltipIcon text="Trình bày: Kết quả thực hiện; Thành tích đạt được; Danh hiệu thi đua, hình thức khen thường đã nhận; hạn chế, khó khăn..." />
                  </label>
                  <FileUploadZone label="Kéo thả nhiều file vào đây" />
                  <textarea
                    value={formData.noiDungChinhKetQua}
                    onChange={e => updateField('noiDungChinhKetQua', e.target.value)}
                    onFocus={() => setFocusedField('90')}
                    placeholder="Hoặc nhập nội dung chính, kết quả thực hiện..."
                    rows={10}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {/* Bảng biểu, số liệu thực hiện kèm theo */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Bảng biểu, số liệu thực hiện kèm theo (File Word, Excel,...)
                    <TooltipIcon text="Nhập trực tiếp, tải file kết quả" />
                  </label>
                  <FileUploadZone label="Kéo thả nhiều file Word, Excel vào đây" />
                  <textarea
                    value={formData.bangBieuSoLieu}
                    onChange={e => updateField('bangBieuSoLieu', e.target.value)}
                    placeholder="Hoặc nhập bảng biểu, số liệu..."
                    rows={6}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {/* Tự đánh giá xếp loại */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Tự đánh giá xếp loại [91]
                    <TooltipIcon text="Tự nhận: Hoàn thành xuất sắc nhiệm vụ / Hoàn thành tốt nhiệm vụ / Hoàn thành nhiệm vụ / Không hoàn thành nhiệm vụ" />
                  </label>
                  <input
                    type="text"
                    value={formData.tuDanhGiaXepLoai}
                    onChange={e => updateField('tuDanhGiaXepLoai', e.target.value)}
                    onFocus={() => setFocusedField('91')}
                    placeholder="Ví dụ: Hoàn thành xuất sắc nhiệm vụ"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Menu 3: Mẫu văn bản */}
            {currentMenu === 'menu3' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 3 - Mẫu văn bản</h2>
                  <p className="text-sm text-gray-500">Chọn mẫu và đề cương văn bản</p>
                </div>

                {/* Chọn mẫu văn bản cần áp dụng */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Chọn mẫu văn bản cần áp dụng [92]
                    <TooltipIcon text="Tải văn bản thực tế chuẩn bạn đã dùng trước đó để sử dụng làm mẫu. Yêu cầu: Sử dụng mẫu đó làm chuẩn về bố cục, dàn ý..." />
                  </label>
                  <FileUploadZone label="Upload mẫu văn bản" />
                  <textarea
                    value={formData.mauVanBan}
                    onChange={e => updateField('mauVanBan', e.target.value)}
                    onFocus={() => setFocusedField('92')}
                    placeholder="Hoặc nhập link mẫu văn bản..."
                    rows={4}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {/* Chọn Đề cương; Dàn ý văn bản */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Chọn Đề cương; Dàn ý văn bản [93]
                    <TooltipIcon text="Sử dụng đề cương đó làm khung nội dung chính." />
                  </label>
                  <FileUploadZone label="Upload đề cương, dàn ý" />
                  <textarea
                    value={formData.deCuongDanY}
                    onChange={e => updateField('deCuongDanY', e.target.value)}
                    onFocus={() => setFocusedField('93')}
                    placeholder="Hoặc nhập link mẫu văn bản..."
                    rows={4}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* Menu 4: Tạo và xuất bản */}
            {currentMenu === 'menu4' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 4 - Tạo và xuất bản</h2>
                  <p className="text-sm text-gray-500">Thiết lập phong cách và độ dài văn bản</p>
                </div>

                {/* Chọn phong cách trình bày */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Chọn phong cách trình bày [94]
                    <TooltipIcon text="Văn phong phải chuẩn hành chính, trang trọng, chính xác, mạch lạc, phù hợp với ngành giáo dục và nhà trường." />
                  </label>
                  <input
                    type="text"
                    value={formData.phongCachTrinhBay}
                    onChange={e => updateField('phongCachTrinhBay', e.target.value)}
                    onFocus={() => setFocusedField('94')}
                    placeholder="Ví dụ: Trang trọng, chuyên nghiệp, hành chính"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Độ dài văn bản */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Độ dài văn bản [95]
                    <TooltipIcon text="Trình bày: Ngắn gọn, trung bình, đầy đủ, chi tiết; khoảng ....... từ (560 từ - 580 từ = 1 trang A4)" />
                  </label>
                  <input
                    type="text"
                    value={formData.doDaiVanBan}
                    onChange={e => updateField('doDaiVanBan', e.target.value)}
                    onFocus={() => setFocusedField('95')}
                    placeholder="Ví dụ: Ngắn gọn, khoảng 560 từ..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Yêu cầu Mức độ hoàn chỉnh của văn bản */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Yêu cầu Mức độ hoàn chỉnh của văn bản [96]
                    <TooltipIcon text="Tạo Bản nháp, bản rút gọn, bản hoàn chỉnh, bản trình ký" />
                  </label>
                  <input
                    type="text"
                    value={formData.mucDoHoanChinh}
                    onChange={e => updateField('mucDoHoanChinh', e.target.value)}
                    onFocus={() => setFocusedField('96')}
                    placeholder="Ví dụ: Bản nháp, bản hoàn chỉnh..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Edit Options after generation */}
                {showEditOptions && (
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-5">
                    <h3 className="font-semibold text-amber-900 text-sm mb-4 flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Hoàn tất - Chỉnh sửa & Xuất bản
                    </h3>

                    <div className="grid grid-cols-3 gap-3">
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors text-sm font-medium justify-center">
                        <MessageSquare size={14} />
                        Tuỳ chỉnh với AI
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium justify-center">
                        <FileDown size={14} />
                        Xuất Word
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors text-sm font-medium justify-center">
                        <Save size={14} />
                        Lưu văn bản
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-amber-600 space-y-1">
                      <div>• <strong>Tuỳ chỉnh với AI:</strong> Chat chỉnh sửa văn bản, có gắn File</div>
                      <div>• <strong>Xuất Word:</strong> Tải .docx</div>
                      <div>• <strong>Lưu văn bản:</strong> Lưu bản nháp</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 bg-white px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              const idx = menuItems.findIndex(m => m.id === currentMenu);
              if (idx > 0) goToMenu(menuItems[idx - 1].id);
            }}
            disabled={currentMenu === 'menu1'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentMenu === 'menu1'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ChevronLeft size={16} />
            Quay lại
          </button>

          <div className="text-xs text-gray-500">
            Menu {menuItems.find(m => m.id === currentMenu)?.number} / 4
          </div>

          {currentMenu !== 'menu4' ? (
            <button
              onClick={() => {
                const idx = menuItems.findIndex(m => m.id === currentMenu);
                if (idx < menuItems.length - 1) goToMenu(menuItems[idx + 1].id);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-lg hover:from-amber-700 hover:to-yellow-700 transition-colors text-sm font-medium shadow-md"
            >
              Tiếp tục
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={!formData.loaiVanBan || !formData.tenTieuDe}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                !formData.loaiVanBan || !formData.tenTieuDe
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white hover:from-amber-700 hover:to-yellow-700 shadow-md'
              }`}
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

function DocumentPreview({ formData, generatedContent }: { formData: FormData; generatedContent: string }) {
  return (
    <div className="p-8 bg-white min-h-full">
      <div className="max-w-2xl mx-auto">
        {generatedContent ? (
          <div>
            <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase">{formData.tenTieuDe || 'BÁO CÁO THÀNH TÍCH'}</h1>
              <div className="text-sm text-gray-600 mt-3">
                Loại: {formData.loaiVanBan}
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {generatedContent}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Chưa có nội dung</h3>
            <p className="text-sm text-gray-500">
              Điền thông tin và nhấn "Tạo nội dung" để xem báo cáo
            </p>
          </div>
        )}
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

function FileUploadZone({ label }: { label?: string }) {
  const [files, setFiles] = useState<string[]>([]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setFiles(prev => [...prev, 'document.pdf']);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer"
      >
        <Upload size={32} className="mx-auto text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-700 mb-1">
          {label || 'Kéo thả file vào đây hoặc click để chọn'}
        </p>
        <p className="text-xs text-gray-500">
          .doc, .docx, .pdf, .xlsx
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
              <File size={16} className="text-amber-600 flex-shrink-0" />
              <span className="text-sm text-gray-700 flex-1">{file}</span>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
