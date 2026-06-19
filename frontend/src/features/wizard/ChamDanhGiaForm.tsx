import { useState } from 'react';
import {
  Upload, Info, CheckCircle2, Sparkles, X, File, Eye, FileDown, MessageSquare, Save, TrendingUp
} from 'lucide-react';
import { EXTERNAL_LINKS } from '../../api/urls';
import { ContextualHelpPanel } from '../../components/ContextualHelpPanel';

interface ChamDanhGiaFormProps {
  onGenerate?: (data: any) => void;
}

interface FormData {
  monHoc: string;
  lop: string;
  baiaLamHocSinh: string;
  dapAnHuongDan: string;
  danhSachHocSinh: string;
  canCuDanhGia: string;
  yeuCauDanhGia: string;
}

export function ChamDanhGiaForm({ onGenerate }: ChamDanhGiaFormProps) {
  const [generatedContent, setGeneratedContent] = useState('');
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    monHoc: '',
    lop: '',
    baiaLamHocSinh: '',
    dapAnHuongDan: '',
    danhSachHocSinh: '',
    canCuDanhGia: '',
    yeuCauDanhGia: '',
  });

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    setGeneratedContent(`KẾT QUẢ CHẤM BÀI VÀ ĐÁNH GIÁ

Môn: ${formData.monHoc}
Lớp: ${formData.lop}

I. KẾT QUẢ CHẤM BÀI
[Bảng kết quả chấm bài theo từng học sinh]

II. PHÂN TÍCH NĂNG LỰC HỌC SINH
- Điểm trung bình lớp: ...
- Phân bố điểm: ...
- Năng lực nổi bật: ...
- Năng lực cần cải thiện: ...

III. NHẬN XÉT CHI TIẾT TỪNG HỌC SINH
[Nhận xét cá nhân hóa cho từng học sinh]

IV. ĐỀ XUẤT PHƯƠNG PHÁP CẢI THIỆN
...`);
    setShowEditOptions(true);
    if (onGenerate) {
      onGenerate(formData);
    }
  };

  const handleExampleClick = (value: string) => {
    if (!focusedField) return;

    const fieldMap: Record<string, keyof FormData> = {
      '82': 'monHoc',
      '83': 'baiaLamHocSinh',
      '84': 'dapAnHuongDan',
      '85': 'danhSachHocSinh',
      '86': 'yeuCauDanhGia',
    };

    const fieldName = fieldMap[focusedField];
    if (fieldName) {
      const multiSelectFields = ['yeuCauDanhGia'];

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
      <div className="flex-[4.5] min-w-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={16} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900 text-sm">Xem trước Kết quả</h3>
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
                <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 1 - Thiết lập Chấm, Đánh giá, Phân tích năng lực Học sinh</h2>
                <p className="text-sm text-gray-500">Tải bài làm và đáp án để chấm điểm, đánh giá năng lực học sinh</p>
              </div>

              {/* Cửa sổ Workflow */}
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-pink-600" />
                  <span className="text-sm font-semibold text-pink-900">Cửa sổ Workflow</span>
                </div>
                <a
                  href={EXTERNAL_LINKS.WORKFLOWS.CHAM_DANH_GIA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-pink-600 hover:underline break-all"
                >
                  {EXTERNAL_LINKS.WORKFLOWS.CHAM_DANH_GIA}
                </a>
              </div>

              {/* Môn học */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Môn học [82] <span className="text-red-500">*</span>
                  <TooltipIcon text="Môn: Toán; Ngữ văn; Tiếng Anh; KHTN; Lịch sử & Địa lí; Tin học; Công nghệ; GDCD" />
                </label>
                <input
                  type="text"
                  value={formData.monHoc}
                  onChange={e => updateField('monHoc', e.target.value)}
                  onFocus={() => setFocusedField('82')}
                  placeholder="Ví dụ: Toán, Ngữ văn..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-gray-900 bg-white"
                />
              </div>

              {/* Lớp */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Lớp <span className="text-red-500">*</span>
                  <TooltipIcon text="Nhập lớp: 6, 7, ...., Luyện thi" />
                </label>
                <input
                  type="text"
                  value={formData.lop}
                  onChange={e => updateField('lop', e.target.value)}
                  placeholder="Ví dụ: 6, 7, Luyện thi 10"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-gray-900 bg-white"
                />
              </div>

              {/* Bài làm của Học sinh */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Bài làm của Học sinh [83] <span className="text-red-500">*</span>
                  <TooltipIcon text="Tải File bài làm của HS" />
                </label>
                <FileUploadZone label="Tải file bài làm của học sinh" />
                <textarea
                  value={formData.baiaLamHocSinh}
                  onChange={e => updateField('baiaLamHocSinh', e.target.value)}
                  onFocus={() => setFocusedField('83')}
                  placeholder="Hoặc nhập nội dung bài làm của học sinh..."
                  rows={6}
                  className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                />
              </div>

              {/* Đáp án & Hướng dẫn chấm / Bảng điểm */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Đáp án & Hướng dẫn chấm / Bảng điểm hoặc Kết quả học tập của học sinh [84]
                  <TooltipIcon text="Tải Đáp án & Hướng dẫn chấm hay bảng điểm hoặc kết quả học tập của học sinh" />
                </label>
                <FileUploadZone label="Tải Đáp án & Hướng dẫn chấm hay bảng điểm" />
                <textarea
                  value={formData.dapAnHuongDan}
                  onChange={e => updateField('dapAnHuongDan', e.target.value)}
                  onFocus={() => setFocusedField('84')}
                  placeholder="Hoặc nhập đáp án và hướng dẫn chấm..."
                  rows={6}
                  className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                />
              </div>

              {/* Danh sách Học sinh của Lớp học */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Danh sách Học sinh của Lớp học [85]
                  <TooltipIcon text="Tải Danh sách Học sinh của Lớp học" />
                </label>
                <FileUploadZone label="Tải Danh sách Học sinh của Lớp học" />
                <textarea
                  value={formData.danhSachHocSinh}
                  onChange={e => updateField('danhSachHocSinh', e.target.value)}
                  onFocus={() => setFocusedField('85')}
                  placeholder="Hoặc nhập danh sách học sinh..."
                  rows={4}
                  className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                />
              </div>

              {/* Căn cứ đánh giá Học sinh */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Căn cứ đánh giá Học sinh / Văn bản quy định đánh giá học sinh
                  <TooltipIcon text="Chọn Quy định áp dụng để đánh giá Học sinh" />
                </label>
                <div className="mb-3">
                  <button className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors text-sm font-medium border border-pink-200">
                    Chọn File trong hệ thống
                  </button>
                </div>
                <FileUploadZone label="Tải văn bản quy định đánh giá học sinh" />
                <textarea
                  value={formData.canCuDanhGia}
                  onChange={e => updateField('canCuDanhGia', e.target.value)}
                  placeholder="Hoặc nhập link mẫu văn bản quy định..."
                  rows={3}
                  className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                />
              </div>

              {/* Yêu cầu đánh giá Học sinh */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Yêu cầu đánh giá học sinh [86]
                  <TooltipIcon text="Yêu cầu đánh giá học sinh: Đầy đủ / ngắn gọn / rõ ràng / mạch lạt" />
                </label>
                <input
                  type="text"
                  value={formData.yeuCauDanhGia}
                  onChange={e => updateField('yeuCauDanhGia', e.target.value)}
                  onFocus={() => setFocusedField('86')}
                  placeholder="Ví dụ: Đầy đủ, ngắn gọn..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-gray-900 bg-white"
                />
              </div>

              {/* Edit Options after generation */}
              {showEditOptions && (
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-5">
                  <h3 className="font-semibold text-pink-900 text-sm mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Hoàn tất - Chỉnh sửa & Xuất bản
                  </h3>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium justify-center">
                      <MessageSquare size={14} />
                      Tuỳ chỉnh với AI
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium justify-center">
                      <TrendingUp size={14} />
                      Phân tích năng lực HS
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-pink-300 text-pink-700 rounded-lg hover:bg-pink-50 transition-colors text-sm font-medium justify-center">
                      <Save size={14} />
                      Lưu văn bản
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-pink-300 text-pink-700 rounded-lg hover:bg-pink-50 transition-colors text-sm font-medium justify-center">
                      <FileDown size={14} />
                      Xuất Word
                    </button>
                  </div>

                  <div className="mt-3 text-xs text-pink-600 space-y-1">
                    <div>• <strong>Lưu văn bản:</strong> Lưu bản nháp</div>
                    <div>• <strong>Xuất Word:</strong> Tải .docx</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 bg-white px-8 py-4 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Chấm & Đánh giá năng lực Học sinh
          </div>

          <button
            onClick={handleGenerate}
            disabled={!formData.monHoc || !formData.lop}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              !formData.monHoc || !formData.lop
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:from-pink-700 hover:to-rose-700 shadow-md'
            }`}
          >
            <Sparkles size={16} />
            Hoàn tất / Chấm & Đánh giá
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
                Kết quả Chấm bài & Đánh giá
              </h2>
              <div className="text-xs text-gray-500">
                Môn: {formData.monHoc || 'Chưa xác định'} • Lớp: {formData.lop || 'Chưa xác định'}
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
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={32} className="text-pink-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Chưa có kết quả</h3>
            <p className="text-sm text-gray-500">
              Tải bài làm và đáp án để bắt đầu chấm điểm
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
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 hover:bg-pink-50/30 transition-all cursor-pointer"
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
              <File size={16} className="text-pink-600 flex-shrink-0" />
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
