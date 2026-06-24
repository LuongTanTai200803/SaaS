import React, { useState, useRef, useEffect } from 'react';
import {
  Save, Download, FileText, MessageSquare, Send, Paperclip,
  Mic, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Table, ChevronDown, Copy, Check, X, Keyboard
} from 'lucide-react';
import api from '../api'; // Import đối tượng 'api' tổng hợp

// 🔌 Nạp hệ thống co giãn từ thư mục UI có sẵn của bạn
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

interface DocumentWorkspaceProps {
  initialContent?: string | Record<string, any>;
  documentTitle?: string;
  onBack?: () => void;
  sessionId?: string;
  assistantId?: string;
  assistantType?: string;
}

interface AssistantConfig {
  title: string;
  badge: string;
  description: string;
  emoji: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  quickActions: string[];
}

const ASSISTANT_CONFIGS: Record<string, AssistantConfig> = {
  '1': {
    title: 'Văn kiện Đảng',
    badge: 'Trợ lý Văn kiện Đảng',
    description: 'Chuẩn hóa văn phong Đảng và nghị quyết chuyên nghiệp.',
    emoji: '🏛️',
    colorClass: 'text-red-700',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-100',
    quickActions: ['Bạn muốn viết đầy đủ / chi tiết? ', 'Phần / Mục nào cần tập trung?', 'Nội dung nào cần nhấn mạnh?'],
  },
  '2': {
    title: 'Văn bản Nhà nước',
    badge: 'Trợ lý Văn bản Nhà nước',
    description: 'Soạn thảo công văn, quyết định và thông tư theo quy định pháp luật.',
    emoji: '🏢',
    colorClass: 'text-blue-700',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-100',
    quickActions: ['Căn cứ pháp lý', 'Định dạng văn bản hành chính', 'Tăng độ chính xác thể thức'],
  },
  '3': {
    title: 'Quản lý Giáo dục',
    badge: 'Trợ lý Quản lý Giáo dục',
    description: 'Xây dựng văn bản quản lý ngành và nhà trường.',
    emoji: '🎓',
    colorClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-100',
    quickActions: ['Gợi ý hoạt động lớp học', 'Xây dựng mục tiêu bài học', 'Chuẩn hóa nội dung giáo dục'],
  },
  '4': {
    title: 'Biên tập & Phát biểu',
    badge: 'Trợ lý Biên tập & Phát biểu',
    description: 'Soạn bài phát biểu lãnh đạo và thông cáo hội nghị.',
    emoji: '📚',
    colorClass: 'text-violet-700',
    bgClass: 'bg-violet-50',
    borderClass: 'border-violet-100',
    quickActions: ['Soạn phần mở đầu ấn tượng', 'Củng cố luận điểm chính', 'Tăng tính trang trọng'],
  },
  '5': {
    title: 'Rút gọn & Kiểm tra',
    badge: 'Trợ lý Rút gọn & Kiểm tra',
    description: 'Rút gọn nội dung và kiểm tra thể thức văn bản.',
    emoji: '🔍',
    colorClass: 'text-orange-700',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-100',
    quickActions: ['Rút gọn nội dung nhanh', 'Kiểm tra thể thức văn bản', 'Chuẩn hóa ngôn ngữ hành chính'],
  },
  '6': {
    title: 'Soạn Giáo án',
    badge: 'Trợ lý Soạn Giáo án',
    description: 'Tạo giáo án theo chương trình giáo dục quốc gia.',
    emoji: '📖',
    colorClass: 'text-sky-700',
    bgClass: 'bg-sky-50',
    borderClass: 'border-sky-100',
    quickActions: ['Gợi ý hoạt động lớp', 'Xây dựng mục tiêu học tập', 'Phân bổ thời gian tiết học'],
  },
  '7': {
    title: 'Ma trận & Đề thi',
    badge: 'Trợ lý Ma trận & Đề thi',
    description: 'Sinh ma trận đề thi và đề kiểm tra theo chuẩn.',
    emoji: '📝',
    colorClass: 'text-indigo-700',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-100',
    quickActions: ['Tạo ma trận đề thi', 'Sinh đề kiểm tra', 'Phân loại câu hỏi'],
  },
  '8': {
    title: 'Chấm & Đánh giá',
    badge: 'Trợ lý Chấm & Đánh giá',
    description: 'Phân tích kết quả và viết nhận xét học sinh.',
    emoji: '📊',
    colorClass: 'text-pink-700',
    bgClass: 'bg-pink-50',
    borderClass: 'border-pink-100',
    quickActions: ['Phân tích kết quả chấm', 'Viết nhận xét học sinh', 'Tổng hợp năng lực học tập'],
  },
  '9': {
    title: 'Báo cáo Thành tích',
    badge: 'Trợ lý Báo cáo Thành tích',
    description: 'Soạn báo cáo thành tích và đề xuất khen thưởng.',
    emoji: '🏆',
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-100',
    quickActions: ['Tổng hợp thành tích', 'Soạn đề xuất khen thưởng', 'Viết kết luận ấn tượng'],
  },
};

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function DocumentWorkspace({
  initialContent = '',
  documentTitle = 'Báo cáo sơ kết công tác Đảng bộ',
  onBack,
  sessionId,
  assistantId,
  assistantType,
}: DocumentWorkspaceProps) {
  const buildInitialContent = (content: string | Record<string, any>) => {
    if (!content) return '';
    if (typeof content === 'string') return content;
    if (typeof content.content === 'string' && content.content.trim()) return content.content;
    if (typeof content.documentHtml === 'string' && content.documentHtml.trim()) return content.documentHtml;

    const title = content.tenVanBan || content.loaiVanBan || content.title || 'THÔNG BÁO';
    const soKyHieu = content.soKyHieu || '01/TB-XXX';
    const coQuanBanHanh = content.coQuanBanHanh || '[CƠ QUAN BAN HÀNH]';
    const diaDanh = content.diaDanh || '[Địa danh]';
    const ngayBanHanh = content.ngayBanHanh ? new Date(content.ngayBanHanh) : new Date();
    const day = ngayBanHanh.getDate();
    const month = ngayBanHanh.getMonth() + 1;
    const year = ngayBanHanh.getFullYear();
    const noiNhan = content.noiNhan || content.noiNhanBaoCao || '[CHỨC VỤ]';
    const noiDungChinh = content.noiDungChinh || content.content || 'AI có thể mắc sai sót. Hãy kiểm tra lại thông tin quan trọng.';
    const nguoiKy = content.nguoiKy || '[Họ và tên]';

    return `
      <div style="text-align: center; margin-bottom: 18px;">
        <div style="font-size: 11pt; font-weight: bold; margin-bottom: 6px;">${coQuanBanHanh}</div>
        <div style="font-size: 12pt; font-weight: bold; margin-bottom: 4px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
        <div style="font-size: 11pt; margin-bottom: 4px;">Độc lập - Tự do - Hạnh phúc</div>
        <div style="font-size: 10pt; color: #444; margin-bottom: 12px;">${diaDanh}, ngày ${day} tháng ${month} năm ${year}</div>
      </div>
      <div style="margin-bottom: 16px;">
        <div style="font-size: 11pt; font-weight: 600;">Số: ${soKyHieu}</div>
      </div>
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="font-size: 14pt; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">${title}</div>
        <div style="font-size: 12pt;">Về việc ${content.tenVanBan || content.title || '___________'}</div>
      </div>
      <div style="margin-bottom: 20px;">
        <div style="font-size: 10.5pt; font-weight: 600; margin-bottom: 4px;">Nơi nhận:</div>
        <div style="margin-left: 18px; font-size: 10.5pt;">${noiNhan}</div>
      </div>
      <div style="margin-bottom: 24px; font-size: 10.5pt; color: #444; line-height: 1.7; white-space: pre-wrap;">
        ${noiDungChinh}
      </div>
      <div style="margin-top: 48px; text-align: right; font-size: 10.5pt; font-weight: 600;">
        ${nguoiKy}
      </div>
    `;
  };

  const initialContentString = buildInitialContent(initialContent);
  const documentContentRef = useRef<string>(initialContentString);
  const editorRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isUpdatingFromAI = useRef<boolean>(false); // Flag để phân biệt update từ AI vs user typing

  const activeAssistantId = assistantId || assistantType || undefined;
  const assistantConfig = activeAssistantId
    ? ASSISTANT_CONFIGS[activeAssistantId] ?? Object.values(ASSISTANT_CONFIGS).find(
        (assistant) => assistant.title === activeAssistantId || assistant.badge === activeAssistantId
      )
    : undefined;
  const workspaceTitle = assistantConfig ? `Trợ lý ${assistantConfig.title}` : 'Trợ lý Văn phòng AI';
  const quickActions = assistantConfig?.quickActions || [];

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '✨ Văn bản đã được tạo thành công! Bạn có thể chỉnh sửa trực tiếp trên canvas bên trái hoặc yêu cầu AI tinh chỉnh nội dung.',
      timestamp: new Date(),
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [contextPinned, setContextPinned] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (sessionId) {
      const fetchChatHistory = async () => {
        try {
          const data: any = await api.aiApi.getChatHistory(sessionId); // Sử dụng api.aiApi
          const historyData = data.messages || data.content || data;
          if (Array.isArray(historyData) && historyData.length > 0) {
            setChatMessages(historyData.map((msg: any) => ({
              id: msg.id?.toString() || Math.random().toString(),
              role: (msg.role === 'AI' || msg.role === 'assistant') ? 'assistant' : 'user',
              content: msg.content || '',
              timestamp: new Date(msg.createdAt || msg.timestamp || Date.now())
            })));
          }
        } catch (error) {
          console.error('Không thể tải lịch sử phiên chat:', error);
        }
      };
      fetchChatHistory();
    }
  }, [sessionId]);

  const handleContentChange = () => {
    if (editorRef.current && !isUpdatingFromAI.current) {
      documentContentRef.current = editorRef.current.innerHTML;
    }
  };

  const defaultDocumentContent = `
    <div style="text-align: center; margin-bottom: 18px;">
      <div style="font-size: 11pt; font-weight: bold; margin-bottom: 6px;">[CƠ QUAN BAN HÀNH]</div>
      <div style="font-size: 12pt; font-weight: bold; margin-bottom: 4px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
      <div style="font-size: 11pt; margin-bottom: 4px;">Độc lập - Tự do - Hạnh phúc</div>
      <div style="font-size: 10pt; color: #444; margin-bottom: 12px;">[Địa danh, ngày 18 tháng 6 năm 2026]</div>
    </div>
    <div style="margin-bottom: 16px;">
      <div style="font-size: 11pt; font-weight: 600;">Số: 01/TB-XXX</div>
    </div>
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="font-size: 14pt; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px;">THÔNG BÁO</h1>
      <div style="font-size: 12pt;">Về việc ___________</div>
    </div>
    <div style="margin-bottom: 20px;">
      <div style="font-size: 10.5pt; font-weight: 600; margin-bottom: 4px;">Nơi nhận:</div>
      <div style="margin-left: 18px; font-size: 10.5pt;">[CHỨC VỤ]</div>
    </div>
    <div style="margin-bottom: 24px; font-size: 10.5pt; color: #444; line-height: 1.7;">
      AI có thể mắc sai sót. Hãy kiểm tra lại thông tin quan trọng.
    </div>
    <div style="margin-top: 48px; text-align: right; font-size: 10.5pt; font-weight: 600;">
      [Họ và tên]
    </div>
  `;

  useEffect(() => {
    if (editorRef.current) {
      const contentToRender = initialContentString || defaultDocumentContent;
      editorRef.current.innerHTML = contentToRender;
      documentContentRef.current = contentToRender;
    }
  }, [initialContentString]);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    console.log('Saving content:', documentContentRef.current);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsSending(true);

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Tôi đã ghi nhận yêu cầu tinh chỉnh của bạn. Đang tiến hành đồng bộ hóa cấu trúc văn bản...`,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, aiMessage]);
      setIsSending(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 1200);
  };

  const applyFormat = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    if (editorRef.current) {
      documentContentRef.current = editorRef.current.innerHTML;
    }
  };

  return (
    <div className="w-full flex flex-col h-screen bg-slate-50 overflow-hidden select-none">
      {/* Top Navigation Bar - Ép cứng h-14 cố định */}
      <div className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-slate-900">{workspaceTitle}</h1>
            {assistantConfig ? (
              <p className="text-[11px] text-slate-500">{assistantConfig.description}</p>
            ) : (
              <p className="text-[11px] text-slate-500">Chọn trợ lý AI để bắt đầu soạn thảo văn bản chuyên sâu.</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold border border-amber-200">
            ⚡ 234 credits
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-slate-900 text-white px-3 py-1 text-xs font-semibold">
            {assistantConfig ? assistantConfig.emoji : '🤖'} {assistantConfig ? assistantConfig.title : 'AI Editor'}
          </div>
        </div>
      </div>

      {/* 🧩 KHU VỰC CO GIÃN LINH HOẠT - CHIẾM TRỌN DIỆN TÍCH CÒN LẠI */}
      <div className="flex-1 min-w-0 w-full overflow-hidden relative bg-slate-100">
        <ResizablePanelGroup direction="horizontal" className="w-full h-full items-stretch">
          
          {/* PANEL TRÁI: Trình soạn thảo văn bản A4 (Mặc định chiếm 55% độ rộng) */}
          <ResizablePanel defaultSize={55} minSize={40} maxSize={75} className="flex flex-col h-full bg-slate-50">
            

            {/* WYSIWYG Mini Toolbar */}
            <div className="bg-white border-b border-slate-200 px-6 h-10 flex items-center gap-1 flex-shrink-0">
              <button onClick={() => applyFormat('bold')} className="p-1.5 hover:bg-slate-100 rounded"><Bold size={14} /></button>
              <button onClick={() => applyFormat('italic')} className="p-1.5 hover:bg-slate-100 rounded"><Italic size={14} /></button>
              <button onClick={() => applyFormat('underline')} className="p-1.5 hover:bg-slate-100 rounded"><Underline size={14} /></button>
              <div className="w-px h-4 bg-slate-200 mx-1"></div>
              <button onClick={() => applyFormat('justifyLeft')} className="p-1.5 hover:bg-slate-100 rounded"><AlignLeft size={14} /></button>
              <button onClick={() => applyFormat('justifyCenter')} className="p-1.5 hover:bg-slate-100 rounded"><AlignCenter size={14} /></button>
              <button onClick={() => applyFormat('justifyRight')} className="p-1.5 hover:bg-slate-100 rounded"><AlignRight size={14} /></button>
            </div>

            {/* Vùng hiển thị trang giấy A4 */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100/60 flex justify-center custom-scrollbar">
              <div className="shadow-xl rounded-xs min-h-[29.7cm] p-16 bg-white border border-slate-200/60 my-2"
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleContentChange}
                style={{
                  width: '100%',
                  maxWidth: '21cm',
                  lineHeight: '1.6',
                  fontSize: '13pt',
                  fontFamily: '"Times New Roman", serif',
                }}
              >
                {assistantConfig ? (
                  <div className="mb-6">
                    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${assistantConfig.colorClass} ${assistantConfig.bgClass} ${assistantConfig.borderClass}`}>
                      {assistantConfig.emoji} {assistantConfig.badge}
                    </span>
                  </div>
                ) : null}
                <div dangerouslySetInnerHTML={{ __html: initialContentString || defaultDocumentContent }} />
              </div>
            </div>
            {/* Action Bar */}
            <div className="bg-white border-b border-slate-200 px-6 h-12 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isSaved ? 'bg-green-100 text-green-700' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isSaved ? <Check size={14} /> : <Save size={14} />}
                  {isSaved ? 'Đã lưu!' : 'Lưu bản nháp'}
                </button>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-400 max-w-[200px] truncate font-medium">{documentTitle}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => console.log('Word')} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                  <Download size={13} /> Word
                </button>
                <button onClick={() => console.log('PDF')} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-md">
                  PDF
                </button>
              </div>
            </div>
          </ResizablePanel>

          {/* 🎛️ THANH KÉO DÀNH CHO NGƯỜI DÙNG CHỈNH ĐỘ RỘNG (Giao diện trực quan) */}
          <ResizableHandle withHandle className="w-2 bg-slate-200 hover:bg-blue-500 transition-colors cursor-col-resize" />

          {/* PANEL PHẢI: Khung Chat Điều phối & Thao tác Prompt (Mặc định chiếm 45% độ rộng) */}
          <ResizablePanel defaultSize={45} minSize={30} maxSize={60} className="flex flex-col h-full bg-white">
            {/* Header hội thoại */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 h-12 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare size={15} className="text-blue-600" />
                <span className="text-xs font-bold text-slate-700">Tinh chỉnh văn bản</span>
              </div>
              <span className="text-[10px] text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-semibold inline-flex items-center gap-1">
                <span>{assistantConfig?.emoji ?? '🤖'}</span>
                {assistantConfig?.title ?? 'Mô hình AI chung'}
              </span>
            </div>

            {/* Danh sách tin nhắn */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-xs leading-relaxed ${
                    message.role === 'user' ? 'bg-[#1E3A8A] text-white' : 'bg-slate-100 text-slate-800'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Ghim ngữ cảnh (Context Toggler) */}
            <div className="px-4 py-2 border-t border-slate-150 bg-slate-50/80 flex-shrink-0">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={contextPinned}
                  onChange={(e) => setContextPinned(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <div className="leading-none">
                  <span className="text-xs font-semibold text-slate-700 block">📍 Liên kết ngữ cảnh A4</span>
                </div>
              </label>
            </div>

            {quickActions.length > 0 && (
              <div className="px-4 pb-3 border-t border-slate-150 bg-slate-50/90">
                <div className="text-xs font-semibold text-slate-500 mb-2">Câu lệnh nhanh</div>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      onClick={() => setChatInput(action)}
                      className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Khung nhập lệnh Prompt */}
            <div className="p-3 border-t border-slate-200 bg-white flex-shrink-0">
              <div className="relative border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-600 transition-all bg-slate-50/30">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Sai AI sửa đổi (Ví dụ: Thêm căn cứ Luật tổ chức chính quyền địa phương vào phần đầu...)"
                  rows={2}
                  className="w-full px-3 py-2.5 pr-20 bg-transparent border-0 focus:outline-none text-xs leading-normal resize-none"
                />
                <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
                  <button className="p-1 text-slate-400 hover:text-slate-600"><Paperclip size={20} /></button>
                  <button onClick={handleSendMessage} className="p-1.5 bg-[#1E3A8A] hover:bg-blue-800 text-white rounded-lg transition-colors">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>
    </div>
  );
}
