import React, { useMemo, useState } from 'react';
import { Cpu, Zap, DollarSign, Activity, AlertTriangle, Save, Shield, CheckCircle, ChevronDown, ArrowUpRight } from 'lucide-react';

type UserPlan = 'Basic' | 'Pro' | 'Enterprise';

type AIModel = {
  id: string;
  name: string;
  provider: string;
  enabled: boolean;
  costPer1kWords: number;
  latencyMs: number;
  errorRate: number;
  planBindings: UserPlan[];
  color: string;
};

type AssistantConfig = {
  id: string;
  name: string;
  description: string;
  primaryModel: string;
  fallbackModel: string;
  prompt: string;
};

const availablePlans: UserPlan[] = ['Basic', 'Pro', 'Enterprise'];

export function AIModelControls() {
  const [models, setModels] = useState<AIModel[]>([
    {
      id: 'deepseek-v4',
      name: 'DeepSeek V4 Flash',
      provider: 'DeepSeek',
      enabled: true,
      costPer1kWords: 0.15,
      latencyMs: 180,
      errorRate: 0.32,
      planBindings: ['Basic', 'Pro'],
      color: 'from-purple-500 to-pink-600',
    },
    {
      id: 'claude-3.5',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      enabled: true,
      costPer1kWords: 3.5,
      latencyMs: 450,
      errorRate: 1.08,
      planBindings: ['Pro', 'Enterprise'],
      color: 'from-orange-500 to-red-600',
    },
    {
      id: 'gpt-5',
      name: 'GPT-5.4 Turbo',
      provider: 'OpenAI',
      enabled: false,
      costPer1kWords: 5.0,
      latencyMs: 320,
      errorRate: 0.84,
      planBindings: ['Enterprise'],
      color: 'from-green-500 to-emerald-600',
    },
  ]);

  const [assistants, setAssistants] = useState<AssistantConfig[]>([
    {
      id: 'van-kien-dang',
      name: 'Trợ lý Văn kiện Đảng',
      description: 'Hỗ trợ soạn thảo nghị quyết, quyết định, chỉ thị và văn bản cho Tỉnh ủy, Đảng ủy, Chi bộ.',
      primaryModel: 'claude-3.5',
      fallbackModel: 'gpt-5',
      prompt: `Bạn là trợ lý văn kiện Đảng.

Hướng dẫn:
- Soạn thảo nghị quyết, quyết định và chỉ thị.
- Ưu tiên thể thức chính luận và hành chính.
- Xây dựng văn bản cho Tỉnh ủy, Đảng ủy và Chi bộ.`,
    },
    {
      id: 'van-ban-nha-nuoc',
      name: 'Trợ lý Văn bản Nhà nước',
      description: 'Hỗ trợ văn bản cho HĐND, UBND, MTTQ và đoàn thể như Công đoàn, Đoàn Thanh niên, Hội Phụ nữ.',
      primaryModel: 'claude-3.5',
      fallbackModel: 'gpt-5',
      prompt: `Bạn là trợ lý văn bản Nhà nước.

Yêu cầu:
- Soạn thảo công văn, báo cáo, quyết định cho cơ quan nhà nước.
- Hỗ trợ văn bản cho Mặt trận Tổ quốc, Công đoàn, Đoàn Thanh niên và Hội Phụ nữ.
- Giữ giọng văn chính thống và chuyên nghiệp.`,
    },
    {
      id: 'quan-ly-giao-duc',
      name: 'Trợ lý Quản lý Giáo dục & Nhà trường',
      description: 'Hỗ trợ văn bản cho Sở GD&ĐT, nhà trường, tổ chuyên môn và hồ sơ giáo viên.',
      primaryModel: 'deepseek-v4',
      fallbackModel: 'claude-3.5',
      prompt: `Bạn là trợ lý văn bản quản lý giáo dục.

Yêu cầu:
- Soạn văn bản cho Sở GD&ĐT, nhà trường và tổ chuyên môn.
- Soạn hồ sơ, báo cáo và đề xuất cho giáo viên.
- Dùng ngôn ngữ hành chính phù hợp với ngành giáo dục.`,
    },
    {
      id: 'bien-tap-phat-bieu',
      name: 'Trợ lý Biên tập & Phát biểu',
      description: 'Hỗ trợ tạo bài phát biểu cho lãnh đạo Đảng, UBND và ngành giáo dục theo nhiều phong cách.',
      primaryModel: 'gpt-5',
      fallbackModel: 'claude-3.5',
      prompt: `Bạn là trợ lý biên tập phát biểu.

Yêu cầu:
- Soạn bài phát biểu cho lãnh đạo Đảng, UBND và ngành giáo dục.
- Có thể tạo theo phong cách trang trọng, động viên hoặc chuyên đề.
- Giữ cấu trúc rõ ràng và đồng bộ với mục tiêu sự kiện.`,
    },
    {
      id: 'rut-gon-kiem-tra',
      name: 'Trợ lý Rút gọn & Kiểm tra văn bản',
      description: 'Tóm tắt văn bản và kiểm tra thể thức văn bản Đảng, Nhà nước.',
      primaryModel: 'deepseek-v4',
      fallbackModel: 'claude-3.5',
      prompt: `Bạn là trợ lý rút gọn và kiểm tra văn bản.

Hướng dẫn:
- Tóm tắt nội dung văn bản dài.
- Kiểm tra thể thức, bố cục và tiêu đề văn bản Đảng, Nhà nước.
- Đảm bảo văn phong chuẩn hành chính.`,
    },
    {
      id: 'soan-giao-an',
      name: 'Trợ lý Soạn giáo án',
      description: 'Hỗ trợ soạn giáo án cho các cấp học từ Mầm non đến THPT và GDTX.',
      primaryModel: 'deepseek-v4',
      fallbackModel: 'claude-3.5',
      prompt: `Bạn là trợ lý soạn giáo án.

Yêu cầu:
- Xây dựng giáo án cho Mầm non, Tiểu học, THCS, THPT và GDTX.
- Phân chia mục tiêu, hoạt động và đánh giá.
- Bám sát chương trình giáo dục và đối tượng học sinh.`,
    },
    {
      id: 'ma-tran-de-thi',
      name: 'Trợ lý Ma trận & Đề kiểm tra',
      description: 'Hỗ trợ tạo ma trận đề, đề thi học kỳ, luyện thi vào lớp 10 và ôn thi THPT.',
      primaryModel: 'claude-3.5',
      fallbackModel: 'gpt-5',
      prompt: `Bạn là trợ lý xây dựng ma trận và đề kiểm tra.

Yêu cầu:
- Tạo ma trận đề thi và đề thi học kỳ.
- Hỗ trợ tài liệu luyện thi vào lớp 10 và ôn thi THPT.
- Đảm bảo phân bổ kiến thức hợp lý theo mức độ.`,
    },
    {
      id: 'cham-danh-gia',
      name: 'Trợ lý Chấm & Đánh giá',
      description: 'Thực hiện chấm bài, đánh giá và phân tích năng lực học sinh.',
      primaryModel: 'deepseek-v4',
      fallbackModel: 'claude-3.5',
      prompt: `Bạn là trợ lý chấm bài và đánh giá học sinh.

Yêu cầu:
- Phân tích năng lực và phản hồi kết quả học tập.
- Đề xuất điểm mạnh, điểm cần cải thiện và hướng phát triển.
- Giữ cách diễn đạt rõ ràng, xây dựng.`,
    },
    {
      id: 'bao-cao-thanh-tich',
      name: 'Trợ lý Viết Báo cáo thành tích & Sáng kiến kinh nghiệm',
      description: 'Hỗ trợ đánh giá công chức, viên chức, đảng viên và viết báo cáo thành tích cá nhân, tập thể.',
      primaryModel: 'claude-3.5',
      fallbackModel: 'gpt-5',
      prompt: `Bạn là trợ lý viết báo cáo thành tích.

Yêu cầu:
- Soạn báo cáo thành tích cá nhân và tập thể.
- Hỗ trợ sáng kiến kinh nghiệm và đánh giá công chức, viên chức, đảng viên.
- Dùng ngôn ngữ trang trọng và thuyết phục.`,
    },
  ]);

  const [selectedAssistantId, setSelectedAssistantId] = useState<string>('van-kien-dang');
  const selectedAssistant = useMemo(
    () => assistants.find((assistant) => assistant.id === selectedAssistantId) || assistants[0],
    [assistants, selectedAssistantId]
  );
  const [modelPrompt, setModelPrompt] = useState(selectedAssistant.prompt);
  const [promptUploadName, setPromptUploadName] = useState<string>('');
  const [promptUploadError, setPromptUploadError] = useState<string>('');

  const toggleModel = (modelId: string) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === modelId ? { ...model, enabled: !model.enabled } : model
      )
    );
  };

  const updateModelCost = (modelId: string, cost: number) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === modelId ? { ...model, costPer1kWords: cost } : model
      )
    );
  };

  const togglePlanBinding = (modelId: string, plan: UserPlan) => {
    setModels((prev) =>
      prev.map((model) => {
        if (model.id !== modelId) return model;
        const bound = model.planBindings.includes(plan);
        return {
          ...model,
          planBindings: bound
            ? model.planBindings.filter((item) => item !== plan)
            : [...model.planBindings, plan],
        };
      })
    );
  };

  const saveAssistantPrompt = () => {
    setAssistants((prev) =>
      prev.map((assistant) =>
        assistant.id === selectedAssistant.id ? { ...assistant, prompt: modelPrompt } : assistant
      )
    );
  };

  const updateAssistantModel = (field: 'primaryModel' | 'fallbackModel', value: string) => {
    setAssistants((prev) =>
      prev.map((assistant) =>
        assistant.id === selectedAssistant.id ? { ...assistant, [field]: value } : assistant
      )
    );
  };

  const getLatencyStatus = (latency: number) => {
    if (latency < 200) return { color: 'text-emerald-400', status: 'Xuất sắc' };
    if (latency < 400) return { color: 'text-amber-400', status: 'Tốt' };
    return { color: 'text-rose-400', status: 'Chậm' };
  };

  const metrics = {
    totalCalls: 24847,
    avgLatency: 287,
    errorRate: 0.12,
    failoverEvents: 4,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Quản lý Model AI & Prompt</h1>
        <p className="text-sm text-slate-400 mt-1">
          Quản lý model theo gói, cấu hình prompt riêng cho từng trợ lý và giám sát chuyển dự phòng.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-slate-400">Tổng cuộc gọi API</p>
              <p className="text-2xl font-semibold text-slate-100">{metrics.totalCalls.toLocaleString()}</p>
            </div>
            <Activity size={22} className="text-cyan-400" />
          </div>
          <p className="text-xs text-slate-500">Số cuộc gọi API trong 24 giờ qua.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-slate-400">Thời gian phản hồi TB</p>
              <p className="text-2xl font-semibold text-slate-100">{metrics.avgLatency} ms</p>
            </div>
            <Zap size={22} className="text-amber-400" />
          </div>
          <p className="text-xs text-slate-500">Độ trễ trung bình toàn hệ thống.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-slate-400">Tỷ lệ lỗi API</p>
              <p className="text-2xl font-semibold text-slate-100">{metrics.errorRate}%</p>
            </div>
            <AlertTriangle size={22} className="text-rose-400" />
          </div>
          <p className="text-xs text-slate-500">Tỷ lệ lỗi hoạt động của các model.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {models.map((model) => {
              const latencyStatus = getLatencyStatus(model.latencyMs);
              return (
                <div
                  key={model.id}
                  className={`rounded-3xl overflow-hidden border ${model.enabled ? 'border-slate-700' : 'border-slate-800 opacity-70'} bg-slate-900`}
                >
                  <div className={`p-4 bg-gradient-to-r ${model.color}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white font-semibold text-lg">{model.name}</p>
                        <p className="text-white/80 text-xs mt-1">{model.provider}</p>
                      </div>
                      <Cpu size={24} className="text-white/90" />
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>Trạng thái model</span>
                      <button
                        onClick={() => toggleModel(model.id)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${model.enabled ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}
                      >
                        {model.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    <div className="text-sm text-slate-400">Chi phí 1k từ</div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-semibold text-slate-100">${model.costPer1kWords.toFixed(2)}</span>
                      <span className="text-xs text-slate-500">/ 1,000 words</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <div className="rounded-2xl bg-slate-950/80 p-3">
                        <div className="text-slate-400">Độ trễ</div>
                        <div className="text-slate-100 font-semibold mt-1">{model.latencyMs} ms</div>
                        <div className={`mt-1 ${latencyStatus.color}`}>{latencyStatus.status}</div>
                      </div>
                      <div className="rounded-2xl bg-slate-950/80 p-3">
                        <div className="text-slate-400">Tỷ lệ lỗi</div>
                        <div className="text-slate-100 font-semibold mt-1">{model.errorRate}%</div>
                        <div className="text-slate-500 mt-1">Theo thời gian thực</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-slate-400 uppercase tracking-[0.18em]">Ràng buộc gói</p>
                      <div className="flex flex-wrap gap-2">
                        {availablePlans.map((plan) => {
                          const active = model.planBindings.includes(plan);
                          return (
                            <button
                              key={plan}
                              onClick={() => togglePlanBinding(model.id, plan)}
                              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${active ? 'bg-cyan-600 text-slate-100' : 'bg-slate-950/80 text-slate-400 hover:bg-slate-800'}`}
                            >
                              {plan}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <p className="text-md font-semibold text-slate-100">Quản lý Prompt Trợ lý</p>
                <p className="text-sm text-slate-400 mt-1">Chọn trợ lý, chỉnh prompt riêng và cấu hình điều phối model.</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                <ChevronDown size={16} />
                Trợ lý đang chọn
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-6">
              <div className="space-y-3">
                {assistants.map((assistant) => (
                  <button
                    key={assistant.id}
                    onClick={() => {
                      setSelectedAssistantId(assistant.id);
                      setModelPrompt(assistant.prompt);
                      setPromptUploadName('');
                      setPromptUploadError('');
                    }}
                    className={`w-full rounded-3xl border px-4 py-4 text-left transition ${assistant.id === selectedAssistant.id ? 'border-cyan-500 bg-slate-950 text-slate-100' : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-950'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{assistant.name}</p>
                      {assistant.id === selectedAssistant.id && <CheckCircle size={16} className="text-cyan-400" />}
                    </div>
                    <p className="text-xs text-slate-500">{assistant.description}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950/70 border border-slate-800 rounded-3xl p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">Prompt cho {selectedAssistant.name}</p>
                      <p className="text-xs text-slate-500 mt-1">Prompt này áp dụng riêng cho trợ lý đang chọn. Hỗ trợ nhập text hoặc upload file.</p>
                    </div>
                    <button
                      onClick={saveAssistantPrompt}
                      className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-4 py-2 text-xs font-semibold text-slate-100 hover:bg-cyan-500 transition-colors"
                    >
                      <Save size={14} />
                      Lưu prompt
                    </button>
                  </div>

                  <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-900 p-4">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Tải lên file prompt</label>
                    <input
                      type="file"
                      accept=".txt,.md,text/plain,text/markdown"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setPromptUploadError('');
                        const supported = ['text/plain', 'text/markdown'];
                        if (!supported.includes(file.type) && !file.name.match(/\.(txt|md|markdown)$/i)) {
                          setPromptUploadError('Chỉ hỗ trợ tệp .txt hoặc .md.');
                          return;
                        }
                        if (file.size > 2_000_000) {
                          setPromptUploadError('Tệp quá lớn. Vui lòng chọn tệp dưới 2MB.');
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            setModelPrompt(reader.result);
                            setPromptUploadName(file.name);
                          } else {
                            setPromptUploadError('Không đọc được nội dung tệp.');
                          }
                        };
                        reader.onerror = () => {
                          setPromptUploadError('Không đọc được tệp.');
                        };
                        reader.readAsText(file, 'UTF-8');
                      }}
                      className="mt-3 w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    {promptUploadName && (
                      <div className="mt-3 flex items-center justify-between rounded-2xl bg-slate-950 p-3 text-sm text-slate-200">
                        <span>Tệp đã chọn: {promptUploadName}</span>
                        <button
                          onClick={() => {
                            setPromptUploadName('');
                            setPromptUploadError('');
                          }}
                          className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300 hover:bg-slate-700"
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                    {promptUploadError && <p className="mt-2 text-xs text-rose-400">{promptUploadError}</p>}
                  </div>

                  <textarea
                    rows={10}
                    value={modelPrompt}
                    onChange={(e) => {
                      setModelPrompt(e.target.value);
                      if (promptUploadName) setPromptUploadName('');
                    }}
                    className="mt-4 w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">Model chính</p>
                    <select
                      value={selectedAssistant.primaryModel}
                      onChange={(e) => updateAssistantModel('primaryModel', e.target.value)}
                      className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {models.map((model) => (
                        <option key={model.id} value={model.id}>{model.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">Model dự phòng</p>
                    <select
                      value={selectedAssistant.fallbackModel}
                      onChange={(e) => updateAssistantModel('fallbackModel', e.target.value)}
                      className="w-full rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {models.map((model) => (
                        <option key={model.id} value={model.id}>{model.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
                  <p className="font-semibold text-slate-100 mb-2">Điều phối & Chuyển dự phòng</p>
                  <p className="text-xs leading-5">Model chính xử lý luồng bình thường. Khi độ trễ quá cao hoặc tỷ lệ lỗi vượt ngưỡng, hệ thống sẽ chuyển sang model dự phòng để đảm bảo hoạt động.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-md font-semibold text-slate-100">Tóm tắt chuyển dự phòng</p>
                <p className="text-sm text-slate-500 mt-1">Giám sát các sự kiện chuyển đổi model trong 7 ngày.</p>
              </div>
              <Shield size={24} className="text-cyan-400" />
            </div>
            <div className="space-y-4 text-sm text-slate-400">
              <div className="rounded-3xl bg-slate-950/70 p-4 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-100">Sự kiện chuyển dự phòng (7d)</span>
                  <span className="text-cyan-300">{metrics.failoverEvents}</span>
                </div>
                <p className="text-xs text-slate-500">Số lần hệ thống chuyển sang model dự phòng khi model chính gặp sự cố.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/70 p-4 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-100">Chính sách</span>
                  <span className="text-emerald-300">Tự động chuyển</span>
                </div>
                <p className="text-xs text-slate-500">Model dự phòng chỉ dùng khi độ trễ &gt; 400ms hoặc tỷ lệ lỗi &gt; 1%.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="rounded-2xl bg-slate-950 p-3">
                <ArrowUpRight size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-md font-semibold text-slate-100">Hướng dẫn chọn model</p>
                <p className="text-sm text-slate-500 mt-1">Đề xuất model theo độ phức tạp tác vụ và gói người dùng.</p>
              </div>
            </div>
            <div className="grid gap-3 text-sm text-slate-400">
              <div className="rounded-3xl bg-slate-950/70 p-4 border border-slate-800">
                <p className="font-semibold text-slate-100">Tác vụ nhẹ</p>
                <p className="text-xs text-slate-500 mt-1">DeepSeek V4 Flash phù hợp cho chỉnh sửa, định dạng, và sinh mẫu đơn giản.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/70 p-4 border border-slate-800">
                <p className="font-semibold text-slate-100">Tác vụ trung bình</p>
                <p className="text-xs text-slate-500 mt-1">Claude 3.5 Sonnet phù hợp cho báo cáo, phân tích và văn bản hành chính.</p>
              </div>
              <div className="rounded-3xl bg-slate-950/70 p-4 border border-slate-800">
                <p className="font-semibold text-slate-100">Tác vụ phức tạp</p>
                <p className="text-xs text-slate-500 mt-1">GPT-5.4 Turbo dành cho tổng hợp phức tạp và yêu cầu độ chính xác cao.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
