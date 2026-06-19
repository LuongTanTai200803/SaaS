import { useState } from 'react';
import {
  Upload, Info, CheckCircle2, Sparkles, X, File, Eye, FileDown, Calendar as CalendarIcon
} from 'lucide-react';
import { EXTERNAL_LINKS } from '../../api/urls';
import { ContextualHelpPanel } from '../../components/ContextualHelpPanel';

interface RutGonKiemTraFormProps {
  onGenerate?: (data: any) => void;
}

interface FormData {
  chucNang: 'tom-tat' | 'kiem-tra' | '';
  loaiVanBan: string;
  noiDungVanBan: string;
  vanBanMauDoiChieu: string;
  kieuDauRa: string;
  doDai: string;
}

export function RutGonKiemTraForm({ onGenerate }: RutGonKiemTraFormProps) {
  const [generatedContent, setGeneratedContent] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    chucNang: '',
    loaiVanBan: '',
    noiDungVanBan: '',
    vanBanMauDoiChieu: '',
    kieuDauRa: '',
    doDai: '',
  });

  const chucNangOptions = [
    { value: 'tom-tat', label: 'Tóm tắt văn bản' },
    { value: 'kiem-tra', label: 'Kiểm tra thể thức' },
  ];

  const loaiVanBanOptions = ['Văn bản Đảng', 'Nhà nước'];

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    if (formData.chucNang === 'tom-tat') {
      setGeneratedContent('Văn bản đã được tóm tắt:\n\n• Điểm chính 1...\n• Điểm chính 2...\n• Điểm chính 3...');
    } else {
      setGeneratedContent('Kết quả kiểm tra thể thức:\n\nLỗi tìm thấy: 3\n\n1. Lỗi định dạng tiêu đề\n2. Thiếu chữ ký\n3. Sai thể thức ngày tháng');
    }
    setShowResults(true);
    if (onGenerate) {
      onGenerate(formData);
    }
  };

  const handleExampleClick = (value: string) => {
    if (!focusedField) return;

    const fieldMap: Record<string, keyof FormData> = {
      '58': 'kieuDauRa',
      '59': 'doDai',
    };

    const fieldName = fieldMap[focusedField];
    if (fieldName) {
      updateField(fieldName, value);
    }
  };

  return (
    <div className="flex h-full w-full bg-gray-50">
      {/* Left Preview Panel */}
      <div className="flex-[4.5] min-w-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Kết quả</h3>
          </div>
          <button className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
            Đóng
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ResultPreview formData={formData} generatedContent={generatedContent} />
        </div>
      </div>

      {/* Center Form Content */}
      <div className="flex-[3.5] min-w-0 flex flex-col overflow-hidden bg-white">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 1 - Chọn chức năng</h2>
                <p className="text-sm text-gray-500">Tóm tắt hoặc kiểm tra thể thức văn bản</p>
              </div>

              {/* Cửa sổ Workflow */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-orange-600" />
                  <span className="text-sm font-semibold text-orange-900">Cửa sổ Workflow</span>
                </div>
                <a
                  href={EXTERNAL_LINKS.WORKFLOWS.RUT_GON_KIEM_TRA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-orange-600 hover:underline break-all"
                >
                  {EXTERNAL_LINKS.WORKFLOWS.RUT_GON_KIEM_TRA}
                </a>
              </div>

              {/* Chức năng cần làm */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Chức năng cần làm <span className="text-red-500">*</span>
                  <TooltipIcon text="Chọn Tóm tắt văn bản hoặc Kiểm tra thể thức" />
                </label>
                <select
                  value={formData.chucNang}
                  onChange={e => updateField('chucNang', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-gray-900 bg-white"
                >
                  <option value="">-- Chọn chức năng --</option>
                  {chucNangOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Loại văn bản */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Loại văn bản
                  <TooltipIcon text="Văn bản Đảng / Nhà nước" />
                </label>
                <input
                  list="loaiVanBan-options"
                  value={formData.loaiVanBan}
                  onChange={e => updateField('loaiVanBan', e.target.value)}
                  placeholder="-- Chọn hoặc nhập loại văn bản --"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-gray-900 bg-white"
                />
                <datalist id="loaiVanBan-options">
                  {loaiVanBanOptions.map(option => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </div>

              {/* Văn bản */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Tải văn bản mẫu chuẩn đối chiếu  <span className="text-red-500">*</span>
                  <TooltipIcon text="Nhập nội dung hoặc upload file văn bản cần xử lý" />
                </label>
                <FileUploadZone />
                <textarea
                  value={formData.noiDungVanBan}
                  onChange={e => updateField('noiDungVanBan', e.target.value)}
                  placeholder="Hoặc nhập nội dung văn bản tại đây..."
                  rows={10}
                  className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                />
              </div>

              {/* Tải văn bản mẫu chuẩn đối chiếu */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Tải văn bản mẫu chuẩn đối chiếu
                  <TooltipIcon text="File mẫu của đơn vị để đối chiếu" />
                </label>
                <FileUploadZone />
                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-xs text-gray-700 space-y-1">
                    <div className="font-semibold mb-2">Quy định thể thức:</div>
                    <div>• <strong>Đảng:</strong> ...</div>
                    <div>• <strong>Nhà nước:</strong> Nghị định số 30/2020/NĐ-CP</div>
                  </div>
                </div>
              </div>

              {/* Kiểu đầu ra */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Kiểu đầu ra [58]
                  <TooltipIcon text="Trình bày thành: Đoạn văn / Gạch đầu dòng / Bảng lỗi / Bản chỉnh sửa hoàn chỉnh" />
                </label>
                <input
                  type="text"
                  value={formData.kieuDauRa}
                  onChange={e => updateField('kieuDauRa', e.target.value)}
                  onFocus={() => setFocusedField('58')}
                  placeholder="Ví dụ: Đoạn văn, Gạch đầu dòng..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-gray-900 bg-white"
                />
                {formData.kieuDauRa === 'Bảng lỗi' && (
                  <div className="mt-2 text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded p-2">
                    Tạo bảng lỗi cần sửa: Bảng vị trí lỗi, lý do, gợi ý sửa
                  </div>
                )}
              </div>

              {/* Độ dài văn bản */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Độ dài văn bản [59]
                  <TooltipIcon text="Trình bày: Ngắn gọn, trung bình, đầy đủ, chi tiết" />
                </label>
                <input
                  type="text"
                  value={formData.doDai}
                  onChange={e => updateField('doDai', e.target.value)}
                  onFocus={() => setFocusedField('59')}
                  placeholder="Ví dụ: Ngắn gọn, trung bình..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-gray-900 bg-white"
                />
              </div>

              {/* Action Buttons */}
              {showResults && (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-5">
                  <h3 className="font-semibold text-orange-900 text-sm mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Hoàn tất - Xuất kết quả
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium justify-center">
                      <FileDown size={14} />
                      Xuất Word
                    </button>
                    <a
                      href={EXTERNAL_LINKS.TOOLS.GOOGLE_CALENDAR}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium justify-center"
                    >
                      <CalendarIcon size={14} />
                      Nhắc Lịch Calendar
                    </a>
                  </div>

                  <div className="mt-3 text-xs text-orange-600 space-y-1">
                    <div>• <strong>Xuất Word:</strong> Tải file .docx</div>
                    <div>• <strong>Nhắc Lịch:</strong> Tạo nhắc nhở trên Google Calendar</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 bg-white px-8 py-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {formData.chucNang === 'tom-tat' ? 'Tóm tắt văn bản' : formData.chucNang === 'kiem-tra' ? 'Kiểm tra thể thức' : 'Chọn chức năng'}
          </div>

          <button
            onClick={handleGenerate}
            disabled={!formData.chucNang || !formData.noiDungVanBan}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              !formData.chucNang || !formData.noiDungVanBan
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 shadow-md'
            }`}
          >
            <Sparkles size={16} />
            {formData.chucNang === 'tom-tat' ? 'Tóm tắt văn bản' : formData.chucNang === 'kiem-tra' ? 'Kiểm tra thể thức' : 'Bắt đầu'}
          </button>
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

function ResultPreview({ formData, generatedContent }: { formData: FormData; generatedContent: string }) {
  return (
    <div className="p-8 bg-white min-h-full">
      <div className="max-w-2xl mx-auto">
        {generatedContent ? (
          <div>
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                {formData.chucNang === 'tom-tat' ? 'Kết quả tóm tắt' : 'Kết quả kiểm tra thể thức'}
              </h2>
              <div className="text-xs text-gray-500">
                Loại: {formData.loaiVanBan || 'Chưa xác định'} • Kiểu: {formData.kieuDauRa || 'Mặc định'}
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
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Chưa có kết quả</h3>
            <p className="text-sm text-gray-500">
              Nhập văn bản và chọn chức năng để bắt đầu
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
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 hover:bg-orange-50/30 transition-all cursor-pointer"
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
              <File size={16} className="text-orange-600 flex-shrink-0" />
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
