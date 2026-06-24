import { useState, useRef, lazy, Suspense } from 'react';
import { X, Save, FileText, Download, Send, Pin, Zap,
  ChevronLeft, Sparkles, LayoutGrid, MessageSquare,
  PanelLeftClose, PanelLeftOpen, Bell, Shield
} from 'lucide-react';
import { BillingModal } from './BillingModal';
import { Dashboard } from './Dashboard';
import { useAuth } from '../context/AuthContext';

/* 🚚 CHUYỂN SANG LAZY LOADING VỚI NAMED EXPORT CHUẨN KỸ THUẬT */
const FormComponents: Record<string, React.ComponentType<{ onGenerate: (data: any) => void }>> = {
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
  color: string;        // card accent color class
  iconBg: string;       // icon bg
  borderHover: string;  // hover border color
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
  onGenerated?: (content: string | Record<string, any>, title: string, assistantId?: string) => void;
}

/* ─── Component ─────────────────────────────────────────── */
export function AIWorkspace({ onBack, initialAssistantId, onGenerated }: AIWorkspaceProps) {
  const [activeId, setActiveId] = useState<string | null>(initialAssistantId || null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [docContent, setDocContent] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', content: initialAssistantId ? `Xin chào! Tôi là trợ lý **${ASSISTANTS.find(a => a.id === initialAssistantId)?.title}**. Hãy mô tả yêu cầu của bạn để tôi hỗ trợ soạn thảo.` : 'Xin chào! Chọn một trợ lý để bắt đầu soạn thảo.', timestamp: new Date() },
  ]);
  // const navigate = useNavigate(); // Removed as it's not directly used in this component
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mock user role - trong production sẽ lấy từ authentication
  const { profile, showDashboard, setShowDashboard } = useAuth(); // Lấy profile, showDashboard và setShowDashboard từ AuthContext

  const activeAssistant = ASSISTANTS.find(a => a.id === activeId) ?? null;

  const selectAssistant = (id: string) => {
    setActiveId(id);
    const a = ASSISTANTS.find(x => x.id === id)!;
    setMessages([{
      id: Date.now().toString(),
      sender: 'ai',
      content: `Xin chào! Tôi là trợ lý **${a.title}**. Hãy mô tả yêu cầu của bạn để tôi hỗ trợ soạn thảo.`,
      timestamp: new Date(),
    }]);
    setDocContent('');
  };
  
  const handleFormGenerate = (data: any) => {
    console.log('Generated document data:', data);
    setDocContent(activeId === '4' ? 'Bài phát biểu đang được tạo từ AI...' : 'Văn bản đang được tạo từ AI...');
    if (onGenerated && activeAssistant) {
      onGenerated(data, activeAssistant.title, activeAssistant.id);
    }
  };

  // If admin dashboard is shown, render it
  const sendMessage = () => {
    if (!input.trim()) return;
    const msg: ChatMessage = { id: Date.now().toString(), sender: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, msg]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: 'Đang xử lý yêu cầu của bạn... Vui lòng chờ trong giây lát.',
        timestamp: new Date(),
      }]);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 900);
  };


  // Nếu showDashboard là true, hiển thị Dashboard thay vì AIWorkspace
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


  // Render AIWorkspace nếu showDashboard là false
  return (
    <div className="w-full h-screen flex flex-col bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── TOPBAR ── */}
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
              <button onClick={() => setActiveId(null)} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                <X size={14} />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg"> {/* Hiển thị credit balance */}
            <Zap size={13} className="text-amber-500" />
            <span className="text-xs font-semibold text-amber-700">{profile?.creditBalance || 0} credits</span>
          </div>
          <button // Nút nâng cấp
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
            onClick={() => { // Khi bấm vào avatar
              setShowDashboard(true); // Set showDashboard thành true để hiển thị Dashboard
            }}
            className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-xs font-bold ml-1 hover:opacity-80 transition-opacity"
          >
            {profile?.fullName.charAt(0) || '?'}
          </button> {/* Hiển thị chữ cái đầu tên */}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ── SIDEBAR ── */}
        <aside
          className={`flex-shrink-0 border-r border-gray-100 bg-[#F8F9FB] flex flex-col transition-all duration-200 ${sidebarCollapsed ? 'w-14' : 'w-[260px]'}`}
        >
          {/* Sidebar header */}
          <div className={`h-12 flex items-center border-b border-gray-100 flex-shrink-0 ${sidebarCollapsed ? 'justify-center px-0' : 'justify-between px-4'}`}>
            {!sidebarCollapsed && <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trợ lý AI</span>}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors"
            >
              {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto py-2">
            {ASSISTANTS.map(a => {
              const isActive = activeId === a.id;
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
                  {/* active left bar */}
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
          {/* Sidebar footer */}
          {!sidebarCollapsed && (
            <div className="p-3 border-t border-gray-100">
              <div className="bg-[#1E3A8A]/5 border border-[#1E3A8A]/10 rounded-xl p-3"> {/* Hiển thị credit balance */}
                <p className="text-[11px] font-semibold text-[#1E3A8A] mb-1">Gói Chuyên nghiệp</p>
                <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1.5">
                  <span>{profile?.creditBalance || 0} / {profile?.packageType === 'PROFESSIONAL' ? 300 : 0} credits</span> {/* Cần logic để lấy max credits */}
                  <span>78%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full">
                  <div className="h-full bg-[#1E3A8A] rounded-full w-[78%]" />
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 min-w-0 overflow-hidden flex flex-col">

          {/* === EMPTY STATE (no assistant selected) === */}
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

          {/* === WORKSPACE VIEW (assistant selected) === */}
          {activeAssistant && (
            <div className="flex flex-1 overflow-hidden">
              {activeId && activeId !== '10' && FormComponents[activeId] ? (
                <Suspense 
                  fallback={
                    <div className="flex-1 flex items-center justify-center bg-slate-50">
                      <div className="text-center">
                        <div className="inline-block animate-spin mb-3">
                          <Sparkles size={24} className="text-slate-400" />
                        </div>
                        <p className="text-xs text-slate-400">Đang nạp {activeAssistant.title}...</p>
                      </div>
                    </div>
                  }
                >
                  {(() => {
                    const SelectedForm = FormComponents[activeId];
                    return SelectedForm ? <SelectedForm onGenerate={handleFormGenerate} /> : null;
                  })()}
                </Suspense>
              ) : (
                <>
                  {/* Editor panel (ChatPro ID 10) */}
                  <div className="flex-[6] flex flex-col border-r border-gray-100">
                    {/* Toolbar */}
                    <div className="h-12 px-4 flex items-center gap-2 border-b border-gray-100 bg-white flex-shrink-0">
                      <button
                        onClick={() => setActiveId(null)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mr-1"
                      >
                        <LayoutGrid size={13} />
                        Tất cả trợ lý
                      </button>
                      <div className="h-4 w-px bg-gray-200" />
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A8A] text-white rounded-lg text-xs font-medium hover:bg-blue-800 transition-colors">
                        <Save size={13} />
                        Lưu
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                        <FileText size={13} />
                        Word
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                        <Download size={13} />
                        PDF
                      </button>
                    </div>

                    {/* Editor */}
                    <div className="flex-1 overflow-y-auto bg-white">
                      <div className="w-full h-full px-8 py-6 flex flex-col">
                        <div className="text-xs text-gray-300 mb-4 flex items-center gap-2 flex-shrink-0">
                          <span className="text-base">{activeAssistant.emoji}</span>
                          <span className="font-semibold text-[#1E3A8A]">{activeAssistant.title}</span>
                        </div>
                        <textarea
                          value={docContent}
                          onChange={e => setDocContent(e.target.value)}
                          placeholder="Bắt đầu soạn thảo văn bản của bạn tại đây, hoặc yêu cầu AI tạo nội dung qua cửa sổ chat bên phải..."
                          className="w-full flex-1 resize-none focus:outline-none text-[15px] leading-[1.8] text-[#1F2937]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Chat panel */}
                  <div className="flex-[4] flex flex-col bg-white min-w-0">
                    {/* Chat header */}
                    <div className="h-12 px-4 flex items-center gap-2 border-b border-gray-100 bg-[#F8F9FB] flex-shrink-0">
                      <MessageSquare size={15} className="text-[#1E3A8A]" />
                      <span className="text-sm font-semibold text-[#1F2937]">Trợ lý {activeAssistant.title}</span>
                      <span className="ml-auto flex items-center gap-1 text-[10px] text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                        Đang hoạt động
                      </span>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                      {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {msg.sender === 'ai' && (
                            <div className="w-7 h-7 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white flex-shrink-0 mr-2 mt-0.5">
                              <Sparkles size={12} />
                            </div>
                          )}
                          <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 ${
                            msg.sender === 'user'
                              ? 'bg-[#1E3A8A] text-white rounded-br-sm'
                              : 'bg-gray-100 text-[#1F2937] rounded-bl-sm'
                          }`}>
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                              {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat input */}
                    <div className="px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0 space-y-2">
                      <button
                        onClick={() => alert('Đã ghim văn bản vào cuộc hội thoại')}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Pin size={12} />
                        Ghim văn bản hiện tại vào chat
                      </button>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                          placeholder="Nhập yêu cầu hoặc câu hỏi..."
                          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/20 focus:border-[#1E3A8A] text-[#1F2937]"
                        />
                        <button
                          onClick={sendMessage}
                          className="w-9 h-9 flex items-center justify-center bg-[#1E3A8A] text-white rounded-xl hover:bg-blue-800 transition-colors flex-shrink-0"
                        >
                          <Send size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <BillingModal isOpen={isBillingOpen} onClose={() => setIsBillingOpen(false)} />
    </div>
  );
}
