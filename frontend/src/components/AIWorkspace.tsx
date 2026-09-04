import { useState, useRef, lazy, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Save, FileText, Download, Send, Pin, Zap,
  ChevronLeft, Sparkles, LayoutGrid, MessageSquare,
  PanelLeftClose, PanelLeftOpen, Bell, Shield
} from 'lucide-react';
import { BillingModal } from './BillingModal';
import { Dashboard } from './Dashboard';
import { useAuth } from '../context/AuthContext';

import api from '../api';
import { sessionApi } from '../api/sessionAPi';

type AssistantFormProps = {
  onGenerate: (data: any) => void;
  activeSessionUuid?: string | null;
  sessionStatus?: string;
  onSessionStatusChange?: (status: string) => void;
};

const FormComponents: Record<string, React.ComponentType<AssistantFormProps>> = {
  '1': lazy(() => import('../features/wizard/VanKienDangForm').then(m => ({ default: m.VanKienDangForm }))),
  '2': lazy(() => import('../features/wizard/VanBanNhaNuocForm').then(m => ({ default: m.VanBanNhaNuocForm }))),
  '3': lazy(() => import('../features/wizard/QuanLyGiaoDucForm').then(m => ({ default: m.QuanLyGiaoDucForm }))),
  '4': lazy(() => import('../features/wizard/BienTapPhatBieuForm').then(m => ({ default: m.BienTapPhatBieuForm }))),
  '5': lazy(() => import('../features/wizard/RutGonKiemTraForm').then(m => ({ default: m.RutGonKiemTraForm }))),
  '6': lazy(() => import('../features/wizard/SoanGiaoAnForm').then(m => ({ default: m.SoanGiaoAnForm }))),
  '7': lazy(() => import('../features/wizard/MaTranDeThiForm').then(m => ({ default: m.MaTranDeThiForm }))),
  '8': lazy(() => import('../features/wizard/ChamDanhGiaForm').then(m => ({ default: m.ChamDanhGiaForm }))),
  '9': lazy(() => import('../features/wizard/BaoCaoThanhTichForm').then(m => ({ default: m.BaoCaoThanhTichForm }))),
};

interface Assistant {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  tags: string[];
  color: string;
  iconBg: string;
  borderHover: string;
}

interface ChatSession {
  sessionUuid?: string;
  sessionId?: number;
  tagId?: string;
  sessionName?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
}

