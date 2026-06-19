import { useState, useRef } from 'react';
import {
  Save,
  FileText,
  Download,
  Send,
  Pin,
  User,
  Wallet,
  CreditCard
} from 'lucide-react';

const menuItems = [
  { id: '1', icon: '🏛️', label: 'Trợ lý Văn kiện Đảng' },
  { id: '2', icon: '🏢', label: 'Trợ lý Văn bản Nhà nước (HĐND, UBND, MTTQ,...)' },
  { id: '3', icon: '🎓', label: 'Trợ lý Quản lý Giáo dục & Nhà trường' },
  { id: '4', icon: '📚', label: 'Trợ lý Biên tập & Phát biểu' },
  { id: '5', icon: '🔍', label: 'Trợ lý Rút gọn & Kiểm tra văn bản' },
  { id: '6', icon: '📖', label: 'Trợ lý Soạn giáo án' },
  { id: '7', icon: '📝', label: 'Trợ lý tạo Ma trận & Đề Kiểm tra' },
  { id: '8', icon: '📊', label: 'Trợ lý Chấm & Đánh giá' },
  { id: '9', icon: '🏆', label: 'Trợ lý Viết Báo cáo thành tích & Sáng kiến' },
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIWorkspaceProps {
  onNavigate: (page: 'dashboard' | 'workspace' | 'wizard' | 'billing') => void;
}

export function AIWorkspace({ onNavigate }: AIWorkspaceProps) {
  const [activeMenuItem, setActiveMenuItem] = useState('1');
  const [documentContent, setDocumentContent] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      content: 'Xin chào! Tôi là trợ lý AI văn phòng. Tôi có thể giúp gì cho bạn hôm nay?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: 'Tôi đã nhận được yêu cầu của bạn. Đang xử lý...',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handlePinDocument = () => {
    alert('Văn bản hiện tại đã được ghim vào cuộc hội thoại');
  };

  return (
    <div className="h-screen flex flex-col bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-semibold" style={{ color: '#1F2937' }}>
            Trợ lý Văn phòng AI
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
            <Wallet size={18} style={{ color: '#1F2937' }} />
            <span className="text-sm font-medium" style={{ color: '#1F2937' }}>
              Ví: <strong>350 Credits</strong>
            </span>
          </div>

          <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <CreditCard size={18} />
            Nạp tiền
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <div className="text-sm font-medium" style={{ color: '#1F2937' }}>
                admin@vanphong.vn
              </div>
              <div className="text-xs text-gray-500">Quản trị viên</div>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside
          className="w-[260px] flex-shrink-0 border-r border-gray-200 overflow-y-auto"
          style={{ backgroundColor: '#F3F4F6' }}
        >
          <nav className="py-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === '7') {
                    onNavigate('wizard');
                  } else {
                    setActiveMenuItem(item.id);
                  }
                }}
                className={`w-full flex items-start gap-3 px-4 py-3 transition-colors text-left ${
                  activeMenuItem === item.id
                    ? 'bg-white border-r-4 border-blue-600'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <span
                  className="text-sm leading-relaxed"
                  style={{ color: activeMenuItem === item.id ? '#1F2937' : '#4B5563' }}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Workspace - Split Screen */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Document Editor (60%) */}
          <div className="flex-[6] flex flex-col border-r border-gray-200">
            {/* Editor Toolbar */}
            <div
              className="h-14 px-4 flex items-center gap-3 border-b border-gray-200 flex-shrink-0"
              style={{ backgroundColor: '#F3F4F6' }}
            >
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                <Save size={16} />
                Lưu văn bản
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium" style={{ color: '#1F2937' }}>
                <FileText size={16} />
                Xuất Word
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium" style={{ color: '#1F2937' }}>
                <Download size={16} />
                Xuất PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium" style={{ color: '#1F2937' }}>
                <Download size={16} />
                Xuất Excel
              </button>
            </div>

            {/* WYSIWYG Editor Area */}
            <div className="flex-1 overflow-y-auto bg-white">
              <div className="max-w-4xl mx-auto px-8 py-6">
                <textarea
                  value={documentContent}
                  onChange={(e) => setDocumentContent(e.target.value)}
                  placeholder="Bắt đầu soạn thảo văn bản của bạn tại đây..."
                  className="w-full h-full min-h-[600px] resize-none focus:outline-none text-base leading-relaxed"
                  style={{ color: '#1F2937', fontFamily: 'Inter, sans-serif' }}
                />
              </div>
            </div>
          </div>

          {/* Right Panel - AI Chatbot (40%) */}
          <div className="flex-[4] flex flex-col bg-white">
            {/* Chat Header */}
            <div
              className="h-14 px-6 flex items-center border-b border-gray-200 flex-shrink-0"
              style={{ backgroundColor: '#F3F4F6' }}
            >
              <h3 className="text-base font-semibold" style={{ color: '#1F2937' }}>
                Trợ lý AI
              </h3>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100'
                    }`}
                    style={message.sender === 'ai' ? { color: '#1F2937' } : {}}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={handlePinDocument}
                className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                style={{ color: '#1F2937' }}
              >
                <Pin size={16} />
                Ghim văn bản hiện tại
              </button>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Nhập tin nhắn của bạn..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  style={{ color: '#1F2937' }}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
