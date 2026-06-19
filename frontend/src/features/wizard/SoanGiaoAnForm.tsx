import { useState } from 'react';
import {
  Upload, Info, CheckCircle2, Sparkles, X, File, Eye, ChevronLeft, ChevronRight, FileDown, MessageSquare, Save
} from 'lucide-react';
import { EXTERNAL_LINKS } from '../../api/urls';
import { ContextualHelpPanel } from '../../components/ContextualHelpPanel';

interface SoanGiaoAnFormProps {
  onGenerate?: (data: any) => void;
}

type MenuSection = 'menu1' | 'menu2' | 'menu4';

interface FormData {
  // Menu 1
  capHoc: string;
  monHoc: string;
  lop: string;
  tenBaiHoc: string;
  soTiet: string;
  thoiGianDay: string;

  // Menu 2
  yeuCauCanDat: string;
  doiTuongHocSinh: string;
  taiLieuKemTheo: string;
  phongCachDayHoc: string;
  boSachHoc: string;
  noiDungTichHop: string;

  // Menu 4
  noiDungBaiHoc: string;
  mauGiaoAn: string;
  phongCachTrinhBay: string;
  doDaiGiaoAn: string;
}

export function SoanGiaoAnForm({ onGenerate }: SoanGiaoAnFormProps) {
  const [currentMenu, setCurrentMenu] = useState<MenuSection>('menu1');
  const [generatedContent, setGeneratedContent] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    capHoc: '',
    monHoc: '',
    lop: '',
    tenBaiHoc: '',
    soTiet: '',
    thoiGianDay: '45',
    yeuCauCanDat: '',
    doiTuongHocSinh: '',
    taiLieuKemTheo: '',
    phongCachDayHoc: '',
    boSachHoc: '',
    noiDungTichHop: '',
    noiDungBaiHoc: '',
    mauGiaoAn: '',
    phongCachTrinhBay: '',
    doDaiGiaoAn: '',
  });

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    setGeneratedContent(`GIÁO ÁN

Môn học: ${formData.monHoc}
Lớp: ${formData.lop}
Bài: ${formData.tenBaiHoc}
Thời gian: ${formData.soTiet} tiết (${formData.thoiGianDay} phút/tiết)

I. MỤC TIÊU
1. Kiến thức:
   - ...
2. Năng lực:
   - ...
3. Phẩm chất:
   - ...

II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
- ...

III. TIẾN TRÌNH DẠY HỌC
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
    { id: 'menu1', label: 'Thông tin môn và lớp học', number: 1 },
    { id: 'menu2', label: 'Yêu cầu Giáo án', number: 2 },
    { id: 'menu4', label: 'Tài liệu - Mẫu Giáo án', number: 4 },
  ];

  const handleExampleClick = (value: string) => {
    if (!focusedField) return;

    const fieldMap: Record<string, keyof FormData> = {
      '60': 'capHoc',
      '61': 'monHoc',
      '62': 'tenBaiHoc',
      '63': 'yeuCauCanDat',
      '64': 'doiTuongHocSinh',
      '65': 'taiLieuKemTheo',
      '66': 'phongCachDayHoc',
      '67': 'boSachHoc',
      '68': 'noiDungTichHop',
      '69': 'noiDungBaiHoc',
      '70': 'mauGiaoAn',
      '71': 'phongCachTrinhBay',
      '72': 'doDaiGiaoAn',
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
            <h3 className="font-semibold text-gray-900 text-sm">Xem trước Giáo án</h3>
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
            {/* Menu 1: Thông tin môn và lớp học */}
            {currentMenu === 'menu1' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 1 - Thông tin môn và lớp học</h2>
                  <p className="text-sm text-gray-500">Nhập thông tin cơ bản về môn học và lớp</p>
                </div>

                {/* Cửa sổ Workflow */}
                <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-sky-600" />
                    <span className="text-sm font-semibold text-sky-900">Cửa sổ Workflow</span>
                  </div>
                  <a
                    href={EXTERNAL_LINKS.WORKFLOWS.SOAN_GIAO_AN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sky-600 hover:underline break-all"
                  >
                    {EXTERNAL_LINKS.WORKFLOWS.SOAN_GIAO_AN}
                  </a>
                </div>

                {/* Cấp học */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Cấp học [60] <span className="text-red-500">*</span>
                    <TooltipIcon text="Cấp học: Mầm non; Tiểu học; THCS; THPT; GDTX" />
                  </label>
                  <input
                    type="text"
                    value={formData.capHoc}
                    onChange={e => updateField('capHoc', e.target.value)}
                    onFocus={() => setFocusedField('60')}
                    placeholder="Ví dụ: Tiểu học, THPT..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Môn học */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Môn học [61] <span className="text-red-500">*</span>
                    <TooltipIcon text="Môn: Toán; Ngữ văn; Tiếng Anh; KHTN (vật lý, hoá học, sinh học); Lịch sử & Địa lí; Tin học; Công nghệ; GDCD; Âm nhạc; Mỹ thuật; GDTC" />
                  </label>
                  <input
                    type="text"
                    value={formData.monHoc}
                    onChange={e => updateField('monHoc', e.target.value)}
                    onFocus={() => setFocusedField('61')}
                    placeholder="Ví dụ: Toán, Ngữ văn..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Lớp */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Lớp <span className="text-red-500">*</span>
                    <TooltipIcon text="Nhập lớp: 3, 8, 11,..." />
                  </label>
                  <input
                    type="text"
                    value={formData.lop}
                    onChange={e => updateField('lop', e.target.value)}
                    placeholder="Ví dụ: 3, 8, 11"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Tên bài học/Chủ đề */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Tên bài học / Chủ đề [62] <span className="text-red-500">*</span>
                    <TooltipIcon text="Bài 7 - Sự tuần hoàn của nước ..." />
                  </label>
                  <input
                    type="text"
                    value={formData.tenBaiHoc}
                    onChange={e => updateField('tenBaiHoc', e.target.value)}
                    onFocus={() => setFocusedField('62')}
                    placeholder="Ví dụ: Bài 7 - Sự tuần hoàn của nước"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Số tiết */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Số tiết <span className="text-red-500">*</span>
                    <TooltipIcon text="Số tiết học: 1, 2,..." />
                  </label>
                  <input
                    type="text"
                    value={formData.soTiet}
                    onChange={e => updateField('soTiet', e.target.value)}
                    placeholder="Ví dụ: 1, 2, 3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Thời gian dạy */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Thời gian dạy
                    <TooltipIcon text="Thời gian mỗi tiết (phút)" />
                  </label>
                  <input
                    type="text"
                    value={formData.thoiGianDay}
                    onChange={e => updateField('thoiGianDay', e.target.value)}
                    placeholder="45 phút"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Menu 2: Yêu cầu Giáo án */}
            {currentMenu === 'menu2' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 2 - Yêu cầu Giáo án</h2>
                  <p className="text-sm text-gray-500">Mục tiêu và yêu cầu đạt được của giáo án</p>
                </div>

                {/* Yêu cầu cần đạt */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Yêu cầu cần đạt [63] <span className="text-red-500">*</span>
                    <TooltipIcon text="Yêu cầu: Kiến thức, năng lực, phẩm chất" />
                  </label>
                  <FileUploadZone />
                  <textarea
                    value={formData.yeuCauCanDat}
                    onChange={e => updateField('yeuCauCanDat', e.target.value)}
                    onFocus={() => setFocusedField('63')}
                    placeholder="Hoặc nhập yêu cầu cần đạt: Kiến thức, năng lực, phẩm chất..."
                    rows={8}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {/* Đối tượng học sinh áp dụng */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Đối tượng học sinh áp dụng [64]
                    <TooltipIcon text="Áp dụng đối với: Đối tượng học sinh: Trung bình; khá; giỏi" />
                  </label>
                  <input
                    type="text"
                    value={formData.doiTuongHocSinh}
                    onChange={e => updateField('doiTuongHocSinh', e.target.value)}
                    onFocus={() => setFocusedField('64')}
                    placeholder="Ví dụ: Trung bình, khá, giỏi..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Tài liệu tạo ra kèm theo giáo án */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Tài liệu tạo ra kèm theo giáo án [65]
                    <TooltipIcon text="Tạo ra kèm giáo án: Phiếu học tập, bài tập, câu hỏi, rubric, trò chơi, slide,..." />
                  </label>
                  <input
                    type="text"
                    value={formData.taiLieuKemTheo}
                    onChange={e => updateField('taiLieuKemTheo', e.target.value)}
                    onFocus={() => setFocusedField('65')}
                    placeholder="Ví dụ: Phiếu học tập, trò chơi, bài tập thực hành..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Phong cách dạy học */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Phong cách dạy học [66]
                    <TooltipIcon text="Phong cách dạy hoc: Phát triển năng lực, lấy học sinh làm trung tâm, hoạt động nhóm, STEM" />
                  </label>
                  <input
                    type="text"
                    value={formData.phongCachDayHoc}
                    onChange={e => updateField('phongCachDayHoc', e.target.value)}
                    onFocus={() => setFocusedField('66')}
                    placeholder="Ví dụ: Phát triển năng lực, lấy học sinh làm trung tâm..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Bộ sách học */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Bộ sách học [67]
                    <TooltipIcon text="Bộ sách học: Sách kết nối tri thức với cuộc sống" />
                  </label>
                  <input
                    type="text"
                    value={formData.boSachHoc}
                    onChange={e => updateField('boSachHoc', e.target.value)}
                    onFocus={() => setFocusedField('67')}
                    placeholder="Ví dụ: Sách kết nối tri thức với cuộc sống"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Nội dung tích hợp trong giáo án */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Nội dung tích hợp trong giáo án [68]
                    <TooltipIcon text="Tích hợp: giáo dục kỹ năng sống, lịch sử địa phương, ứng dụng AI,..." />
                  </label>
                  <FileUploadZone />
                  <textarea
                    value={formData.noiDungTichHop}
                    onChange={e => updateField('noiDungTichHop', e.target.value)}
                    onFocus={() => setFocusedField('68')}
                    placeholder="Hoặc nhập nội dung tích hợp: Giáo dục kỹ năng sống, lịch sử địa phương, ứng dụng AI,..."
                    rows={5}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* Menu 4: Tài liệu - Mẫu Giáo án */}
            {currentMenu === 'menu4' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 4 - Tài liệu - Mẫu Giáo án</h2>
                  <p className="text-sm text-gray-500">Tải tài liệu và chọn mẫu giáo án</p>
                </div>

                {/* Nội dung bài học */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Nội dung bài học (SGK, Bài học,...) [69]
                    <TooltipIcon text="Nhập nội dung hoặc tải file bài học" />
                  </label>
                  <FileUploadZone />
                  <textarea
                    value={formData.noiDungBaiHoc}
                    onChange={e => updateField('noiDungBaiHoc', e.target.value)}
                    onFocus={() => setFocusedField('69')}
                    placeholder="Hoặc nhập nội dung bài học từ SGK..."
                    rows={8}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {/* Mẫu giáo án đang thực hiện */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Mẫu giáo án đang thực hiện [70]
                    <TooltipIcon text="Mẫu của Bộ, Sở, nhà trường hoặc mẫu cá nhân đang thực hiện (nếu có)" />
                  </label>
                  <div className="mb-3">
                    <button className="px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors text-sm font-medium border border-sky-200">
                      Gắn mẫu Giáo án của Trợ lý AI đề xuất
                    </button>
                  </div>
                  <FileUploadZone />
                  <textarea
                    value={formData.mauGiaoAn}
                    onChange={e => updateField('mauGiaoAn', e.target.value)}
                    onFocus={() => setFocusedField('70')}
                    placeholder="Hoặc nhập mẫu giáo án của đơn vị..."
                    rows={8}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                {/* Chọn phong cách trình bày giáo án */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Chọn phong cách trình bày giáo án [71]
                    <TooltipIcon text="Phong cách trình bày: Hành chính – sư phạm, Trung tính. Mô tả hoạt động, không biểu cảm, Không dùng “tôi / chúng ta”, Không dùng cảm thán" />
                  </label>
                  <input
                    type="text"
                    value={formData.phongCachTrinhBay}
                    onChange={e => updateField('phongCachTrinhBay', e.target.value)}
                    onFocus={() => setFocusedField('71')}
                    placeholder="Ví dụ: Hành chính - sư phạm..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Độ dài giáo án */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Độ dài giáo án [72]
                    <TooltipIcon text="Trình bày giáo án: Ngắn gọn, trung bình, đầy đủ, chi tiết; đầy đủ, hoàn chỉnh" />
                  </label>
                  <input
                    type="text"
                    value={formData.doDaiGiaoAn}
                    onChange={e => updateField('doDaiGiaoAn', e.target.value)}
                    onFocus={() => setFocusedField('72')}
                    placeholder="Ví dụ: Ngắn gọn, trung bình..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Edit Options after generation */}
                {showEditOptions && (
                  <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-lg p-5">
                    <h3 className="font-semibold text-sky-900 text-sm mb-4 flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Hoàn tất - Chỉnh sửa & Xuất bản
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-sky-300 text-sky-700 rounded-lg hover:bg-sky-50 transition-colors text-sm font-medium justify-center">
                        <MessageSquare size={14} />
                        Tuỳ chỉnh với AI
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-sky-300 text-sky-700 rounded-lg hover:bg-sky-50 transition-colors text-sm font-medium justify-center">
                        <Save size={14} />
                        Lưu văn bản
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium justify-center">
                        <FileDown size={14} />
                        Xuất Word
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-sm font-medium justify-center">
                        <FileDown size={14} />
                        Tạo phiếu học tập
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-sky-600 space-y-1">
                      <div>• <strong>Tuỳ chỉnh với AI:</strong> Chat chỉnh sửa văn bản, có gắn File</div>
                      <div>• <strong>Lưu văn bản:</strong> Lưu bản nháp</div>
                      <div>• <strong>Xuất Word:</strong> Tải .docx</div>
                      <div>• <strong>Tạo phiếu học tập:</strong> Tải .docx</div>
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
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg hover:from-sky-700 hover:to-blue-700 transition-colors text-sm font-medium shadow-md"
            >
              Tiếp tục
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={!formData.capHoc || !formData.monHoc || !formData.tenBaiHoc}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                !formData.capHoc || !formData.monHoc || !formData.tenBaiHoc
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700 shadow-md'
              }`}
            >
              <Sparkles size={16} />
              Hoàn tất / Tạo nội dung
            </button>
          )}
        </div>
      </div>

      {/* Right Navigation Panel */}
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">GIÁO ÁN</h1>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Môn học:</strong> {formData.monHoc}</div>
                <div><strong>Lớp:</strong> {formData.lop}</div>
                <div><strong>Bài:</strong> {formData.tenBaiHoc}</div>
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
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-sky-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Chưa có nội dung</h3>
            <p className="text-sm text-gray-500">
              Điền thông tin và nhấn "Tạo nội dung" để xem giáo án
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
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-sky-400 hover:bg-sky-50/30 transition-all cursor-pointer"
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
              <File size={16} className="text-sky-600 flex-shrink-0" />
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
