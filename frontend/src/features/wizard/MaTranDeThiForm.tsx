import { useState } from 'react';
import {
  Upload, Info, CheckCircle2, Sparkles, X, File, Eye, ChevronLeft, ChevronRight, FileDown, MessageSquare, Save
} from 'lucide-react';
import { EXTERNAL_LINKS } from '../../api/urls';
import { ContextualHelpPanel } from '../../components/ContextualHelpPanel';

interface MaTranDeThiFormProps {
  onGenerate?: (data: any) => void;
}

type MenuSection = 'menu1' | 'menu2' | 'menu3';

interface FormData {
  // Menu 1
  monHoc: string;
  lop: string;
  thoiGianKiemTra: string;
  hinhThucKiemTra: string;
  mucTieuKiemTra: string;

  // Menu 2
  phamViKienThuc: string;
  danhSachChuDe: string;
  taiLieuMau: string;

  // Menu 3
  trinhDoHocSinh: string;
  tyLeTracNghiem: string;
  tyLeTuLuan: string;
  thangDiem: string;
  tyLeNhanBiet: string;
  tyLeThongHieu: string;
  tyLeVanDung: string;
  tyLeVanDungCao: string;
}

export function MaTranDeThiForm({ onGenerate }: MaTranDeThiFormProps) {
  const [currentMenu, setCurrentMenu] = useState<MenuSection>('menu1');
  const [generatedContent, setGeneratedContent] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    monHoc: '',
    lop: '',
    thoiGianKiemTra: '45',
    hinhThucKiemTra: '',
    mucTieuKiemTra: '',
    phamViKienThuc: '',
    danhSachChuDe: '',
    taiLieuMau: '',
    trinhDoHocSinh: '',
    tyLeTracNghiem: '',
    tyLeTuLuan: '',
    thangDiem: '10',
    tyLeNhanBiet: '',
    tyLeThongHieu: '',
    tyLeVanDung: '',
    tyLeVanDungCao: '',
  });

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    setGeneratedContent(`MA TRẬN ĐỀ KIỂM TRA

Môn: ${formData.monHoc}
Lớp: ${formData.lop}
Thời gian: ${formData.thoiGianKiemTra}
Hình thức: ${formData.hinhThucKiemTra}

I. MA TRẬN ĐỀ
[Bảng ma trận theo mức độ nhận thức và nội dung kiến thức]

II. ĐỀ KIỂM TRA
...

III. ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM
...

IV. BẢNG ĐẶC TẢ
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
    { id: 'menu1', label: 'Thiết lập đề kiểm tra', number: 1 },
    { id: 'menu2', label: 'Phạm vi nội dung kiểm tra', number: 2 },
    { id: 'menu3', label: 'Cấu trúc & tỷ lệ', number: 3 },
  ];

  const handleExampleClick = (value: string) => {
    if (!focusedField) return;

    const fieldMap: Record<string, keyof FormData> = {
      '73': 'monHoc',
      '74': 'thoiGianKiemTra',
      '75': 'hinhThucKiemTra',
      '76': 'mucTieuKiemTra',
      '77': 'phamViKienThuc',
      '78': 'taiLieuMau',
      '79': 'trinhDoHocSinh',
      '80': 'tyLeTracNghiem',
      '81': 'tyLeNhanBiet',
    };

    const fieldName = fieldMap[focusedField];
    if (fieldName) {
      const multiSelectFields = ['phamViKienThuc', 'hinhThucKiemTra'];

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
            <h3 className="font-semibold text-gray-900 text-sm">Xem trước Ma trận & Đề thi</h3>
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
            {/* Menu 1: Thiết lập đề kiểm tra */}
            {currentMenu === 'menu1' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 1 - Thiết lập đề kiểm tra</h2>
                  <p className="text-sm text-gray-500">Thông tin cơ bản về đề kiểm tra</p>
                </div>

                {/* Cửa sổ Workflow */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-indigo-600" />
                    <span className="text-sm font-semibold text-indigo-900">Cửa sổ Workflow</span>
                  </div>
                  <a
                    href={EXTERNAL_LINKS.WORKFLOWS.MA_TRAN_DE_THI}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-600 hover:underline break-all"
                  >
                    {EXTERNAL_LINKS.WORKFLOWS.MA_TRAN_DE_THI}
                  </a>
                </div>

                {/* Môn học */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Môn học [73] <span className="text-red-500">*</span>
                    <TooltipIcon text="Môn học: Toán; Ngữ văn; Tiếng Anh; KHTN; Lịch sử & Địa lí; Tin học; Công nghệ; GDCD" />
                  </label>
                  <input
                    type="text"
                    value={formData.monHoc}
                    onChange={e => updateField('monHoc', e.target.value)}
                    onFocus={() => setFocusedField('73')}
                    placeholder="Ví dụ: Toán, Ngữ văn, Tiếng Anh..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Lớp */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Lớp <span className="text-red-500">*</span>
                    <TooltipIcon text="Nhập lớp: 6, 7, ..." />
                  </label>
                  <input
                    type="text"
                    value={formData.lop}
                    onChange={e => updateField('lop', e.target.value)}
                    placeholder="Ví dụ: 6, 7, 10"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Thời gian kiểm tra */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Thời gian kiểm tra [74] <span className="text-red-500">*</span>
                    <TooltipIcon text="Thời gian: 45 phút, 60 phút, 90 phút, 120 phút,..." />
                  </label>
                  <input
                    type="text"
                    value={formData.thoiGianKiemTra}
                    onChange={e => updateField('thoiGianKiemTra', e.target.value)}
                    onFocus={() => setFocusedField('74')}
                    placeholder="Ví dụ: 45 phút, 60 phút..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Hình thức kiểm tra */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Hình thức kiểm tra [75] <span className="text-red-500">*</span>
                    <TooltipIcon text="Hình thức: Trắc nghiệm; tự luận; kết hợp" />
                  </label>
                  <input
                    type="text"
                    value={formData.hinhThucKiemTra}
                    onChange={e => updateField('hinhThucKiemTra', e.target.value)}
                    onFocus={() => setFocusedField('75')}
                    placeholder="Ví dụ: Trắc nghiệm, Tự luận, Kết hợp..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Mục tiêu kiểm tra */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Mục tiêu kiểm tra [76]
                    <TooltipIcon text="Mục tiêu để: Kiểm tra thường xuyên, giữa kỳ, cuối kỳ, luyện thi" />
                  </label>
                  <input
                    type="text"
                    value={formData.mucTieuKiemTra}
                    onChange={e => updateField('mucTieuKiemTra', e.target.value)}
                    onFocus={() => setFocusedField('76')}
                    placeholder="Ví dụ: Kiểm tra thường xuyên, giữa kỳ..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Menu 2: Phạm vi nội dung kiểm tra */}
            {currentMenu === 'menu2' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 2 - Phạm vi nội dung kiểm tra</h2>
                  <p className="text-sm text-gray-500">Xác định phạm vi kiến thức và tài liệu mẫu</p>
                </div>

                {/* Phạm vi kiến thức */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Phạm vi kiến thức [77] <span className="text-red-500">*</span>
                    <TooltipIcon text="Kiến thức gồm: Tên bài, Tên chương, phạm vị kiến thức" />
                  </label>
                  <FileUploadZone label="Upload file SGK, chương trình" />
                  <textarea
                    value={formData.phamViKienThuc}
                    onChange={e => updateField('phamViKienThuc', e.target.value)}
                    onFocus={() => setFocusedField('77')}
                    placeholder="Hoặc nhập phạm vi kiến thức: Tên bài, Tên chương..."
                    rows={8}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                

                {/* Tài liệu mẫu để áp dụng theo */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Tài liệu mẫu để áp dụng theo [78]
                    <TooltipIcon text="Upload File mẫu chuẩn: Đề của sở GD, của trường, đề năm học cũ của mình, đề thi thật" />
                  </label>
                  <div className="mb-3">
                    <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium border border-indigo-200">
                      Chọn trong hệ thống mẫu
                    </button>
                  </div>
                  <FileUploadZone label="Upload file đề mẫu" />
                  <textarea
                    value={formData.taiLieuMau}
                    onChange={e => updateField('taiLieuMau', e.target.value)}
                    onFocus={() => setFocusedField('78')}
                    placeholder="Hoặc nhập link mẫu văn bản..."
                    rows={4}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* Menu 3: Cấu trúc & tỷ lệ */}
            {currentMenu === 'menu3' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 3 - Cấu trúc & tỷ lệ</h2>
                  <p className="text-sm text-gray-500">Thiết lập cấu trúc và tỷ lệ các mức độ</p>
                </div>

                {/* Trình độ học sinh */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Trình độ học sinh [79]
                    <TooltipIcon text="Cho học sinh: Trung bình; khá; giỏi; phân hóa; luyện thi thật" />
                  </label>
                  <input
                    type="text"
                    value={formData.trinhDoHocSinh}
                    onChange={e => updateField('trinhDoHocSinh', e.target.value)}
                    onFocus={() => setFocusedField('79')}
                    placeholder="Ví dụ: Trung bình, Khá, Giỏi..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Cấu trúc đề kiểm tra */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Cấu trúc đề kiểm tra (Tỷ lệ: Trắc nghiệm / Tự luận / Kết hợp) [80]
                    <TooltipIcon text="Tỷ lệ %: Trắc nghiệm / Tự luận / Kết hợp. VD: Tỷ lệ: 40/40/20" />
                  </label>
                  <input
                    type="text"
                    value={formData.tyLeTracNghiem}
                    onChange={e => updateField('tyLeTracNghiem', e.target.value)}
                    onFocus={() => setFocusedField('80')}
                    placeholder="Ví dụ: 40/40/20"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Thang điểm */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Thang điểm
                    <TooltipIcon text="Thang điểm: 10, 100,..." />
                  </label>
                  <input
                    type="text"
                    value={formData.thangDiem}
                    onChange={e => updateField('thangDiem', e.target.value)}
                    placeholder="Ví dụ: 10, 100..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Tỷ lệ mức độ nhận thức */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Tỷ lệ mức độ nhận thức [81]
                    <TooltipIcon text="Tỷ lệ %: Nhận biết / Thông hiểu / Vận dụng / Vận dụng cao. VD: Tỷ lệ: 20/30/40/10" />
                  </label>
                  <input
                    type="text"
                    value={formData.tyLeNhanBiet}
                    onChange={e => updateField('tyLeNhanBiet', e.target.value)}
                    onFocus={() => setFocusedField('81')}
                    placeholder="Ví dụ: 20/30/40/10"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                {/* Edit Options after generation */}
                {showEditOptions && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-5">
                    <h3 className="font-semibold text-indigo-900 text-sm mb-4 flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Hoàn tất - Chỉnh sửa & Xuất bản
                    </h3>

                    <div className="space-y-3 mb-4">
                      <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium justify-center">
                        <FileDown size={14} />
                        Tạo Ma trận đề, Bảng Đặc tả
                      </button>
                      <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium justify-center">
                        <FileDown size={14} />
                        Đáp án & Hướng dẫn chấm
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium justify-center">
                        <Save size={14} />
                        Lưu văn bản
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium justify-center">
                        <MessageSquare size={14} />
                        Tuỳ chỉnh với AI
                      </button>
                      <button className="col-span-2 flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium justify-center">
                        <FileDown size={14} />
                        Xuất Word
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-indigo-600 space-y-1">
                      <div>• <strong>Lưu văn bản:</strong> Lưu bản nháp</div>
                      <div>• <strong>Tuỳ chỉnh với AI:</strong> Chat chỉnh sửa văn bản, có gắn File</div>
                      <div>• <strong>Xuất Word:</strong> Tải .docx</div>
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
            Menu {menuItems.find(m => m.id === currentMenu)?.number} / 3
          </div>

          {currentMenu !== 'menu3' ? (
            <button
              onClick={() => {
                const idx = menuItems.findIndex(m => m.id === currentMenu);
                if (idx < menuItems.length - 1) goToMenu(menuItems[idx + 1].id);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors text-sm font-medium shadow-md"
            >
              Tiếp tục
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={!formData.monHoc || !formData.lop || !formData.hinhThucKiemTra}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                !formData.monHoc || !formData.lop || !formData.hinhThucKiemTra
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md'
              }`}
            >
              <Sparkles size={16} />
              Hoàn tất / Tạo đề, đáp án
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">MA TRẬN & ĐỀ KIỂM TRA</h1>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Môn:</strong> {formData.monHoc}</div>
                <div><strong>Lớp:</strong> {formData.lop}</div>
                <div><strong>Thời gian:</strong> {formData.thoiGianKiemTra}</div>
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
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Chưa có nội dung</h3>
            <p className="text-sm text-gray-500">
              Điền thông tin và nhấn "Tạo đề, đáp án" để xem ma trận
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
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer"
      >
        <Upload size={32} className="mx-auto text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-700 mb-1">
          {label || 'Kéo thả file vào đây hoặc click để chọn'}
        </p>
        <p className="text-xs text-gray-500">
          .doc, .docx, .pdf
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
              <File size={16} className="text-indigo-600 flex-shrink-0" />
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