const ASSISTANTS: Assistant[] = [
  {
    id: '1',
    emoji: '🏛️',
    title: 'Văn kiện Đảng',
    subtitle: 'Soạn thảo văn bản cơ quan Đảng chuyên nghiệp',
    tags: ['Tỉnh ủy', 'Đảng ủy', 'Chi bộ', 'Tuyên giáo', 'Tổ chức', 'Kiểm tra'],
    color: 'text-red-700',
    iconBg: 'bg-red-50 border-red-100',
    borderHover: 'hover:border-red-300',
  },
  {
    id: '2',
    emoji: '🏢',
    title: 'Văn bản Nhà nước',
    subtitle: 'Văn bản hành chính theo quy định pháp luật',
    tags: ['UBND', 'HĐND', 'MTTQ', 'Công đoàn', 'Đoàn TN', 'Hội PN'],
    color: 'text-blue-700',
    iconBg: 'bg-blue-50 border-blue-100',
    borderHover: 'hover:border-blue-300',
  },
  {
    id: '3',
    emoji: '🎓',
    title: 'Quản lý Giáo dục',
    subtitle: 'Văn bản quản lý ngành giáo dục & nhà trường',
    tags: ['Sở GD&ĐT', 'Nhà trường', 'Tổ CM', 'Hồ sơ GVCN', 'Công tác Đội'],
    color: 'text-emerald-700',
    iconBg: 'bg-emerald-50 border-emerald-100',
    borderHover: 'hover:border-emerald-300',
  },
  {
    id: '4',
    emoji: '📚',
    title: 'Biên tập & Phát biểu',
    subtitle: 'Soạn bài phát biểu lãnh đạo các cấp',
    tags: ['Phát biểu khai mạc', 'Tổng kết', 'Chào mừng', 'Bế mạc'],
    color: 'text-violet-700',
    iconBg: 'bg-violet-50 border-violet-100',
    borderHover: 'hover:border-violet-300',
  },
  {
    id: '5',
    emoji: '🔍',
    title: 'Rút gọn & Kiểm tra',
    subtitle: 'Rút gọn & chuẩn hóa thể thức văn bản Đảng',
    tags: ['Rút gọn ND', 'Kiểm tra thể thức', 'Lỗi chính tả', 'Chuẩn hóa'],
    color: 'text-orange-700',
    iconBg: 'bg-orange-50 border-orange-100',
    borderHover: 'hover:border-orange-300',
  },
  {
    id: '6',
    emoji: '📖',
    title: 'Soạn Giáo án',
    subtitle: 'Giáo án chuẩn CTGDPT 2018 đầy đủ các cấp',
    tags: ['Tiểu học', 'THCS', 'THPT', 'GDTX', 'Kỹ năng sống'],
    color: 'text-sky-700',
    iconBg: 'bg-sky-50 border-sky-100',
    borderHover: 'hover:border-sky-300',
  },
  {
    id: '7',
    emoji: '📝',
    title: 'Ma trận & Đề thi',
    subtitle: 'Tạo ma trận, đề kiểm tra tự động theo chuẩn',
    tags: ['Ma trận đề', 'Đề kiểm tra', 'Luyện thi 10', 'Luyện thi THPT'],
    color: 'text-indigo-700',
    iconBg: 'bg-indigo-50 border-indigo-100',
    borderHover: 'hover:border-indigo-300',
  },
  {
    id: '8',
    emoji: '📊',
    title: 'Chấm & Đánh giá',
    subtitle: 'Chấm bài và phân tích năng lực học sinh',
    tags: ['Chấm bài tự luận', 'Rubric', 'Phân tích NL', 'Nhận xét HS'],
    color: 'text-pink-700',
    iconBg: 'bg-pink-50 border-pink-100',
    borderHover: 'hover:border-pink-300',
  },
  {
    id: '9',
    emoji: '🏆',
    title: 'Báo cáo Thành tích',
    subtitle: 'Đánh giá công chức, sáng kiến kinh nghiệm',
    tags: ['Đánh giá CC', 'Đánh giá ĐV', 'SKKN', 'Thi đua khen thưởng'],
    color: 'text-amber-700',
    iconBg: 'bg-amber-50 border-amber-100',
    borderHover: 'hover:border-amber-300',
  },
  {
    id: '10',
    emoji: '⚡',
    title: 'ChatPro Toàn năng',
    subtitle: 'Cửa sổ chat đa model AI mạnh nhất',
    tags: ['DeepSeek', 'GPT-4o', 'Claude', 'Gemini'],
    color: 'text-cyan-700',
    iconBg: 'bg-cyan-50 border-cyan-100',
    borderHover: 'hover:border-cyan-300',
  },
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIWorkspaceProps {
  onBack?: () => void;
  initialAssistantId?: string | null;
  initialSessionUuid?: string | null;
  onGenerated?: (content: string | Record<string, any>, title: string, assistantId?: string) => void;
}

export function AIWorkspace({
  onBack,
  initialAssistantId,
  initialSessionUuid,
  onGenerated
}: AIWorkspaceProps) {
  const navigate = useNavigate();

  const [selectedAssistantId, setSelectedAssistantId] = useState<string | null>(initialAssistantId || null);
  const [activeSessionUuid, setActiveSessionUuid] = useState<string | null>(initialSessionUuid || null);
  const [sessionHistory, setSessionHistory] = useState<ChatSession[]>([]);
  const [editingSessionUuid, setEditingSessionUuid] = useState<string | null>(null);
  const [editingSessionNameValue, setEditingSessionNameValue] = useState<string>('');

  const startEditSessionName = (sessionUuid: string, currentName?: string) => {
    setEditingSessionUuid(sessionUuid);
    setEditingSessionNameValue(currentName ?? '');
  };

  const cancelEditSessionName = () => {
    setEditingSessionUuid(null);
    setEditingSessionNameValue('');
  };

  const saveSessionName = async (sessionUuid: string) => {
    try {
      const resp = await sessionApi.updateSessionName(sessionUuid, editingSessionNameValue);
      const updated = resp?.data ?? resp;
      const returnedName = updated?.sessionName ?? editingSessionNameValue;

      setSessionHistory(prev =>
        prev.map(s => (String(s.sessionUuid) === String(sessionUuid) ? { ...s, sessionName: returnedName } : s))
      );

      // if we are currently inside a wizard for this session, propagate name (optional)
      if (activeSessionUuid && String(activeSessionUuid) === String(sessionUuid)) {
        setSessionStatus(prev => prev); // keep existing behavior; parent forms read session via getDraft
      }

      setEditingSessionUuid(null);
      setEditingSessionNameValue('');
    } catch (err) {
      console.error('Update session name failed', err);
      alert('Không đổi tên được phiên. Kiểm tra kết nối tới server.');
    }
  };


  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [docContent, setDocContent] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', content: initialAssistantId ? `Xin chào! Tôi là trợ lý **${ASSISTANTS.find(a => a.id === initialAssistantId)?.title}**. Hãy mô tả yêu cầu của bạn để tôi hỗ trợ soạn thảo.` : 'Xin chào! Chọn một trợ lý để bắt đầu soạn thảo.', timestamp: new Date() },
  ]);

  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { profile, showDashboard, setShowDashboard } = useAuth();
  const activeAssistant = ASSISTANTS.find(a => a.id === selectedAssistantId) ?? null;

  const [sessionStatus, setSessionStatus] = useState<string>('EDITING');

  const selectAssistant = async (assistantId: string) => {
    setSelectedAssistantId(assistantId);
    setActiveSessionUuid(null);
    setMessages([]);

    try {
      const res = await sessionApi.getSessions(assistantId);
      setSessionHistory(res.data);
    } catch (error) {
      console.error('Không tải được lịch sử phiên:', error);
      setSessionHistory([]);
    }
  };

  const loadSessionHistory = async (assistantId: string) => {
    try {
      const sessions = await api.sessionApi.getSessions(assistantId);
      setSessionHistory(sessions.data);
    } catch (error) {
      console.error('Không tải được lịch sử phiên:', error);
      setSessionHistory([]);
    }
  };

  useEffect(() => {
    if (selectedAssistantId) {
      loadSessionHistory(selectedAssistantId);
    }
  }, [selectedAssistantId]);

  const getSessionUuid = (session?: Partial<ChatSession> | null) =>
    session?.sessionUuid ?? '';

  const createSession = async () => {
    if (!selectedAssistantId) return;

    try {
      const response = await api.sessionApi.createSession(selectedAssistantId, 'Phiên mới');
      const payload = response?.data ?? response;
      const sessionUuid = String(payload?.sessionUuid ?? '');

      if (!sessionUuid) {
        throw new Error('API createSession không trả về sessionUuid');
      }

      setActiveSessionUuid(sessionUuid);
      setSessionHistory(prev => [
        {
          ...payload,
          sessionUuid,
        },
        ...prev,
      ]);

      setMessages([]);
      setDocContent('');

      navigate(`/wizard/${selectedAssistantId}/${sessionUuid}`);
    } catch (error) {
      console.error('Không tạo được session:', error);
    }
  };

  // Select a session and navigate to its URL
  const selectSession = async (sessionUuid: string) => {
    if (!sessionUuid) return;

    setActiveSessionUuid(sessionUuid);
    setMessages([]);

    const nextUrl = `/wizard/${selectedAssistantId}/${sessionUuid}`;
    navigate(nextUrl);

    try {
      const draft = await api.sessionApi.getDraft(sessionUuid);
      const status = String(draft?.status || 'DRAFT').toUpperCase();
      setSessionStatus(status);
    } catch (error) {
      console.error('Không tải được draft:', error);
    }
  };

  // Sync active session UUID with initial session UUID when it changes
  useEffect(() => {
    if (initialSessionUuid) {
      setActiveSessionUuid(initialSessionUuid);
    }
  }, [initialSessionUuid]);

  const handleDeleteSession = async (sessionUuid: string) => {
    if (!sessionUuid) return;

    try {
      await api.sessionApi.deleteSession(sessionUuid);

      setSessionHistory(prev =>
        prev.filter(session => getSessionUuid(session) !== sessionUuid)
      );

      if (String(activeSessionUuid) === sessionUuid) {
        setActiveSessionUuid(null);
        setMessages([]);
        setDocContent('');
      }
    } catch (error) {
      console.error('Không xóa được session:', error);
    }
  };

  const handleFormGenerate = (data: any) => {
    console.log('Generated document data:', data);
    setDocContent(selectedAssistantId === '4' ? 'Bài phát biểu đang được tạo từ AI...' : 'Văn bản đang được tạo từ AI...');
    if (onGenerated && activeAssistant) {
      onGenerated(data, activeAssistant.title, activeAssistant.id);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeSessionUuid) return;

    const content = input.trim();
    setInput('');

    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'user',
        content,
        timestamp: new Date()
      }
    ]);

    try {
      const res = await api.sessionApi.createSessionMessages(
        activeSessionUuid,
        content
      );

      setMessages(prev => [
        ...prev,
        res.data
      ]);
    } catch (error) {
      console.error('Gửi message thất bại:', error);
    }
  };

  if (showDashboard) {
    return (
      <div className="max-w-[1280px] mx-auto px-8 py-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Quản lý cá nhân</h2>
            <button onClick={() => setShowDashboard(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400">
              <X size={16} />
            </button>
          </div>
          <Dashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 flex-shrink-0 shadow-sm z-30">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1E3A8A] rounded-lg flex items-center justify-center shadow-md">
              <Sparkles size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-semibold" style={{ color: '#1F2937' }}>
              Trợ lý Văn phòng AI
            </h1>
          </button>
          {activeAssistant && (
            <>
              <span className="text-gray-300 text-lg">/</span>
              <span className="text-sm text-[#1E3A8A] font-semibold">{activeAssistant.emoji} {activeAssistant.title}</span>
              <button onClick={() => setSelectedAssistantId(null)} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                <X size={14} />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg">
            <Zap size={13} className="text-amber-500" />
            <span className="text-xs font-semibold text-amber-700">{profile?.creditBalance || 0} credits</span>
          </div>
          <button
            onClick={() => setIsBillingOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-800 transition-colors text-xs font-semibold shadow-sm"
          >
            <Zap size={13} />
            Nâng cấp
          </button>
          <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
          <button
            onClick={() => setShowDashboard(true)}
            className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-xs font-bold ml-1 hover:opacity-80 transition-opacity"
          >
            {profile?.fullName.charAt(0) || '?'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`flex-shrink-0 border-r border-gray-100 bg-[#F8F9FB] flex flex-col transition-all duration-200 ${sidebarCollapsed ? 'w-14' : 'w-[260px]'}`}
        >
          <div className={`h-12 flex items-center border-b border-gray-100 flex-shrink-0 ${sidebarCollapsed ? 'justify-center px-0' : 'justify-between px-4'}`}>
            {!sidebarCollapsed && <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trợ lý AI</span>}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors"
            >
              {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-2">
            {ASSISTANTS.map(a => {
              const isActive = selectedAssistantId === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => selectAssistant(a.id)}
                  title={sidebarCollapsed ? a.title : undefined}
                  className={`w-full flex items-center gap-3 transition-all relative text-left
                    ${sidebarCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-2.5'}
                    ${isActive
                      ? 'bg-blue-50 text-[#1E3A8A]'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  {isActive && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#1E3A8A] rounded-r-full" />}
                  <span className="text-base flex-shrink-0">{a.emoji}</span>
                  {!sidebarCollapsed && (
                    <div className="min-w-0">
                      <span className={`block text-sm leading-tight truncate ${isActive ? 'font-semibold text-[#1E3A8A]' : 'font-medium'}`}>
                        {a.title}
                      </span>
                      {!isActive && (
                        <span className="block text-[11px] text-gray-400 truncate mt-0.5">{a.tags.slice(0, 3).join(', ')}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {!sidebarCollapsed && (
            <div className="p-3 border-t border-gray-100">
              <div className="bg-[#1E3A8A]/5 border border-[#1E3A8A]/10 rounded-xl p-3">
                <p className="text-[11px] font-semibold text-[#1E3A8A] mb-1">Gói Chuyên nghiệp</p>
                <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1.5">
                  <span>{profile?.creditBalance || 0} / {profile?.packageType === 'PROFESSIONAL' ? 300 : 0} credits</span>
                  <span>78%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full">
                  <div className="h-full bg-[#1E3A8A] rounded-full w-[78%]" />
                </div>
              </div>
            </div>
          )}
        </aside>

        <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
          {!activeAssistant && (
            <div className="flex-1 flex items-center justify-center bg-gray-50/40">
              <div className="text-center max-w-md px-8">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <LayoutGrid size={36} className="text-[#1E3A8A]" />
                </div>
                <h2 className="text-xl font-bold text-[#1F2937] mb-3">Chọn một trợ lý để bắt đầu</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Chọn một trợ lý AI từ danh sách bên trái để bắt đầu soạn thảo văn bản.
                  Mỗi trợ lý được huấn luyện chuyên sâu cho từng nghiệp vụ cụ thể.
                </p>
                {onBack && (
                  <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
                  >
                    <ChevronLeft size={16} />
                    Quay về trang chủ
                  </button>
                )}
              </div>
            </div>
          )}

          {activeAssistant && !activeSessionUuid ? (
            <div className="flex flex-1 overflow-hidden">
              <div className="w-80 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
                <button
                  onClick={createSession}
                  className="w-full rounded-xl bg-[#1E3A8A] text-white py-3 mb-4 hover:bg-[#172F70] transition"
                >
                  + Tạo session mới
                </button>

                <div className="mb-3 text-sm font-semibold text-gray-700">
                  Lịch sử phiên
                </div>

                <div className="space-y-3">
                  {sessionHistory.length === 0 ? (
                    <div className="text-sm text-gray-500">
                      Chưa có phiên nào.
                    </div>
                  ) : (
                    sessionHistory.map((session) => {
                      const sessionUuid = getSessionUuid(session);

                      return (
                            <div key={sessionUuid || `session-${Math.random()}`} className="flex items-center gap-2">
                              <button
                                onClick={() => selectSession(sessionUuid)}
                                className="flex-1 text-left rounded-2xl p-3 bg-white border border-gray-200 hover:border-[#1E3A8A] transition"
                              >
                                <div>{session.sessionName || session.tagId || 'Phiên mới'}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {session.updatedAt || session.createdAt}
                                </div>
                              </button>

                              {editingSessionUuid === sessionUuid ? (
                                  <div className="flex flex-col items-end w-48">
                                    <input
                                      value={editingSessionNameValue}
                                      onChange={e => setEditingSessionNameValue(e.target.value)}
                                      className="px-2 py-1 border rounded text-sm w-full"
                                    />
                                    <div className="flex gap-2 mt-2">
                                      <button onClick={() => saveSessionName(sessionUuid)} className="px-3 py-1 bg-blue-600 text-white rounded text-xs">Lưu</button>
                                      <button onClick={cancelEditSessionName} className="px-3 py-1 text-xs text-gray-600">Hủy</button>
                                    </div>
                                  </div>
                                ) : (
                                <>
                                  <button
                                    onClick={() => startEditSessionName(sessionUuid, session.sessionName)}
                                    className="px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-50"
                                    title="Sửa tên"
                                  >
                                    ✎
                                  </button>

                                  <button
                                    onClick={() => handleDeleteSession(sessionUuid)}
                                    className="px-3 py-2 rounded-xl text-red-500 hover:bg-red-50"
                                    title="Xóa session"
                                  >
                                    🗑
                                  </button>
                                </>
                              )}
                            </div>
                          );
                    })
                  )}
                </div>
              </div>

              <div className="flex-1 p-6">
                <div className="h-full rounded-3xl border border-gray-200 bg-white flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <h2 className="font-semibold text-lg mb-3">
                      Chọn hoặc tạo một phiên
                    </h2>

                    <p className="text-sm text-gray-500">
                      Hãy chọn một phiên trong lịch sử hoặc tạo phiên mới
                      để bắt đầu làm việc với trợ lý.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : activeAssistant && activeSessionUuid ? (
            <div className="flex flex-1 min-w-0 overflow-hidden bg-white">
              <div className="w-full min-w-0 overflow-y-auto">
                <Suspense fallback={<div className="p-6 text-sm text-gray-500">Đang tải form...</div>}>
                  {selectedAssistantId && FormComponents[selectedAssistantId] ? (
                    (() => {
                      const ActiveForm = FormComponents[selectedAssistantId];
                      return <ActiveForm
                        activeSessionUuid={activeSessionUuid}
                        onGenerate={handleFormGenerate}
                        sessionStatus={sessionStatus}
                        onSessionStatusChange={setSessionStatus}
                        onClose={() => setActiveSessionUuid(null)}
                      />;
                    })()
                  ) : null}
                </Suspense>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <BillingModal isOpen={isBillingOpen} onClose={() => setIsBillingOpen(false)} />
    </div>
  );
}