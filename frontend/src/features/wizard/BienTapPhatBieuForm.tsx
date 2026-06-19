import { useState } from 'react';
import {
  Upload, Calendar, Info, CheckCircle2, ArrowRight, ArrowLeft,
  Sparkles, X, File, Eye, MessageSquare, Save, FileDown, Zap
} from 'lucide-react';
import { EXTERNAL_LINKS } from '../../api/urls';
import { ContextualHelpPanel } from '../../components/ContextualHelpPanel';

interface BienTapPhatBieuFormProps {
  onGenerate?: (data: any) => void;
}

type MenuSection = 1 | 2 | 3;

interface FormData {
  // Menu 1
  linhVucPhatBieu: string;
  kieuPhatBieu: string;
  thoiLuong: string;
  phongCachTrinhBay: string;

  // Menu 2
  nguoiPhatBieu: string;
  chucVu: string;
  coQuanDonVi: string;
  tenSuKien: string;
  thoiGianDiaDiem: string;
  doiTuongNghe: string;

  // Menu 3
  noiDungPhatBieu: string;
  vanBanChiDao: string;
  baoCaoKetQua: string;
  chuongTrinhSuKien: string;
  baiPhatBieuMau: string;
}

export function BienTapPhatBieuForm({ onGenerate }: BienTapPhatBieuFormProps) {
  const [currentMenu, setCurrentMenu] = useState<MenuSection>(1);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState('');
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    linhVucPhatBieu: '',
    kieuPhatBieu: '',
    thoiLuong: '',
    phongCachTrinhBay: '',
    nguoiPhatBieu: '',
    chucVu: '',
    coQuanDonVi: '',
    tenSuKien: '',
    thoiGianDiaDiem: '',
    doiTuongNghe: '',
    noiDungPhatBieu: '',
    vanBanChiDao: '',
    baoCaoKetQua: '',
    chuongTrinhSuKien: '',
    baiPhatBieuMau: '',
  });

  const menus = [
    { id: 1 as MenuSection, title: 'Chọn loại phát biểu', completed: false },
    { id: 2 as MenuSection, title: 'Thông tin người phát biểu', completed: false },
    { id: 3 as MenuSection, title: 'Nội dung bài phát biểu', completed: false },
  ];

  const linhVucOptions = ['Đảng', 'Nhà nước', 'Giáo dục', 'Nhà trường'];
  const kieuPhatBieuOptions = ['Khai mạc', 'Chỉ đạo', 'Kết luận', 'Bế mạc', 'Chào mừng', 'Tổng kết'];
  const thoiLuongOptions = ['3 phút', '5 phút', '10 phút', '15 phút'];
  const phongCachOptions = ['Trang trọng', 'Chính luận', 'Hành chính', 'Sư phạm', 'Truyền cảm hứng'];

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentMenu < 3) {
      setCurrentMenu((currentMenu + 1) as MenuSection);
    }
  };

  const handleBack = () => {
    if (currentMenu > 1) {
      setCurrentMenu((currentMenu - 1) as MenuSection);
    }
  };

  const handleComplete = () => {
    setGeneratedContent('Bài phát biểu đang được AI tạo...\n\nKính thưa quý vị đại biểu...');
    setShowEditOptions(true);
    if (onGenerate) {
      onGenerate(formData);
    }
  };

  const handleExampleClick = (value: string) => {
    if (!focusedField) return;

    const fieldMap: Record<string, keyof FormData> = {
      '53': 'linhVucPhatBieu',
      '54': 'kieuPhatBieu',
      '55': 'phongCachTrinhBay',
      '56': 'doiTuongNghe',
      '57': 'noiDungPhatBieu',
      '59': 'thoiLuong',
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
            <h3 className="font-semibold text-gray-900 text-sm">Xem trước bài phát biểu</h3>
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
            {/* Menu 1: Chọn loại phát biểu */}
            {currentMenu === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 1 - Chọn loại phát biểu</h2>
                  <p className="text-sm text-gray-500">Xác định thông tin cơ bản về bài phát biểu</p>
                </div>

                {/* Cửa sổ Workflow */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">Cửa sổ Workflow</span>
                  </div>
                  <a
                    href={EXTERNAL_LINKS.WORKFLOWS.BIEN_TAP_PHAT_BIEU}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline break-all"
                  >
                    {EXTERNAL_LINKS.WORKFLOWS.BIEN_TAP_PHAT_BIEU}
                  </a>
                </div>

                {/* Lĩnh vực phát biểu */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Lĩnh vực phát biểu [53] <span className="text-red-500">*</span>
                    <TooltipIcon text="Đảng / Nhà nước / Giáo dục / Nhà trường" />
                  </label>
                  <input
                    type="text"
                    value={formData.linhVucPhatBieu}
                    onChange={e => updateField('linhVucPhatBieu', e.target.value)}
                    onFocus={() => setFocusedField('53')}
                    placeholder="Ví dụ: Đảng, Nhà nước, Giáo dục..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Kiểu phát biểu */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Kiểu phát biểu [54] <span className="text-red-500">*</span>
                    <TooltipIcon text="Khai mạc / Chỉ đạo / Kết luận / Bế mạc / Chào mừng / Tổng kết" />
                  </label>
                  <input
                    type="text"
                    value={formData.kieuPhatBieu}
                    onChange={e => updateField('kieuPhatBieu', e.target.value)}
                    onFocus={() => setFocusedField('54')}
                    placeholder="Ví dụ: Khai mạc, Chỉ đạo..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Thời lượng */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Thời lượng 
                    <TooltipIcon text="3 phút / 5 phút / 10 phút / 15 phút" />
                  </label>
                  <input
                    type="text"
                    value={formData.thoiLuong}
                    onChange={e => updateField('thoiLuong', e.target.value)}
                    onFocus={() => setFocusedField('')}
                    placeholder="Ví dụ: Ngắn gọn, 5 phút..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Phong cách trình bày */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Phong cách trình bày [55]
                    <TooltipIcon text="Trang trọng / Chính luận / Hành chính / Sư phạm / Truyền cảm hứng" />
                  </label>
                  <input
                    type="text"
                    value={formData.phongCachTrinhBay}
                    onChange={e => updateField('phongCachTrinhBay', e.target.value)}
                    onFocus={() => setFocusedField('55')}
                    placeholder="Ví dụ: Trang trọng, Truyền cảm hứng..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Menu 2: Thông tin người phát biểu */}
            {currentMenu === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 2 - Thông tin người phát biểu</h2>
                  <p className="text-sm text-gray-500">Nhập thông tin về người phát biểu và sự kiện</p>
                </div>

                {/* Người phát biểu */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Người phát biểu
                    <TooltipIcon text="Họ và tên" />
                  </label>
                  <input
                    type="text"
                    value={formData.nguoiPhatBieu}
                    onChange={e => updateField('nguoiPhatBieu', e.target.value)}
                    placeholder="Ví dụ: Nguyễn Văn A"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Chức vụ người phát biểu */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Chức vụ người phát biểu
                    <TooltipIcon text="Bí thư, Chủ tịch, Giám đốc, Hiệu trưởng..." />
                  </label>
                  <input
                    type="text"
                    value={formData.chucVu}
                    onChange={e => updateField('chucVu', e.target.value)}
                    placeholder="Ví dụ: Hiệu trưởng, Chủ tịch UBND..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Cơ quan/đơn vị */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Cơ quan/đơn vị
                    <TooltipIcon text="Tên cơ quan, đơn vị, nhà trường" />
                  </label>
                  <input
                    type="text"
                    value={formData.coQuanDonVi}
                    onChange={e => updateField('coQuanDonVi', e.target.value)}
                    placeholder="Ví dụ: Trường THPT ABC, Sở GD&ĐT..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Tên Sự kiện/hội nghị */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Tên Sự kiện/hội nghị
                    <TooltipIcon text="Tên hội nghị, lễ, cuộc họp" />
                  </label>
                  <input
                    type="text"
                    value={formData.tenSuKien}
                    onChange={e => updateField('tenSuKien', e.target.value)}
                    placeholder="Ví dụ: Hội nghị tổng kết năm học 2025-2026"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Thời gian, địa điểm */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Thời gian, địa điểm
                    <TooltipIcon text="Ngày, địa điểm tổ chức" />
                  </label>
                  <input
                    type="text"
                    value={formData.thoiGianDiaDiem}
                    onChange={e => updateField('thoiGianDiaDiem', e.target.value)}
                    placeholder="Ví dụ: 08/06/2026, tại Hội trường trường THPT ABC"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Đối tượng nghe */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Đối tượng nghe [56]
                    <TooltipIcon text="Đại biểu, cán bộ, giáo viên, học sinh, phụ huynh..." />
                  </label>
                  <textarea
                    value={formData.doiTuongNghe}
                    onChange={e => updateField('doiTuongNghe', e.target.value)}
                    onFocus={() => setFocusedField('56')}
                    placeholder="Ví dụ: Quý vị đại biểu, thầy cô giáo, các em học sinh..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* Menu 3: Nội dung bài phát biểu */}
            {currentMenu === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 3 - Nội dung cần đưa vào bài phát biểu</h2>
                  <p className="text-sm text-gray-500">Cung cấp nội dung và tài liệu tham khảo</p>
                </div>

                {/* Nội dung bài phát biểu */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Nội dung bài phát biểu [57] <span className="text-red-500">*</span>
                    <TooltipIcon text="Nội dung chính phát biểu" />
                  </label>
                  <textarea
                    value={formData.noiDungPhatBieu}
                    onChange={e => updateField('noiDungPhatBieu', e.target.value)}
                    onFocus={() => setFocusedField('57')}
                    placeholder="Nhập nội dung chính cần đưa vào bài phát biểu..."
                    rows={8}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {/* Văn bản chỉ đạo trực tiếp */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Văn bản chỉ đạo trực tiếp
                    <TooltipIcon text="Văn bản chỉ đạo thực hiện" />
                  </label>
                  <FileUploadZone />
                  <textarea
                    value={formData.vanBanChiDao}
                    onChange={e => updateField('vanBanChiDao', e.target.value)}
                    placeholder="Hoặc nhập nội dung văn bản chỉ đạo..."
                    rows={4}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {/* Báo cáo/kết quả của sự kiện */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Báo cáo/kết quả của sự kiện
                    <TooltipIcon text="Báo cáo, kết quả thực hiện" />
                  </label>
                  <FileUploadZone />
                  <textarea
                    value={formData.baoCaoKetQua}
                    onChange={e => updateField('baoCaoKetQua', e.target.value)}
                    placeholder="Hoặc nhập nội dung báo cáo, kết quả..."
                    rows={4}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {/* Chương trình hội nghị/sự kiện */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Chương trình hội nghị/sự kiện
                    <TooltipIcon text="Bảng Chương trình hội nghị/sự kiện" />
                  </label>
                  <FileUploadZone />
                  <textarea
                    value={formData.chuongTrinhSuKien}
                    onChange={e => updateField('chuongTrinhSuKien', e.target.value)}
                    placeholder="Hoặc nhập chương trình sự kiện..."
                    rows={4}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {/* Bài phát biểu mẫu */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Bài phát biểu mẫu
                    <TooltipIcon text="Cung cấp Bài phát biểu mẫu - Mẫu chuẩn theo từng loại bài phát biểu" />
                  </label>
                  <FileUploadZone />
                  <textarea
                    value={formData.baiPhatBieuMau}
                    onChange={e => updateField('baiPhatBieuMau', e.target.value)}
                    placeholder="Hoặc nhập nội dung bài phát biểu mẫu..."
                    rows={4}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {showEditOptions && (
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-lg p-5">
                    <h3 className="font-semibold text-violet-900 text-sm mb-4 flex items-center gap-2">
                      <Zap size={16} />
                      Tùy chỉnh với AI
                    </h3>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors text-sm font-medium text-violet-700">
                        <MessageSquare size={14} />
                        Chat chỉnh sửa văn bản
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors text-sm font-medium text-violet-700">
                        <Sparkles size={14} />
                        Bổ sung phần chỉ đạo
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors text-sm font-medium text-violet-700">
                        <ArrowRight size={14} />
                        Viết trang trọng hơn
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-violet-200 rounded-lg hover:bg-violet-50 transition-colors text-sm font-medium text-violet-700">
                        <ArrowLeft size={14} />
                        Viết gần gũi hơn
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium justify-center">
                        <Save size={14} />
                        Lưu văn bản
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium justify-center">
                        <FileDown size={14} />
                        Xuất Word
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-violet-600 space-y-1">
                      <div>• <strong>Chat chỉnh sửa:</strong> Chỉnh sửa văn bản, có gắn File</div>
                      <div>• <strong>Bổ sung chỉ đạo:</strong> Thêm nhiệm vụ, yêu cầu</div>
                      <div>• <strong>Trang trọng:</strong> Tăng tính chính luận, chuẩn mực</div>
                      <div>• <strong>Gần gũi:</strong> Phù hợp nhà trường, phụ huynh, học sinh</div>
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
            Bước {currentMenu} / 3
          </div>

          {currentMenu < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors"
            >
              Tiếp tục
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-violet-700 hover:to-purple-700 transition-colors shadow-md"
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
    <div className="max-w-2xl mx-auto py-12 px-12 bg-white min-h-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-sm font-bold mb-2">{formData.kieuPhatBieu || 'BÀI PHÁT BIỂU'}</div>
        {formData.tenSuKien && (
          <div className="text-sm mb-1">Tại: {formData.tenSuKien}</div>
        )}
        {formData.thoiGianDiaDiem && (
          <div className="text-xs text-gray-500 italic mb-4">{formData.thoiGianDiaDiem}</div>
        )}
        <div className="w-20 h-px bg-gray-400 mx-auto" />
      </div>

      {/* Speaker Info */}
      {(formData.nguoiPhatBieu || formData.chucVu) && (
        <div className="mb-6 text-sm">
          <div className="font-semibold">{formData.nguoiPhatBieu || '[Người phát biểu]'}</div>
          {formData.chucVu && <div className="text-gray-600">{formData.chucVu}</div>}
          {formData.coQuanDonVi && <div className="text-gray-600">{formData.coQuanDonVi}</div>}
        </div>
      )}

      {/* Content */}
      <div className="space-y-4 text-sm leading-relaxed">
        {formData.doiTuongNghe && (
          <div className="font-semibold">
            {formData.doiTuongNghe},
          </div>
        )}

        {generatedContent ? (
          <div className="whitespace-pre-wrap text-gray-700">
            {generatedContent}
          </div>
        ) : formData.noiDungPhatBieu ? (
          <div className="whitespace-pre-wrap text-gray-700">
            {formData.noiDungPhatBieu}
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8 italic text-xs">
            Nhập nội dung để xem trước bài phát biểu
          </div>
        )}
      </div>

      {/* Closing */}
      {generatedContent && (
        <div className="mt-8 text-sm text-right">
          <div className="mb-8">Xin trân trọng cảm ơn!</div>
          <div className="font-semibold">{formData.nguoiPhatBieu || '[Người phát biểu]'}</div>
        </div>
      )}
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

function FileUploadZone() {
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
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-violet-400 hover:bg-violet-50/30 transition-all cursor-pointer"
      >
        <Upload size={32} className="mx-auto text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-700 mb-1">
          Kéo thả file vào đây hoặc click để chọn
        </p>
        <p className="text-xs text-gray-500">
          .doc, .docx, .pdf
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
              <File size={16} className="text-violet-600 flex-shrink-0" />
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
