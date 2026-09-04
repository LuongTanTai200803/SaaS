import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Save, Download, FileText, MessageSquare, Send, Paperclip,
  Mic, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Table, ChevronDown, Copy, Check, X, Keyboard
} from 'lucide-react';
import api from '../api'; // Import đối tượng 'api' tổng hợp
import { aiApi } from '../api/aiApi';
import { sessionApi } from '../api/sessionAPi';

// 🔌 Nạp hệ thống co giãn từ thư mục UI có sẵn của bạn
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

interface DocumentWorkspaceProps {
  initialContent?: string | Record<string, any>;
  documentTitle?: string;
  formData?: any;
  onBack?: () => void;
  sessionUuid?: string;
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
  sessionUuid,
  formData,
  onBack,
  assistantId,
  assistantType,
}: DocumentWorkspaceProps) {

  const { sessionUuid: routeSessionUuid } = useParams<{
    sessionUuid: string;
  }>();

  const activeSessionUuid = sessionUuid || routeSessionUuid;

  // =========================================================
  // 1. REFS
  // =========================================================
  const editorRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isUpdatingFromAI = useRef<boolean>(false);

  // =========================================================
  // 2. STATE
  // =========================================================

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
  const [workspaceContent, setWorkspaceContent] = useState<string>('');
  

  // =========================================================
  // 3. ASSISTANT CONFIG
  // =========================================================
  const activeAssistantId = assistantId || assistantType || undefined;
  const assistantConfig = activeAssistantId
    ? ASSISTANT_CONFIGS[activeAssistantId] ?? Object.values(ASSISTANT_CONFIGS).find(
        (assistant) => assistant.title === activeAssistantId || assistant.badge === activeAssistantId
      )
    : undefined;
  const workspaceTitle = assistantConfig ? `Trợ lý ${assistantConfig.title}` : 'Trợ lý Văn phòng AI';
  const quickActions = assistantConfig?.quickActions || [];

  // =========================================================
  // 4. HELPER: ESCAPE HTML
  // =========================================================
  const escapeHtml = (value: string) => {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // =========================================================
  // 5. HELPER: PARSE editorText
  // =========================================================

 const parseEditorText = (editorText: any) => {
  if (!editorText) return null;
  if (typeof editorText === 'string') {
    const trimmed = editorText.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return JSON.parse(trimmed);
      } catch (error) {
        console.warn('[Workspace] editorText JSON parse failed', error);
      }
    }
    return trimmed;
  }
  console.warn('[Workspace] editorText is not a string:', editorText);
  return editorText;
};

  // =========================================================
  // 6. HELPER: JSON editorText → HTML
  // =========================================================
  
  const renderEditorBlocks = (data: any) => {
  if (!data) return [];

  const blocks: string[] = [];

  if (data.doanCanCu) {
    blocks.push(`
      <p class="doc-paragraph">
        ${escapeHtml(data.doanCanCu)}
      </p>
    `);
  }

  if (data.cauDanChuyenTiep) {
    blocks.push(`
      <p class="doc-paragraph">
        ${escapeHtml(data.cauDanChuyenTiep)}
      </p>
    `);
  }

  if (Array.isArray(data.cacMuc)) {
    data.cacMuc.forEach((item: any) => {
      if (item.tieuDeMuc) {
        blocks.push(`
          <h2 class="doc-section-title">
            ${escapeHtml(item.tieuDeMuc)}
          </h2>
        `);
      }

      if (item.noiDungChiTiet) {
        blocks.push(`
          <p class="doc-paragraph">
            ${escapeHtml(item.noiDungChiTiet)}
          </p>
        `);
      }
    });
  }

  if (data.cauKetHanhChinh) {
    blocks.push(`
      <p class="doc-paragraph doc-ending">
        ${escapeHtml(data.cauKetHanhChinh)}
      </p>
    `);
  }

  return blocks;
};
  // =========================================================
  // 7. HELPER: JSON editorText → HTML (detailed)
  // =========================================================
  const renderEditorObject = (data: any) => {
    if (!data) return '';

    let html = '';

    // =====================================================
    // ĐOẠN CĂN CỨ
    // =====================================================
    if (data.doanCanCu) {
      html += `
        <p
          style="
            margin: 0 0 12px 0;
            padding: 0;
            text-align: justify;
            font-family: 'Times New Roman', serif;
            font-size: 13pt;
            line-height: 1.6;
            white-space: pre-line;
          "
        >
          ${escapeHtml(data.doanCanCu)}
        </p>
      `;
    }

    // =====================================================
    // CÂU DẪN CHUYỂN TIẾP
    // =====================================================
    if (data.cauDanChuyenTiep) {
      html += `
        <p
          style="
            margin: 0 0 12px 0;
            padding: 0;
            text-align: justify;
            font-family: 'Times New Roman', serif;
            font-size: 13pt;
            line-height: 1.6;
            white-space: pre-line;
          "
        >
          ${escapeHtml(data.cauDanChuyenTiep)}
        </p>
      `;
    }

    // =====================================================
    // CÁC MỤC I, II, III...
    // =====================================================
    if (Array.isArray(data.cacMuc)) {
      data.cacMuc.forEach((item: any) => {

        // -------------------------------------------------
        // TIÊU ĐỀ MỤC
        // -------------------------------------------------
        if (item?.tieuDeMuc) {
          html += `
            <h2
              style="
                margin: 18px 0 8px 0;
                padding: 0;
                text-align: left;
                font-family: 'Times New Roman', serif;
                font-size: 13pt;
                line-height: 1.4;
                font-weight: bold;
              "
            >
              ${escapeHtml(item.tieuDeMuc)}
            </h2>
          `;
        }

        // -------------------------------------------------
        // NỘI DUNG CHI TIẾT
        // -------------------------------------------------
        if (item?.noiDungChiTiet) {
          html += `
            <p
              style="
                margin: 0 0 10px 0;
                padding: 0;
                text-align: justify;
                font-family: 'Times New Roman', serif;
                font-size: 13pt;
                line-height: 1.6;
                white-space: pre-line;
              "
            >
              ${escapeHtml(item.noiDungChiTiet)}
            </p>
          `;
        }
      });
    }

    // =====================================================
    // CÂU KẾT
    // =====================================================
    if (data.cauKetHanhChinh) {
      html += `
        <p
          style="
            margin: 16px 0 10px 0;
            padding: 0;
            text-align: justify;
            font-family: 'Times New Roman', serif;
            font-size: 13pt;
            line-height: 1.6;
            white-space: pre-line;
          "
        >
          ${escapeHtml(data.cauKetHanhChinh)}
        </p>
      `;
    }

    return html;
  };

  // =========================================================
  // renderDocumentHtml
  const renderDocumentHtml = (
    bodyHtml: string,
    metadata: any = {}
  ) => {
    const coQuanChuQuan = metadata.coQuanChuQuan || '[CƠ QUAN CHỦ QUẢN]';

    const coQuanBanHanh = metadata.coQuanBanHanh || '[CƠ QUAN BAN HÀNH]';

    const soKyHieu =  metadata.soKyHieu || '________';

    const loaiVanBan =  metadata.loaiVanBan || '________';

    const tenVanBan = metadata.tenVanBan || '________________';

    const diaDanh = metadata.diaDanh || '[Địa danh]';

    const ngayBanHanh = metadata.ngayBanHanh
      ? new Date(metadata.ngayBanHanh)
      : null;

    const ngay = ngayBanHanh
      ? ngayBanHanh.getDate()
      : '____';

    const thang = ngayBanHanh
      ? ngayBanHanh.getMonth() + 1
      : '____';

    const nam = ngayBanHanh
      ? ngayBanHanh.getFullYear()
      : '____';

    const noiNhan = metadata.noiNhanBaoCao || '[Nơi nhận]';

    const nguoiKy = metadata.nguoiKy || '[Họ và tên]';

    return `
         <!-- HEADER -->
    <div style="
    width: 100%;
    margin-bottom: 18px;
    font-size: 11pt;
    line-height: 1.4;">
    <!-- HÀNG TRÊN: CƠ QUAN + QUỐC HIỆU -->
    <div style="
      display: grid;
      grid-template-columns: 45% 55%;
      align-items: start;">
      <!-- CỘT TRÁI -->
      <div style="
        text-align: center;
        padding-right: 10px;">
        <div style="
          font-weight: bold;
          text-transform: none;">
          ${escapeHtml(coQuanChuQuan)}
        </div>
        <div style="
          font-weight: bold;
          margin-top: 4px;">
          ${escapeHtml(coQuanBanHanh)}
        </div>
      </div>
      <!-- CỘT PHẢI -->
      <div style="
        text-align: center;
        padding-left: 10px;">
        <div style="
          font-size: 12pt;
          font-weight: bold;">
          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT
        </div>
        <div style="
          font-size: 11pt;
          font-weight: bold;
          margin-top: 4px;
          text-decoration: underline;
          text-underline-offset: 3px;">
          Độc lập - Tự do - Hạnh phúc
        </div>
        <div style="
          font-size: 10.5pt;
          margin-top: 14px;">
          ${escapeHtml(diaDanh)},
          ngày ${ngay}
          tháng ${thang}
          năm ${nam}
        </div>
      </div>
    </div>
      
  </div>
        <!-- SỐ KÝ HIỆU -->
      <div style="
        font-size: 11pt;
        margin-bottom: 20px;
      ">
        Số: ${escapeHtml(soKyHieu)}
      </div>
      <!-- TÊN VĂN BẢN -->
      <div style="
        text-align: center;
        margin-bottom: 24px;
      ">
        <div style="
          font-size: 14pt;
          font-weight: bold;
          text-transform: uppercase;
        ">
          ${escapeHtml(loaiVanBan)}
        </div>
        <div style="
          font-size: 13pt;
          font-weight: bold;
          margin-top: 8px;
        ">
          ${escapeHtml(tenVanBan)}
        </div>
      </div>
      <!-- BODY AI -->
      ${bodyHtml}
      <!-- FOOTER -->
      <div style="
        display: flex;
        justify-content: space-between;
        margin-top: 48px;
        font-size: 11pt;
      ">
        <div style="
          width: 45%;
        ">
          <div style="font-weight: bold;">
            Nơi nhận:
          </div>
          <div style="
            white-space: pre-line;
            margin-top: 6px;
          ">
            ${escapeHtml(noiNhan)}
          </div>
        </div>
        <div style="
          width: 45%;
          text-align: center;
        ">
          <div style="font-weight: bold;">
            [Chủ tịch]
          </div>
          <div style="
            margin-top: 60px;
            font-weight: bold;
          ">
            ${escapeHtml(nguoiKy)}
          </div>
        </div>
      </div>
    `;
  };


  // =========================================================
  // 7. HELPER: INITIAL CONTENT
  // =========================================================
  const buildInitialContent = (
    content: string | Record<string, any>
  ) => {
    if (!content) return '';

    // Object
    if (typeof content === 'object') {

      // Đã là HTML
      if (
        typeof content.content === 'string' &&
        content.content.trim()
      ) {
        return content.content;
      }

      if (
        typeof content.documentHtml === 'string' &&
        content.documentHtml.trim()
      ) {
        return content.documentHtml;
      }

      // Object editorText
      return renderEditorObject(content);
    }

    // String
    if (typeof content === 'string') {

      const trimmed = content.trim();

      // Thử xem có phải JSON không
      try {
        const parsed = JSON.parse(trimmed);

        return renderEditorObject(parsed);
      } catch {
        // Không phải JSON → coi là HTML
        return trimmed;
      }
    }

    return '';
  };
  // =========================================================
  // 8. DEFAULT CONTENT
  // =========================================================
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

  // =========================================================
  // 9. INITIAL CONTENT
  // =========================================================
  const documentContentRef = useRef<string>('');
  const lastSavedHtmlRef = useRef<string>(documentContentRef.current);

  // =========================================================
  // 10. CONTENT HIỂN THỊ
  // =========================================================
  const contentToRender = workspaceContent;
  // =========================================================
  // 11. FETCH WORKSPACE
  // =========================================================

  // Hàm fetchWorkspace để gọi API lấy dữ liệu workspace
  const fetchWorkspace = async () => {
    if (!activeSessionUuid) return null;

    try {
      const response: any =
        await api.aiApi.getWorkspace(activeSessionUuid);

      const workspace = response?.data ?? response;

      return workspace;
    } catch (error) {
      console.error(
        '[Workspace] Không thể tải dữ liệu workspace:',
        error
      );

      return null;
    }
  };

  // =========================================================
  // 12. LOAD WORKSPACE 
  // Tải dữ liệu workspace từ API khi sessionUuid thay đổi
  useEffect(() => {
    if (!activeSessionUuid) return;

    const loadWorkspace = async () => {
      const workspace = await fetchWorkspace();

      if (!workspace) return;

      const editorText = workspace.editorText;

      if (!editorText) return;

      loadedEditorTextRef.current = editorText;

      const parsedEditorText =
        parseEditorText(editorText);

      if (!parsedEditorText) return;

      const bodyHtml =
        renderEditorObject(parsedEditorText);

      const html =
        renderDocumentHtml(
          bodyHtml,
          formData
        );

      setWorkspaceContent(html);
    };

    loadWorkspace();

  }, [activeSessionUuid, formData]);

  // =========================================================
  // 13. CONTENT CHANGE
  // =========================================================
  const handleContentChange = () => {
    if (editorRef.current && !isUpdatingFromAI.current) {
      documentContentRef.current = editorRef.current.innerHTML;
    }
  };
  // Tự động lưu nội dung vào draft mỗi 2 phút nếu có thay đổi header, footer
  const headerFooterSnapshotRef = useRef<string>('');
  const loadedEditorTextRef = useRef<string | null>(null);

  const buildHeaderFooterSnapshot = () => JSON.stringify({
    loaiVanBan: formData?.loaiVanBan ?? '',
    tenVanBan: formData?.tenVanBan ?? '',
    coQuanBanHanh: formData?.coQuanBanHanh ?? '',
    diaDanh: formData?.diaDanh ?? '',
    ngayBanHanh: formData?.ngayBanHanh ?? '',
    noiNhanBaoCao: formData?.noiNhanBaoCao ?? '',
    nguoiKy: formData?.nguoiKy ?? '',
    soKyHieu: formData?.soKyHieu ?? '',
  });

  useEffect(() => {
    if (!sessionUuid) return;

    const interval = window.setInterval(async () => {
      const currentSnapshot = buildHeaderFooterSnapshot();
      if (currentSnapshot === headerFooterSnapshotRef.current) return;
      headerFooterSnapshotRef.current = currentSnapshot;

      try {
        await sessionApi.saveDraft({
          sessionUuid,
          editorText: loadedEditorTextRef.current,
          formData: formData ?? {},
          fieldCode: 'MAIN_CONTENT',
        });
        console.log('[Workspace] auto-saved header/footer');
      } catch (error) {
        console.error('[Workspace] auto-save draft failed', error);
      }
    }, 120000);

    return () => window.clearInterval(interval);
  }, [sessionUuid, formData]);

  // =========================================================
  // 14. RENDER HTML VÀO EDITOR
  // =========================================================
  useEffect(() => {
    if (editorRef.current) {
      const contentToRender = workspaceContent;
      documentContentRef.current = contentToRender;
    }
  }, [workspaceContent]);

  // =========================================================
  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    console.log('Saving content:', documentContentRef.current);
  };

  // ========================================================
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

  // Enter key handler for chat input
  const handleChatKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!chatInput.trim() || isSending) return;
      handleSendMessage();
    }
  };

  // ========================================================
  // 15. HANDLE SEND MESSAGE TO AI ASSISTANT
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isSending || !activeSessionUuid) return;

    const userText = chatInput.trim();

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsSending(true);

    const assistantMessageId = (Date.now() + 1).toString();

    const assistantPlaceholder: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: 'Đang xử lý yêu cầu AI...',
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, assistantPlaceholder]);

    try {
      const result = await sessionApi.refineWorkspace({
        sessionUuid: activeSessionUuid,
        userText,
        model: 'gpt-4o',
      });

      const wrapper = result?.data ? result.data : result;
      const rawContent = wrapper?.content ?? wrapper?.data?.content ?? wrapper?.editorText;
      const parsedContent =
        typeof rawContent === 'string' && rawContent.trim().startsWith('{')
          ? JSON.parse(rawContent)
          : rawContent;

      const bodyHtml = renderEditorObject(parsedContent);
      const html = renderDocumentHtml(bodyHtml, formData);

      setWorkspaceContent(html);

      setChatMessages(prev =>
        prev.map(message =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: 'Đã hoàn thành',
                timestamp: new Date(),
              }
            : message
        )
      );
    } catch (error) {
      console.error('[Workspace] AI edit failed:', error);

      setChatMessages(prev =>
        prev.map(message =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: 'Lỗi khi gọi AI. Vui lòng thử lại.',
                timestamp: new Date(),
              }
            : message
        )
      );
    } finally {
      setIsSending(false);
    }
  };
  

  // =========================================================
  // exportWork
  // trong DocumentWorkspace.tsx
  const handleExportWord = async () => {
    if (!activeSessionUuid) {
      alert('Không tìm thấy session để xuất file.');
      return;
    }

    try {
      const response = await api.fileApi.exportWordDraft({
        sessionUuid: activeSessionUuid,
        exportFormat: 'WORD',
      });

      const blob = response.data ?? response;
      const disposition = response.headers?.['content-disposition'] ?? '';
      const fileNameMatch = disposition.match(/filename="(.+?)"/i);
      const fileName =
        fileNameMatch?.[1] ??
        `${documentTitle || 'Van_Ban_Dang_Do'}.docx`;

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      console.log('[Workspace] Export Word success');
    } catch (error) {
      console.error('[Workspace] Export Word failed:', error);
      alert('Xuất file Word thất bại!');
    }
  };
  // =========================================================
  const applyFormat = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    if (editorRef.current) {
      documentContentRef.current = editorRef.current.innerHTML;
    }
  };

  return (
    <div className="w-full h-full min-h-0 flex flex-col bg-slate-50 overflow-hidden">
      <style>{`
  .a4-document {
  width: 21cm;
  min-height: 29.7cm;
  height: max-content;

  padding: 1.5cm 1.7cm;
  box-sizing: border-box;

  background: white;
  border: 1px solid #e5e7eb;

  font-family: "Times New Roman", serif;
  font-size: 13pt;
  line-height: 1.6;

  outline: none;
}
`}</style>

      {/* Top Navigation Bar - Ép cứng h-14 cố định */}
      <div className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex flex-shrink-0 items-center gap-4">
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
              <p className="text-[11px] text-slate-500">Đang soạn thảo cùng trợ lý AI.</p>
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
      <div className="flex-1 min-h-0 h-0 overflow-hidden relative bg-slate-100">
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
            <div className="flex-1 min-h-0 overflow-y-auto p-6 bg-slate-100/60 flex justify-center items-start custom-scrollbar">
              <div
                className="a4-document"
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleContentChange}
                dangerouslySetInnerHTML={{
                  __html: contentToRender
                }}
              />
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
                <button
                  onClick={handleExportWord}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
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
                    {/* PANEL PHẢI: Khung Chat Điều phối & Thao tác Prompt (Mặc định chiếm 45% độ rộng) */}
          <ResizablePanel defaultSize={45} minSize={30} maxSize={60} className="h-full min-h-0 bg-white">
            <div className="flex flex-col h-full min-h-0 overflow-hidden bg-slate-50">

              {/* Header cố định */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 h-12 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare size={15} className="text-blue-600" />
                  <span className="text-xs font-bold text-slate-700">
                    Tinh chỉnh văn bản
                  </span>
                </div>

                <span className="text-[10px] text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md font-semibold inline-flex items-center gap-1">
                  <span>{assistantConfig?.emoji ?? '🤖'}</span>
                  {assistantConfig?.title ?? 'Mô hình AI chung'}
                </span>
              </div>

              {/* CHỈ VÙNG NÀY ĐƯỢC SCROLL */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 custom-scrollbar select-text">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-2.5 text-xs leading-relaxed ${
                        message.role === 'user'
                          ? 'bg-[#1E3A8A] text-white'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}

                <div ref={chatEndRef} />
              </div>

              {/* Context cố định dưới */}
              <div className="px-4 py-2 border-t border-slate-150 bg-slate-50/80 flex-shrink-0">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contextPinned}
                    onChange={(e) => setContextPinned(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />

                  <div className="leading-none">
                    <span className="text-xs font-semibold text-slate-700 block">
                      📍 Liên kết ngữ cảnh A4
                    </span>
                  </div>
                </label>
              </div>

              {/* Quick actions cố định dưới */}
              {quickActions.length > 0 && (
                <div className="px-4 pb-3 border-t border-slate-150 bg-slate-50/90 flex-shrink-0">
                  <div className="text-xs font-semibold text-slate-500 mb-2">
                    Câu lệnh nhanh
                  </div>

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

              {/* Input cố định dưới */}
              <div className="p-3 border-t border-slate-200 bg-white flex-shrink-0">
                <div className="relative border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-600 transition-all bg-slate-50/30">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                    placeholder="Sai AI sửa đổi..."
                    rows={2}
                    className="w-full px-3 py-2.5 pr-20 bg-transparent border-0 focus:outline-none text-xs leading-normal resize-none"
                  />

                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
                    <button className="p-1 text-slate-400 hover:text-slate-600">
                      <Paperclip size={20} />
                    </button>

                    <button
                      onClick={handleSendMessage}
                      disabled={isSending}
                      className="p-1.5 bg-[#1E3A8A] hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg transition-colors"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>

        </ResizablePanelGroup>
      </div>
    </div>
  );
}