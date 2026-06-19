import { useState } from 'react';
import { Check, Upload, FileText, X } from 'lucide-react';

type Step = 1 | 2 | 3;

interface ExamSetup {
  subject: string;
  grade: string;
  duration: string;
  examType: string;
}

interface KnowledgeScope {
  files: File[];
  topics: string[];
}

interface DifficultyLevel {
  level: string;
  percentage: number;
  questionCount: number;
}

const steps = [
  { id: 1, title: 'Thiết lập đề', description: 'Thông tin cơ bản' },
  { id: 2, title: 'Phạm vi kiến thức', description: 'Tài liệu & chủ đề' },
  { id: 3, title: 'Cấu trúc & tỷ lệ', description: 'Độ khó câu hỏi' },
];

const subjects = [
  'Toán học',
  'Ngữ văn',
  'Tiếng Anh',
  'Vật lý',
  'Hóa học',
  'Sinh học',
  'Lịch sử',
  'Địa lý',
];

const grades = [
  'Lớp 6',
  'Lớp 7',
  'Lớp 8',
  'Lớp 9',
  'Lớp 10',
  'Lớp 11',
  'Lớp 12',
];

const examTypes = [
  'Kiểm tra 15 phút',
  'Kiểm tra 1 tiết',
  'Kiểm tra giữa kỳ',
  'Kiểm tra cuối kỳ',
  'Thi thử',
];

const availableTopics = [
  'Đại số',
  'Hình học',
  'Giải tích',
  'Xác suất thống kê',
  'Số học',
  'Lượng giác',
  'Hàm số',
  'Phương trình',
];

export function ExamGenerator() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [examSetup, setExamSetup] = useState<ExamSetup>({
    subject: '',
    grade: '',
    duration: '',
    examType: '',
  });
  const [knowledgeScope, setKnowledgeScope] = useState<KnowledgeScope>({
    files: [],
    topics: [],
  });
  const [difficultyLevels, setDifficultyLevels] = useState<DifficultyLevel[]>([
    { level: 'Dễ', percentage: 40, questionCount: 4 },
    { level: 'Trung bình', percentage: 40, questionCount: 4 },
    { level: 'Khó', percentage: 20, questionCount: 2 },
  ]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setKnowledgeScope({ ...knowledgeScope, files: [...knowledgeScope.files, ...files] });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setKnowledgeScope({ ...knowledgeScope, files: [...knowledgeScope.files, ...files] });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = knowledgeScope.files.filter((_, i) => i !== index);
    setKnowledgeScope({ ...knowledgeScope, files: newFiles });
  };

  const toggleTopic = (topic: string) => {
    const newTopics = knowledgeScope.topics.includes(topic)
      ? knowledgeScope.topics.filter((t) => t !== topic)
      : [...knowledgeScope.topics, topic];
    setKnowledgeScope({ ...knowledgeScope, topics: newTopics });
  };

  const updateDifficulty = (index: number, field: 'percentage' | 'questionCount', value: number) => {
    const newLevels = [...difficultyLevels];
    newLevels[index][field] = value;
    setDifficultyLevels(newLevels);
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return examSetup.subject && examSetup.grade && examSetup.duration && examSetup.examType;
    }
    if (currentStep === 2) {
      return knowledgeScope.files.length > 0 || knowledgeScope.topics.length > 0;
    }
    return true;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Tạo Ma trận & Đề Kiểm tra</h2>
        <p className="text-sm text-gray-600 mt-1">
          Sử dụng AI để tạo đề kiểm tra phù hợp với chương trình
        </p>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep > step.id
                      ? 'bg-blue-600 text-white'
                      : currentStep === step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step.id ? <Check size={20} /> : step.id}
                </div>
                <div className="flex-1">
                  <div
                    className={`font-medium ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-full mx-4 transition-colors ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {currentStep === 1 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Thiết lập đề kiểm tra</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Môn học <span className="text-red-500">*</span>
                </label>
                <select
                  value={examSetup.subject}
                  onChange={(e) => setExamSetup({ ...examSetup, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn môn học</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khối lớp <span className="text-red-500">*</span>
                </label>
                <select
                  value={examSetup.grade}
                  onChange={(e) => setExamSetup({ ...examSetup, grade: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn khối lớp</option>
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian làm bài (phút) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={examSetup.duration}
                  onChange={(e) => setExamSetup({ ...examSetup, duration: e.target.value })}
                  placeholder="Ví dụ: 45"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại đề kiểm tra <span className="text-red-500">*</span>
                </label>
                <select
                  value={examSetup.examType}
                  onChange={(e) => setExamSetup({ ...examSetup, examType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn loại đề</option>
                  {examTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Phạm vi kiến thức</h3>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tải lên tài liệu tham khảo
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-700 font-medium mb-2">
                  Kéo thả file vào đây hoặc nhấn để chọn
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Hỗ trợ: PDF, DOCX, TXT (Tối đa 10MB)
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.docx,.txt"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  Chọn file
                </label>
              </div>

              {knowledgeScope.files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {knowledgeScope.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="text-blue-600" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Chọn chủ đề kiến thức
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                      knowledgeScope.topics.includes(topic)
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Cấu trúc & tỷ lệ độ khó</h3>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Điều chỉnh tỷ lệ phần trăm và số lượng câu hỏi cho mỗi mức độ
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Mức độ
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Tỷ lệ phần trăm (%)
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Số lượng câu hỏi
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Trực quan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {difficultyLevels.map((level, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              index === 0
                                ? 'bg-green-500'
                                : index === 1
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                          ></div>
                          <span className="font-medium text-gray-900">{level.level}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        <input
                          type="number"
                          value={level.percentage}
                          onChange={(e) =>
                            updateDifficulty(index, 'percentage', Number(e.target.value))
                          }
                          min="0"
                          max="100"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        <input
                          type="number"
                          value={level.questionCount}
                          onChange={(e) =>
                            updateDifficulty(index, 'questionCount', Number(e.target.value))
                          }
                          min="0"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              index === 0
                                ? 'bg-green-500'
                                : index === 1
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${level.percentage}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-6 py-4 text-gray-900">Tổng cộng</td>
                    <td className="px-6 py-4 text-gray-900">
                      {difficultyLevels.reduce((sum, level) => sum + level.percentage, 0)}%
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {difficultyLevels.reduce((sum, level) => sum + level.questionCount, 0)} câu
                    </td>
                    <td className="px-6 py-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Lưu ý:</strong> Tổng tỷ lệ phần trăm nên bằng 100% để đảm bảo cấu trúc đề hợp lý.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1) as Step)}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Quay lại
          </button>

          <div className="flex gap-3">
            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(Math.min(3, currentStep + 1) as Step)}
                disabled={!canProceed()}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  canProceed()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Tiếp tục
              </button>
            ) : (
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                Tạo đề kiểm tra
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
