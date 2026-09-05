import { useState, useMemo, useEffect, useRef } from 'react';
import {
  FileText, Upload, Calendar, ChevronDown, Info,
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles, X, File, Eye
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ContextualHelpPanel } from '../../components/ContextualHelpPanel';
import { fileApi } from '../../api/fileApi';
import { CreditEstimator } from '../../components/CreditEstimator';
import { UploadingFile, uploadFileToServer, deleteFileFromServer } from '../../services/fileUpload';
import { DocumentWorkspace } from '../../components/DocumentWorkspace';
import { sessionApi } from '../../api/sessionAPi';

interface VanKienDangFormProps {
  onGenerate?: (data: any) => void;
  initialSessionData?: { formData: FormData; filesMap: Record<string, UploadingFile[]> };
  activeSessionUuid?: string | null;
  sessionStatus?: string;
  onSessionStatusChange?: (status: string) => void;
  onClose?: () => void;
}

type MenuSection = 1 | 2 | 3 | 4 | 5 | 6;
export type FileCategory = 'DIRECTIVE' | 'LEGAL' | 'CONTENT' | 'TEMPLATE' | 'RELATED' | 'EVIDENCE';

export const FIELD_CODE_BY_CATEGORY = {
  DIRECTIVE: "DIRECTIVE",
  LEGAL: "LEGAL_BASIS",
  CONTENT: "MAIN_CONTENT",
  TEMPLATE: "TEMPLATE",
  RELATED: "REFERENCE",
  EVIDENCE: "STATISTICS",
  } as const satisfies Record<FileCategory, string>;

export const CATEGORY_BY_FIELD_CODE = Object.fromEntries(
  Object.entries(FIELD_CODE_BY_CATEGORY).map(([category, fieldCode]) => [
  fieldCode,
  category,
  ]),
  ) as Record<string, FileCategory>;

export function getFieldCodeByCategory(category: FileCategory): string {
  return FIELD_CODE_BY_CATEGORY[category];
  }

export function getCategoryByFieldCode(fieldCode: string): FileCategory | undefined {
  return CATEGORY_BY_FIELD_CODE[fieldCode];
  }

export function getTemplateFieldCode(variant: "main" | "outline" = "main"): string {
  return variant === "outline" ? "OUTLINE" : "TEMPLATE";
  }

interface FormData {
  // Menu 1
  loaiVanBan: string;
  tenVanBan: string;
  coQuanChuQuan: string;
  coQuanBanHanh: string;
  diaDanh: string;
  nguoiKy: string;
  soKyHieu: string;
  kinhGui: string;
  noiNhanBaoCao: string;
  ngayBanHanh: string;

  // Menu 2
  vanBanChiDao: string;
  vanBanPhapLy: string;

  // Menu 3
  noiDungChinh: string;
  bangBieuSoLieu: string;
  taiLieuMinhChungFileIds: string[];

  // Menu 4
  mauVanBan: string;
  deCuongDanY: string;

  // Menu 5
  vanBanLienQuan: string;
  taoPhuLuc: boolean;
  doiChieu: boolean;
  bamCanCu: boolean;
  theThuc: boolean;

  // Menu 6
  phongCach: string;
  doDai: string;
  mucDoHoanChinh: string;
  selectedModel: string;
  outputSize: string;
}

export function VanKienDangForm({
    onGenerate,
    initialSessionData,
    activeSessionUuid,
    sessionStatus,
    onSessionStatusChange,
    onClose
  }: VanKienDangFormProps) {

    const navigate = useNavigate();
    const location = useLocation();

    const getStepFromUrl = (): MenuSection => {
      const stepFromUrl = Number(new URLSearchParams(location.search).get('step') ?? '1');
      return Number.isInteger(stepFromUrl) && stepFromUrl >= 1 && stepFromUrl <= 6
        ? (stepFromUrl as MenuSection)
        : 1;
    };

    const [currentMenu, setCurrentMenu] = useState<MenuSection>(getStepFromUrl());

    const syncStepInUrl = (step: MenuSection) => {
      const params = new URLSearchParams(location.search);
      params.set('step', String(step));

      navigate(
        {
          pathname: location.pathname,
          search: `?${params.toString()}`,
        },
        { replace: true }
      );
    };

    useEffect(() => {
      const urlStep = getStepFromUrl();
      if (urlStep !== currentMenu) {
        setCurrentMenu(urlStep);
      }
    }, [location.search]);

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [draftMeta, setDraftMeta] = useState<{
    status?: string;
    updatedAt?: string;
    fieldCode?: string;
    editorText?: string | null;
  } | null>(null);

  const effectiveStatusRaw = sessionStatus ?? draftMeta?.status ?? 'DRAFT';
  const normalizedStatus = String(effectiveStatusRaw || '').toUpperCase();
  const isDraft = normalizedStatus === 'DRAFT';
  const isEditing = normalizedStatus === 'EDITING';

  const [generatedDocument, setGeneratedDocument] = useState<string | Record<string, any>>('');

  // 🎯 QUY HOẠCH TẬP TRUNG: Gom 6 mảng file upload rời rạc thành 1 State Map duy nhất
  const [filesMap, setFilesMap] = useState<Record<FileCategory, UploadingFile[]>>({
    DIRECTIVE: [],
    LEGAL: [],
    CONTENT: [],
    TEMPLATE: [],
    RELATED: [],
    EVIDENCE: [],
  });
  const [formData, setFormData] = useState<FormData>({
    loaiVanBan: '',
    tenVanBan: '',
    coQuanChuQuan: '',
    coQuanBanHanh: '',
    diaDanh: '',
    nguoiKy: '',
    soKyHieu: '',
    kinhGui: '',
    noiNhanBaoCao: '',
    ngayBanHanh: new Date().toISOString().split('T')[0],
    vanBanChiDao: '',
    vanBanPhapLy: '',
    noiDungChinh: '',
    bangBieuSoLieu: '',
    taiLieuMinhChungFileIds: [],
    mauVanBan: '',
    deCuongDanY: '',
    vanBanLienQuan: '',
    taoPhuLuc: false,
    doiChieu: false,
    bamCanCu: false,
    theThuc: false,
    phongCach: '',
    doDai: '',
    mucDoHoanChinh: '',
    selectedModel: 'claude-sonnet-4.6',
    outputSize: '',
  });

  const DEFAULT_FORM: FormData = {
    loaiVanBan: '',
    tenVanBan: '',
    coQuanChuQuan: '',
    coQuanBanHanh: '',
    diaDanh: '',
    nguoiKy: '',
    soKyHieu: '',
    kinhGui: '',
    noiNhanBaoCao: '',
    ngayBanHanh: new Date().toISOString().split('T')[0],
    vanBanChiDao: '',
    vanBanPhapLy: '',
    noiDungChinh: '',
    bangBieuSoLieu: '',
    taiLieuMinhChungFileIds: [],
    mauVanBan: '',
    deCuongDanY: '',
    vanBanLienQuan: '',
    taoPhuLuc: false,
    doiChieu: false,
    bamCanCu: false,
    theThuc: false,
    phongCach: '',
    doDai: '',
    mucDoHoanChinh: '',
    selectedModel: 'claude-sonnet-4.6',
    outputSize: '',
  };

  // const validateField = (field: keyof FormData, value: any) => {
  //   let error = '';

  //   if (['loaiVanBan', 'tenVanBan', 'noiDungChinh'].includes(field)) {
  //     if (!String(value ?? '').trim()) {
  //       error = 'Trường này không được để trống';
  //     }
  //   }

  //   setFieldErrors(prev => ({ ...prev, [field]: error }));
  //   return error === '';
  // };

  // 📝 LOAD DRAFT: Khi activeSessionUuid thay đổi, tải dữ liệu nháp từ Backend và đổ vào formData
  useEffect(() => {
  if (!activeSessionUuid) return;

  const loadDraft = async () => {
    try {
      const data = await sessionApi.getDraft(activeSessionUuid);

      const parsedFormData =
        data?.formData ??
        (data?.wizardStateJson
          ? JSON.parse(data.wizardStateJson)
          : null);



      if (parsedFormData) {
        const normalized = { ...DEFAULT_FORM, ...parsedFormData };
        setFormData(prev => ({
          ...prev,
          ...normalized
        }));
        setGeneratedDocument(parsedFormData);

      }

      setDraftMeta({
        status: data?.status,
        updatedAt: data?.updatedAt,
        fieldCode: data?.fieldCode,
        editorText: data?.editorText ?? null,
      });

      if (data?.sessionName) {
        setSessionName(data.sessionName);
      }

      console.log('Load draft/session thành công:', data);

    } catch (e) {
      console.error('Load draft/session failed:', e);
    }
  };

  loadDraft();
}, [activeSessionUuid]);

  // 📝 AUTO SAVE DRAFT: Tự động lưu nháp mỗi 30 giây nếu đang ở trạng thái DRAFT
  const latestFormRef = useRef(formData);
  useEffect(() => {
    latestFormRef.current = formData;
  }, [formData]);

  useEffect(() => {
    if (!activeSessionUuid) return;
    if (normalizedStatus !== 'DRAFT') return;

    const timer = setInterval(async () => {
      try {

        // autosave draft
        const payload = {
          sessionUuid: activeSessionUuid,
          editorText: draftMeta?.editorText ?? null,
          formData: latestFormRef.current,
          fieldCode: draftMeta?.fieldCode || 'MAIN_CONTENT',
        };
        const saved = await sessionApi.saveDraft(payload);

        console.log('Auto save draft thành công:', saved);
        setDraftMeta({
          status: saved?.status,
          updatedAt: saved?.updatedAt,
          fieldCode: saved?.fieldCode,
          editorText: saved?.editorText ?? null
        });

        onSessionStatusChange?.(String(saved?.status || '').toUpperCase());
        console.log('Auto save draft status:', saved?.status);
        if (String(saved?.status || '').toUpperCase() === 'EDITING') {
          clearInterval(timer);
        }
      } catch (e) {
        console.error('Auto save draft lỗi:', e);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [activeSessionUuid, normalizedStatus, onSessionStatusChange]);

  // Đổi tên session
  const [sessionName, setSessionName] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState<string>(formData.tenVanBan || '');

  useEffect(() => {
      setEditingName(sessionName || formData.tenVanBan || '');
  }, [sessionName, formData.tenVanBan]);

  const handleSaveSessionName = async () => {
    if (!activeSessionUuid) {
      alert('Không tìm thấy session');
      return;
    }
    try {
      const resp = await sessionApi.updateSessionName(activeSessionUuid, editingName);
      const updated = resp?.data ?? resp;
      // backend trả { sessionName: '...' }
      const returnedName = updated?.sessionName ?? editingName;
      setSessionName(returnedName);
      // tùy chọn: giữ title document (tenVanBan) hoặc đồng bộ với sessionName nếu bạn muốn
      setFormData(prev => ({ ...prev, tenVanBan: prev.tenVanBan || returnedName }));
      setIsEditingName(false);
      alert('Đã đổi tên phiên thành công');
    } catch (err) {
      console.error('Update session name failed', err);
      alert('Lỗi khi đổi tên phiên');
    }
  }; // end of handleSaveSessionName

  // 🔄 HYDRATION FLOW: Tự động đổ ngược dữ liệu từ Backend vào các Field khi component nhận dữ liệu cũ
  useEffect(() => {
    if (initialSessionData) {
      if (initialSessionData.formData) {
        setFormData(initialSessionData.formData);
      }
      if (initialSessionData.filesMap) {
        setFilesMap(initialSessionData.filesMap);
      }
    }
  }, [initialSessionData]);

  
  const combinedInputText = useMemo(() => {
    return [
      formData.tenVanBan,
      formData.coQuanChuQuan,
      formData.coQuanBanHanh,
      formData.diaDanh,
      formData.nguoiKy,
      formData.soKyHieu,
      formData.kinhGui,
      formData.noiNhanBaoCao,
      formData.vanBanChiDao,
      formData.vanBanPhapLy,
      formData.noiDungChinh,
      formData.bangBieuSoLieu,
      formData.mauVanBan,
      formData.deCuongDanY,
      formData.vanBanLienQuan,
    ].filter(Boolean).join('\n\n'); // Dùng \n\n để dễ đọc khi debug[cite: 2]
  }, [
    formData.tenVanBan,
    formData.coQuanChuQuan,
    formData.coQuanBanHanh,
    formData.diaDanh,
    formData.nguoiKy,
    formData.soKyHieu,
    formData.kinhGui,
    formData.noiNhanBaoCao,
    formData.vanBanChiDao,
    formData.vanBanPhapLy,
    formData.noiDungChinh,
    formData.bangBieuSoLieu,
    formData.mauVanBan,
    formData.deCuongDanY,
    formData.vanBanLienQuan,
  ]);

  // Tổng hợp tất cả files từ cấu trúc Map mới để hiển thị trong Credit Estimator[cite: 2]
  const allUploadedFiles = useMemo(() => {
    const allFiles = Object.values(filesMap).flat();
    return allFiles.map(f => f.file);
  }, [filesMap]);

  // Đếm số files theo trạng thái từ cấu trúc Map mới[cite: 2]
  const fileStats = useMemo(() => {
    const allFiles = Object.values(filesMap).flat();
    return {
      total: allFiles.length,
      uploading: allFiles.filter(f => f.status === 'UPLOADING').length,
      success: allFiles.filter(f => f.status === 'SUCCESS').length,
      failed: allFiles.filter(f => f.status === 'FAILED').length,
    };
  }, [filesMap]);

  const menus = [
    { id: 1 as MenuSection, title: 'Thông tin văn bản', completed: false },
    { id: 2 as MenuSection, title: 'Văn bản chỉ đạo', completed: false },
    { id: 3 as MenuSection, title: 'Nội dung, kết quả thực hiện', completed: false },
    { id: 4 as MenuSection, title: 'Mẫu văn bản', completed: false },
    { id: 5 as MenuSection, title: 'Văn bản liên quan', completed: false },
    { id: 6 as MenuSection, title: 'Tạo và xuất bản', completed: false },
  ];

  const loaiVanBanOptions = [
    {
      value: 'NGHI_QUYET',
      label: 'Nghị quyết'
    },
    {
      value: 'QUYET_DINH',
      label: 'Quyết định'
    },
    {
      value: 'CHI_THI',
      label: 'Chỉ thị'
    }
  ];

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Xử lý chuyển bước tiếp theo trong wizard
  const handleNext = () => {
    if (currentMenu < 6) {
      const nextStep = (currentMenu + 1) as MenuSection;
      setCurrentMenu(nextStep);
      syncStepInUrl(nextStep);
    }
  };

  const handleBack = () => {
    if (currentMenu > 1) {
      const prevStep = (currentMenu - 1) as MenuSection;
      setCurrentMenu(prevStep);
      syncStepInUrl(prevStep);
    }
  };

  const [promptCommand, setPromptCommand] = useState('Viết tóm tắt 3 đoạn cho nội dung trong draft.');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiElapsedSeconds, setAiElapsedSeconds] = useState(0);

  // Đếm thời gian AI đang tạo nội dung để hiển thị cho người dùng
  useEffect(() => {
    if (!isAiGenerating) {
      setAiElapsedSeconds(0);
      return;
    }

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setAiElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isAiGenerating]);

  const handleComplete = async () => {
    if (!activeSessionUuid) return;

    const requiredFields = [
      { key: 'loaiVanBan', label: 'Loại văn bản', value: formData.loaiVanBan },
      { key: 'tenVanBan', label: 'Tên văn bản', value: formData.tenVanBan },
      { key: 'noiDungChinh', label: 'Nội dung chính', value: formData.noiDungChinh },
    ];

    const missing = requiredFields.filter(
      field => !String(field.value ?? '').trim()
    );

    if (missing.length > 0) {
      const missingNames = missing.map(field => field.label).join(', ');
      alert(`Thiếu thông tin: ${missingNames}`);
      return;
    }

    setIsAiGenerating(true);
    setAiElapsedSeconds(0);
    try {
      const savePayload = {
        sessionUuid: activeSessionUuid,
        editorText: draftMeta?.editorText ?? null,
        formData,
        fieldCode: draftMeta?.fieldCode || 'MAIN_CONTENT',
      };

      const savedDraft = await sessionApi.saveDraft(savePayload);
      console.log('[Draft] saved:', savedDraft);

      const completeResult = await sessionApi.completeSession({
        sessionUuid: activeSessionUuid,
        promptCommand: promptCommand,
        model: 'claude-sonnet-4.6',
      });

      console.log('[Complete] response:', completeResult);

      const wrapper = completeResult?.data ? completeResult.data : completeResult;
      const rawContent = wrapper?.content ?? wrapper?.data?.content;

      const parsedContent =
        typeof rawContent === 'string' && rawContent.trim().startsWith('{')
          ? JSON.parse(rawContent)
          : rawContent;

      setGeneratedDocument(parsedContent ?? '');

      navigate(`/workspace/${activeSessionUuid}`, {
        state: {
          content: parsedContent ?? '',
          title: sessionName ||formData.tenVanBan,
          formData
        }
      });
    } catch (error) {
      console.error('[Complete] failed:', error);
    } finally {
      setIsAiGenerating(false);
    }
  };


  // ========================
  // Lưu draft trước khi mở Workspace để tránh mất dữ liệu[cite: 2]
  const handleOpenWorkspace = async () => {
    if (!activeSessionUuid) {
      alert('Không tìm thấy session');
      return;
    }

    try {
      const payload = {
        sessionUuid: activeSessionUuid,
        editorText: draftMeta?.editorText ?? null,
        formData,
        fieldCode: draftMeta?.fieldCode || 'MAIN_CONTENT',
      };

      const savedDraft = await sessionApi.saveDraft(payload);
      console.log('[Draft] saved before workspace:', savedDraft);

      setDraftMeta(prev => ({
        ...prev,
        status: savedDraft?.status,
        updatedAt: savedDraft?.updatedAt,
        fieldCode: savedDraft?.fieldCode,
        editorText: savedDraft?.editorText ?? prev?.editorText ?? null,
      }));

      // Lấy editorText từ savedDraft (hậu tố mock/real API khác nhau)
      const wrapper = savedDraft?.data ? savedDraft.data : savedDraft;
      const rawContent =
      wrapper?.editorText ?? wrapper?.content ?? generatedDocument ?? '';

      let parsedContentForNav: string | Record<string, any> = rawContent;
      if (typeof rawContent === 'string') {
      const t = rawContent.trim();
      if (t.startsWith('{') || t.startsWith('[')) {
      try {
      parsedContentForNav = JSON.parse(t);
      } catch (err) {
      parsedContentForNav = rawContent; // fallback: dùng raw string
      }
      }
      }

      navigate(`/workspace/${activeSessionUuid}`, {
      state: {
      content: parsedContentForNav ?? '',
      title: sessionName || formData.tenVanBan,
      formData
      }
      });
    } catch (error) {
      console.error('[Draft] save before workspace failed:', error);
      alert('Lưu nháp trước khi mở Workspace không thành công.');
    }
  };


  const handleExampleClick = (value: string) => {
    if (!focusedField) return;

    const fieldMap: Record<string, keyof FormData> = {
      '1': 'tenVanBan',
      '2': 'coQuanChuQuan',
      '3': 'coQuanBanHanh',
      '4': 'diaDanh',
      '5': 'soKyHieu',
      '6': 'kinhGui',
      '7': 'noiNhanBaoCao',
      '8': 'vanBanChiDao',
      '9': 'vanBanPhapLy',
      '10': 'noiDungChinh',
      '11': 'bangBieuSoLieu',
      '12': 'mauVanBan',
      '13': 'deCuongDanY',
      '14': 'vanBanLienQuan',
      '15': 'phongCach',
      '16': 'outputSize',
      '17': 'mucDoHoanChinh',
    };

    const fieldName = fieldMap[focusedField];
    if (fieldName) {
      updateField(fieldName, value);
    }
  };

  return (
    <>
      {isAiGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 px-8 py-7 shadow-2xl">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-600 border-t-blue-400" />
            <div className="mt-4 text-lg font-semibold text-white">Đang gọi AI...</div>
            <div className="mt-1 text-sm text-slate-200">Thời gian xử lý: {aiElapsedSeconds}s</div>
            <div className="mt-1 text-xs text-slate-400">Vui lòng đợi hệ thống hoàn tất phản hồi.</div>
          </div>
        </div>
      )}
    <div className="flex h-full w-full bg-gray-50">
      {/* Left Preview Panel */}
      <div className="flex-[5.5] min-w-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                  <Eye size={16} className="text-gray-600" />
                  <div className="flex items-center gap-3">
                    {!isEditingName ? (
                      <>
                        <h3 className="font-semibold text-gray-900 text-sm">{sessionName || formData.tenVanBan || 'Xem trước văn bản'}</h3>
                        {activeSessionUuid && (
                          <button
                            onClick={() => setIsEditingName(true)}
                            className="text-xs text-gray-500 hover:underline"
                          >
                            Sửa tên
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          value={editingName}
                          onChange={e => setEditingName(e.target.value)}
                          className="px-2 py-1 border rounded text-sm"
                        />
                        <button onClick={handleSaveSessionName} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Lưu</button>
                        <button onClick={() => { setIsEditingName(false); setEditingName(formData.tenVanBan || ''); }} className="px-2 py-1 text-xs text-gray-600">Hủy</button>
                      </div>
                    )}
                  </div>
                </div>
          <button 
          onClick={() => onClose?.()}
          className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700">
            Đóng
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <DocumentPreview formData={formData} />
        </div>
      </div>

      {/* Center Form Content */}
      <div className="flex-[2.5] min-w-0 flex flex-col overflow-hidden bg-white">

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* Menu 1: Thông tin văn bản */}
            {currentMenu === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Menu 1 - Thông tin văn bản</h2>
                  <p className="text-sm text-gray-500">Nhập thông tin cơ bản về văn bản cần soạn thảo</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Loại văn bản <span className="text-red-500">*</span>
                    <TooltipIcon text="Chọn loại văn bản: Nghị quyết, Quyết định, Chỉ thị, Kế hoạch, Báo cáo, Tờ trình, Công văn, Thông báo, v.v..." />
                  </label>
                 <select
                  value={formData.loaiVanBan}
                  onChange={e => updateField('loaiVanBan', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg ..."
                >
                  <option value="">-- Chọn loại văn bản --</option>

                  {loaiVanBanOptions.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Tên văn bản [1] <span className="text-red-500">*</span>
                    <TooltipIcon text="Tên văn bản muốn ban hành" />
                  </label>
                  <input
                    type="text"
                    value={formData.tenVanBan}
                    onChange={e => updateField('tenVanBan', e.target.value)}
                    onFocus={() => setFocusedField('1')}
                    placeholder="Ví dụ: Về việc triển khai nhiệm vụ chính trị năm 2026"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Cơ quan chủ quản [2]
                    <TooltipIcon text="Tổ chức Đảng quản lý cấp trên trực tiếp" />
                  </label>
                  <input
                    type="text"
                    value={formData.coQuanChuQuan}
                    onChange={e => updateField('coQuanChuQuan', e.target.value)}
                    onFocus={() => setFocusedField('2')}
                    placeholder="Ví dụ: Tỉnh ủy, Đảng ủy..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Cơ quan ban hành [3]
                    <TooltipIcon text="Chọn File trong các File đã lưu hoặc tạo mới đơn vị ban hành văn bản (Quy định 399/QĐTW)" />
                  </label>
                  <input
                    type="text"
                    value={formData.coQuanBanHanh}
                    onChange={e => updateField('coQuanBanHanh', e.target.value)}
                    onFocus={() => setFocusedField('3')}
                    placeholder="Ví dụ: Ban Thường vụ Tỉnh ủy..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Địa danh [4]
                    <TooltipIcon text="Địa danh nơi ban hành văn bản" />
                  </label>
                  <input
                    type="text"
                    value={formData.diaDanh}
                    onChange={e => updateField('diaDanh', e.target.value)}
                    onFocus={() => setFocusedField('4')}
                    placeholder="Ví dụ: Hà Nội, TP. HCM..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Ngày ban hành
                    <TooltipIcon text="Ngay/tháng/năm" />
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.ngayBanHanh}
                      onChange={e => updateField('ngayBanHanh', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white"
                    />
                    <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Số, ký hiệu văn bản [5]
                    <TooltipIcon text="Số văn bản. Ký hiệu" />
                  </label>
                  <input
                    type="text"
                    value={formData.soKyHieu}
                    onChange={e => updateField('soKyHieu', e.target.value)}
                    onFocus={() => setFocusedField('5')}
                    placeholder="Ví dụ: 123-KH/TU"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Kinh gửi / Nơi nhận chính [6]
                    <TooltipIcon text="Cơ quan, đơn vị, cá nhân nhận văn bản" />
                  </label>
                  <textarea
                    value={formData.kinhGui}
                    onChange={e => updateField('kinhGui', e.target.value)}
                    onFocus={() => setFocusedField('6')}
                    placeholder="Ví dụ: Các ban Đảng, các đơn vị trực thuộc..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Nơi nhận (báo cáo / biết / thực hiện) [7]
                    <TooltipIcon text="Nơi nhận (báo cáo / biết / thực hiện)" />
                  </label>
                  <textarea
                    value={formData.noiNhanBaoCao}
                    onChange={e => updateField('noiNhanBaoCao', e.target.value)}
                    onFocus={() => setFocusedField('7')}
                    placeholder="Ví dụ: Để biết, để thực hiện..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Người ký
                    <TooltipIcon text="Chức danh, Họ và tên" />
                  </label>
                  <input
                    type="text"
                    value={formData.nguoiKy}
                    onChange={e => updateField('nguoiKy', e.target.value)}
                    placeholder="Ví dụ: Bí thư Tỉnh ủy..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Menu 2: Văn bản chỉ đạo */}
            {currentMenu === 2 && (
              <div className="space-y-6">
                <div className="border-b border-red-200 pb-3">
                  <h2 className="text-lg font-bold text-gray-700">Menu 2: Văn bản chỉ đạo</h2>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Văn bản chỉ đạo trực tiếp [8]
                    <TooltipIcon text="Upload tối đa 5 file văn bản chỉ đạo hoặc nhập nội dung" />
                  </label>
                  <FileUploadZone
  maxFiles={5}
  category="DIRECTIVE"
  sessionUuid={activeSessionUuid}
  fieldCode="DIRECTIVE"
  files={filesMap.DIRECTIVE}
  onFilesChange={(newFiles: UploadingFile[] | ((prev: UploadingFile[]) => UploadingFile[])) =>
    setFilesMap(prev => ({
      ...prev,
      DIRECTIVE: typeof newFiles === 'function' ? newFiles(prev.DIRECTIVE) : newFiles
    }))
  }
/>

                  <textarea
                    value={formData.vanBanChiDao}
                    onChange={e => updateField('vanBanChiDao', e.target.value)}
                    onFocus={() => setFocusedField('8')}
                    placeholder="Yêu cầu: sử dụng văn bản này để  làm gì?"
                    rows={6}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Văn bản pháp lý [9]
                    <TooltipIcon text="Căn cứ liên quan" />
                  </label>
                  {/* Văn bản pháp lý */}
                    <FileUploadZone
  maxFiles={5}
  category="LEGAL"
  sessionUuid={activeSessionUuid}
  fieldCode="LEGAL_BASIS"
  files={filesMap.LEGAL}
  onFilesChange={(newFiles: UploadingFile[] | ((prev: UploadingFile[]) => UploadingFile[])) =>
    setFilesMap(prev => ({
      ...prev,
      LEGAL: typeof newFiles === 'function' ? newFiles(prev.LEGAL) : newFiles
    }))
  }
/>
                  <textarea
                    value={formData.vanBanPhapLy}
                    onChange={e => updateField('vanBanPhapLy', e.target.value)}
                    onFocus={() => setFocusedField('9')}
                    placeholder="Sử dụng văn bản này để làm gì?"
                    rows={6}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* Menu 3: Nội dung, kết quả thực hiện */}
            {currentMenu === 3 && (
              <div className="space-y-6">
                <div className="border-b border-red-200 pb-3">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Menu 3 - Nội dung, kết quả thực hiện</h2>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Nội dung chính [10] <span className="text-red-500">*</span>
                    <TooltipIcon text="Nhập nội dung chính của văn bản hoặc upload file" />
                  </label>
 <FileUploadZone
  category="CONTENT"
  sessionUuid={activeSessionUuid}
  fieldCode={getFieldCodeByCategory("CONTENT")}
  files={filesMap.CONTENT}
  onFilesChange={(newFiles: UploadingFile[] | ((prev: UploadingFile[]) => UploadingFile[])) =>
    setFilesMap(prev => ({
      ...prev,
      CONTENT: typeof newFiles === 'function' ? newFiles(prev.CONTENT) : newFiles
    }))
  }
  multiple
/>
                  <textarea
                    value={formData.noiDungChinh}
                    onChange={e => updateField('noiDungChinh', e.target.value)}
                    onFocus={() => setFocusedField('10')}
                    placeholder="Trình bày Nội dung chính / kết quả thực hiện"
                    rows={8}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white resize-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Tài liệu minh chứng [11]
                    <TooltipIcon text="Tài liệu minh chứng cho nội dung (phụ lục, bảng biểu, ảnh...)" />
                  </label>
                  <FileUploadZone
  acceptedTypes=".txt,.doc,.docx,.pdf,.xls"
  category="EVIDENCE"
  sessionUuid={activeSessionUuid}
  fieldCode={getFieldCodeByCategory("EVIDENCE")}
  files={filesMap.EVIDENCE}
  onFilesChange={(newFiles: UploadingFile[] | ((prev: UploadingFile[]) => UploadingFile[])) =>
    setFilesMap(prev => ({
      ...prev,
      EVIDENCE: typeof newFiles === 'function' ? newFiles(prev.EVIDENCE) : newFiles
    }))
  }
  multiple
/>
                  <textarea
                    value={formData.bangBieuSoLieu}
                    onChange={e => updateField('bangBieuSoLieu', e.target.value)}
                    onFocus={() => setFocusedField('11')}
                    placeholder="Xác định cách thức AI khai thác tệp văn bản pháp lý luận cứ vững chắc, bám sát luật hiện hành"
                    rows={4}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white resize-none"
                  />
                </div>
              </div>
            )}

            {/* Menu 4: Mẫu văn bản */}
            {currentMenu === 4 && (
              <div className="space-y-6">
                <div className="border-b border-red-200 pb-3">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Menu 4 - Mẫu văn bản</h2>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Mẫu văn bản áp dụng [12]
                    <TooltipIcon text="Upload file mẫu hoặc nhập nội dung mẫu tham khảo" />
                  </label>
                  <FileUploadZone
  category="TEMPLATE"
  sessionUuid={activeSessionUuid}
  fieldCode={getFieldCodeByCategory("TEMPLATE")}
  files={filesMap.TEMPLATE}
  onFilesChange={(newFiles: UploadingFile[] | ((prev: UploadingFile[]) => UploadingFile[])) =>
    setFilesMap(prev => ({
      ...prev,
      TEMPLATE: typeof newFiles === 'function' ? newFiles(prev.TEMPLATE) : newFiles
    }))
  }
  multiple
/>
                  <textarea
                    value={formData.mauVanBan}
                    onChange={e => updateField('mauVanBan', e.target.value)}
                    onFocus={() => setFocusedField('12')}
                    placeholder="Yêu cầu: sử dụng nội dung nào làm mẫu?"
                    rows={8}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white resize-none"
                  />
                </div>
                
              <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Chọn Đề cương; Dàn ý văn bản [13]
                    <TooltipIcon text="Upload file mẫu hoặc nhập nội dung mẫu tham khảo" />
                  </label>
                  <FileUploadZone
                      category="TEMPLATE"
                      sessionUuid={activeSessionUuid}
                      fieldCode={getFieldCodeByCategory("TEMPLATE")}
                      files={filesMap.TEMPLATE}
                      onFilesChange={(newFiles: UploadingFile[] | ((prev: UploadingFile[]) => UploadingFile[])) => 
                        setFilesMap(prev => ({ 
                          ...prev, 
                          TEMPLATE: typeof newFiles === 'function' ? newFiles(prev.TEMPLATE) : newFiles 
                        }))
                      }
                      multiple
                    />
                  <textarea
                    value={formData.deCuongDanY}
                    onChange={e => updateField('deCuongDanY', e.target.value)}
                    onFocus={() => setFocusedField('13')}
                    placeholder="Yêu cầu: sử dụng nội dung nào làm mẫu?"
                    rows={8}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white resize-none"
                  />
                </div>


              </div>
            )}

            {/* Menu 5: Văn bản liên quan */}
            {currentMenu === 5 && (
              <div className="space-y-6">
                <div className="border-b border-red-200 pb-3">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Menu 5 - Văn bản liên quan</h2>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Văn bản / Tài liệu liên quan [14]
                    <TooltipIcon text="Yêu cầu theo từng văn bản dùng để làm gì?" />
                  </label>
                  <FileUploadZone
  multiple
  maxFiles={150}
  category="RELATED"
  sessionUuid={activeSessionUuid}
  fieldCode="REFERENCE"
  files={filesMap.RELATED}
  onFilesChange={(newFiles: UploadingFile[] | ((prev: UploadingFile[]) => UploadingFile[])) =>
    setFilesMap(prev => ({
      ...prev,
      RELATED: typeof newFiles === 'function' ? newFiles(prev.RELATED) : newFiles
    }))
  }
/>
                    <textarea
                    value={formData.vanBanLienQuan}
                    onChange={e => updateField('vanBanLienQuan', e.target.value)}
                    onFocus={() => setFocusedField('14')}
                    placeholder="Yêu cầu: sử dụng nội dung nào làm mẫu?"
                    rows={8}
                    className="w-full mt-3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white resize-none"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">Tùy chọn kiểm tra</h3>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.taophuluc}
                      onChange={e => updateField('taophuluc', e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-700 group-hover:text-gray-900">Tạo phụ lục tổng hợp kèm theo văn bản</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.doiChieu}
                      onChange={e => updateField('doiChieu', e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-700 group-hover:text-gray-900">Đối chiếu</div>
                      <div className="text-xs text-gray-500 mt-0.5">Kiểm tra sự thống nhất với văn bản liên quan</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.bamCanCu}
                      onChange={e => updateField('bamCanCu', e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-700 group-hover:text-gray-900">Bám căn cứ</div>
                      <div className="text-xs text-gray-500 mt-0.5">Đảm bảo tuân thủ các căn cứ pháp lý</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.theThucc}
                      onChange={e => updateField('theThucc', e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-700 group-hover:text-gray-900">Thể thức</div>
                      <div className="text-xs text-gray-500 mt-0.5">Kiểm tra thể thức văn bản theo quy chuẩn</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Menu 6: Tạo và xuất bản */}
            {currentMenu === 6 && (
              <div className="space-y-6">
                <div className="border-b border-red-200 pb-3">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    Menu 6 - Tạo và xuất bản
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mô hình AI
                  </label>

                  <select
                    value={formData.selectedModel}
                    onChange={e => updateField('selectedModel', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900 bg-white"
                  >
                    <option value="claude-sonnet-4.6">
                      Claude Sonnet 4.6 (Khuyến nghị)
                    </option>

                    <option value="gpt-5.4-mini">
                      GPT-5.4 Mini
                    </option>

                    <option value="deepseek-v4-flash">
                      DeepSeek V4 Flash
                    </option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Phong cách trình bày [15]
                    <TooltipIcon text="Sử dụng văn phong chính luận - hành chính Đảng" />
                  </label>

                  <input
                    type="text"
                    value={formData.phongCach}
                    onChange={e => updateField('phongCach', e.target.value)}
                    onFocus={() => setFocusedField('15')}
                    placeholder="Ví dụ: Trang trọng, chính thống..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Độ dài văn bản đầu ra [16]
                    <TooltipIcon text="Chỉ định độ dài văn bản mong muốn" />
                  </label>

                  <input
                    type="text"
                    value={formData.outputSize}
                    onChange={e => updateField('outputSize', e.target.value)}
                    onFocus={() => setFocusedField('16')}
                    placeholder="Ví dụ: Ngắn gọn (1-2 trang), Trung bình..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    Mức độ hoàn chỉnh [17]
                    <TooltipIcon text="Trạng thái văn bản đầu ra" />
                  </label>

                  <select
                    value={formData.mucDoHoanChinh}
                    onChange={e => updateField('mucDoHoanChinh', e.target.value)}
                    onFocus={() => setFocusedField('17')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-900 bg-white"
                  >
                    <option value="">
                      -- Chọn mức độ --
                    </option>

                    <option value="ban-thao">
                      Bản thảo sơ bộ
                    </option>

                    <option value="hoan-chinh">
                      Hoàn chỉnh
                    </option>
                  </select>
                </div>

                {fileStats.total > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-xs font-semibold text-slate-700 mb-2">
                      Trạng thái tải file
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-slate-600">
                          Thành công: {fileStats.success}
                        </span>
                      </div>

                      {fileStats.uploading > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          <span className="text-slate-600">
                            Đang tải: {fileStats.uploading}
                          </span>
                        </div>
                      )}

                      {fileStats.failed > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span className="text-slate-600">
                            Thất bại: {fileStats.failed}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <CreditEstimator
                  inputText={combinedInputText}
                  uploadedFiles={allUploadedFiles}
                  selectedModel={formData.selectedModel}
                  outputSize={formData.outputSize}
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                  <div className="flex items-start gap-3">
                    <Sparkles
                      size={20}
                      className="text-blue-600 flex-shrink-0 mt-0.5"
                    />

                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm mb-2">
                        {isDraft
                          ? 'Sẵn sàng tạo văn bản'
                          : 'Văn bản đã được tạo'}
                      </h4>

                      <p className="text-xs text-blue-700 leading-relaxed">
                        {isDraft
                          ? 'AI sẽ phân tích thông tin và tạo văn bản hoàn chỉnh theo quy chuẩn Đảng.'
                          : 'Nội dung AI đã được tạo. Bạn có thể mở Workspace để tiếp tục chỉnh sửa hoặc xuất file Word.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 bg-white px-8 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentMenu === 1}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentMenu === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            <ArrowLeft size={16} />
            Quay lại
          </button>

          <div className="text-xs text-gray-500">
            Bước {currentMenu} / 6
          </div>

          {/* Khu vực xử lý các nút bấm bên phải */}
          <div className="flex items-center gap-3">
            {currentMenu === 6 ? (
              <>
                {/* 📥 NÚT MỚI THÊM: Xuất file Word dang dở gửi về Backend */}
                <button
                  onClick={async () => {
                    if (!activeSessionUuid) {
                      alert('Không tìm thấy session');
                      return;
                    }

                    try {
                    const response = await fileApi.exportWordDraft({
                      sessionUuid: activeSessionUuid,
                      exportFormat: 'WORD',
                    });

                    const blob = response.data;
                    const disposition = response.headers['content-disposition'] || '';
                    const fileNameMatch = disposition.match(/filename="(.+?)"/);
                    const fileName = fileNameMatch?.[1] ?? `${formData.tenVanBan || 'Van_Ban_Dang_Do'}.docx`;

                    const downloadUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(downloadUrl);

                    alert('Đã xuất file Word thành công!');
                  } catch (error) {
                    console.error('Lỗi khi gọi API xuất file Word:', error);
                    alert('Có lỗi xảy ra khi xuất file Word!');
                  }
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 text-gray-700 bg-green-300 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Upload
                    size={16}
                    className="rotate-180 text-gray-500"
                  />
                  Xuất file Word
                </button>

                {/* Nút Hoàn tất cũ của bạn */}
                {isDraft ? (
                    <button
                      onClick={handleComplete}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md"
                    >
                      <Sparkles size={16} />
                      Hoàn tất / Tạo nội dung
                    </button>
                  ) : isEditing ? (
                    <button
                      onClick={handleOpenWorkspace}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md"
                    >
                      <Sparkles size={16} />
                      Chuyển tới Workspace
                    </button>
                  ) : null}
                </>
              ) : (
              /* Nút Tiếp tục tại các bước 1-5 */
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Tiếp tục
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Contextual Help Panel */}
      <ContextualHelpPanel
        focusedField={focusedField}
        onExampleClick={handleExampleClick}
      />
    </div>
    </>
  );
}

/* Helper Functions[cite: 2] */

function generateDocumentContent(formData: FormData): string {
  const date = new Date(formData.ngayBanHanh);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="font-size: 11pt; font-weight: bold; margin-bottom: 8px;">${formData.coQuanBanHanh || '[CƠ QUAN BAN HÀNH]'}</div>
      <div style="font-size: 12pt; font-weight: bold; margin-bottom: 4px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
      <div style="font-size: 11pt; margin-bottom: 4px;">Độc lập - Tự do - Hạnh phúc</div>
      <div style="border-bottom: 1px solid #000; width: 120px; margin: 8px auto;"></div>
      <div style="font-size: 10pt; font-style: italic; color: #666;">${formData.diaDanh || 'Hà Nội'}, ngày ${day} tháng ${month} năm ${year}</div>
    </div>

    <div style="margin-bottom: 16px;">
      <div style="font-size: 11pt; font-weight: 600;">Số: ${formData.soKyHieu || '01/BC-XXX'}</div>
    </div>

    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="font-size: 14pt; font-weight: bold; margin-bottom: 8px; text-transform: uppercase;">${formData.loaiVanBan || 'BÁO CÁO'}</h1>
      <div style="font-size: 12pt;">Về việc ${formData.tenVanBan || '___________'}</div>
      <div style="border-bottom: 1px solid #000; width: 80px; margin: 12px auto;"></div>
    </div>

    <div style="margin-bottom: 24px;">
      ${formData.kinhGui ? `<p style="text-indent: 40px; margin-bottom: 16px;">Kính gửi: ${formData.kinhGui}</p>` : ''}

      ${formData.noiDungChinh ? `
        <p style="text-indent: 40px; margin-bottom: 16px; white-space: pre-wrap;">${formData.noiDungChinh}</p>
      ` : `
        <p style="text-indent: 40px; margin-bottom: 16px;">
          Thực hiện chỉ đạo của ${formData.coQuanChuQuan || '[Cơ quan chủ quản]'}, ${formData.coQuanBanHanh || '[Đơn vị]'} báo cáo kết quả thực hiện nhiệm vụ như sau:
        </p>

        <p style="font-weight: bold; margin-top: 24px; margin-bottom: 12px;">I. TÌNH HÌNH CHUNG</p>
        <p style="text-indent: 40px; margin-bottom: 16px;">
          [Nội dung sẽ được AI tạo dựa trên dữ liệu bạn cung cấp. Bạn có thể chỉnh sửa trực tiếp hoặc yêu cầu AI tinh chỉnh...]
        </p>

        <p style="font-weight: bold; margin-top: 24px; margin-bottom: 12px;">II. KẾT QUẢ ĐẠT ĐƯỢC</p>
        <p style="text-indent: 40px; margin-bottom: 16px;">
          [Nội dung chi tiết về kết quả thực hiện...]
        </p>

        <p style="font-weight: bold; margin-top: 24px; margin-bottom: 12px;">III. NHỮNG TỒN TẠI, HẠN CHẾ</p>
        <p style="text-indent: 40px; margin-bottom: 16px;">
          [Phân tích những khó khăn, hạn chế trong quá trình thực hiện...]
        </p>

        <p style="font-weight: bold; margin-top: 24px; margin-bottom: 12px;">IV. PHƯƠNG HƯỚNG NHIỆM VỤ THỜI GIAN TỚI</p>
        <p style="text-indent: 40px; margin-bottom: 16px;">
          [Đề xuất phương hướng, nhiệm vụ, giải pháp thời gian tới...]
        </p>
      `}

      ${formData.noiNhanBaoCao ? `
        <div style="margin-top: 32px;">
          <p style="font-weight: bold; margin-bottom: 8px;">Nơi nhận:</p>
          <p style="white-space: pre-wrap; font-size: 10.5pt;">${formData.noiNhanBaoCao}</p>
        </div>
      ` : ''}
    </div>

    <div style="margin-top: 48px; text-align: right;">
      <div style="font-weight: bold; margin-bottom: 4px;">${formData.nguoiKy || '[Chức danh người ký]'}</div>
      <div style="margin-top: 60px; font-weight: bold;">[Họ và tên]</div>
    </div>
  `;
}

/* Helper Components[cite: 2] */

function DocumentPreview({ formData }: { formData: any }) {
  // Hàm format ngày tháng năm an toàn để tránh crash nếu formData.ngayBanHanh chưa được nạp
  function formatNgayBanHanh(rawDate: string, diaDanh?: string) {
    if (!rawDate) return '[Địa danh], ngày ... tháng ... năm ...';

    const match = rawDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) {
      return rawDate;
    }

    const [, dd, mm, yyyy] = match;
    return `${diaDanh || '[Địa danh]'}, ngày ${parseInt(dd, 10)} tháng ${mm} năm ${yyyy}`;
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-12 bg-white min-h-full border border-gray-200/50 shadow-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* ── 🏛️ HEADER CHIA ĐÔI THEO CHUẨN THỂ THỨC VĂN KIỆN ĐẢNG ── */}
      <div className="grid grid-cols-2 gap-4 items-start mb-8 text-sm">
        
        {/* KHỐI BÊN TRÁI: Cơ quan chủ quản, Cơ quan ban hành & Số hiệu */}
        <div className="text-center uppercase">
          <div className="text-xs font-medium text-gray-500 tracking-wide">
            {formData.coQuanChuQuan || '[CƠ QUAN CHỦ QUẢN]'}
          </div>
          <div className="text-xs font-bold text-gray-800 mt-0.5 tracking-tight">
            {formData.coQuanBanHanh || '[CƠ QUAN BAN HÀNH]'}
          </div>
          <div className="w-24 h-px bg-gray-300 mx-auto mt-2" />
          
          {/* Di chuyển Số ký hiệu xuống dưới khối Cơ quan ban hành đúng chuẩn */}
          <div className="text-[11px] font-medium text-gray-600 normal-case mt-2">
            Số: {formData.soKyHieu || '01-QĐ/TW'}
          </div>
        </div>

        {/* KHỐI BÊN PHẢI: Tiêu ngữ Đảng & Định danh ngày tháng */}
        <div className="text-center">
          <div className="text-xs font-bold text-gray-900 uppercase tracking-widest">
            ĐẢNG CỘNG SẢN VIỆT NAM
          </div>
          <div className="w-32 h-px bg-gray-400 mx-auto mt-2 mb-2" />
          
          {/* Định danh vị trí nằm ngay bên dưới tiêu ngữ Đảng */}
          <div className="text-xs text-gray-500 italic">
            {formatNgayBanHanh(formData.ngayBanHanh, formData.diaDanh)}
          </div>
        </div>
      </div>

      {/* ── 📝 TIÊU ĐỀ VĂN BẢN (GIỮ NGUYÊN HOẶC TINH CHỈNH SẠCH) ── */}
      <div className="text-center mb-8">
        <h1 className="text-base font-bold text-gray-900 mb-1 tracking-tight uppercase">
          {formData.loaiVanBan || 'THÔNG BÁO'}
        </h1>
        <div className="text-sm font-medium text-gray-700">
          Về việc {formData.tenVanBan || '___________'}
        </div>
        <div className="w-16 h-px bg-gray-900 mx-auto mt-2" />
      </div>
      {/* Kính gửi */}
      <div className="text-left">
            <span className="font-bold text-gray-900 block mb-1">Kính gửi:</span>
            <div className="ml-3 text-xs text-gray-700 font-medium whitespace-pre-line leading-relaxed">
              {formData.kinhGui || '- Như trên;\n- Lưu văn phòng.'}
            </div>
      </div>

      {/* ── 💬 NỘI DUNG VĂN BẢN ── */}
      <div className="space-y-4 text-sm leading-relaxed text-gray-800">
        

        {formData.noiDungChinh ? (
          <div className="mt-6 border-t border-gray-50 pt-4">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-[14px]">
              {formData.noiDungChinh}
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-center py-12 italic text-xs bg-gray-50/50 rounded-xl border border-dashed border-gray-200 mt-6">
            ✨ Hệ thống Trợ lý AI đang chờ nạp thông tin để tự động sinh cấu trúc văn bản...
          </div>
        )}

        {/* ── 📝 PHẦN CUỐI VĂN BẢN: CẤU HÌNH NƠI NHẬN VÀ CHỮ KÝ NGANG NHAU ── */}
        <div className="grid grid-cols-2 gap-4 items-start mt-12 text-sm">
          
          {/* ⬅️ CỘT BÊN TRÁI: KHU VỰC NƠI NHẬN */}
          <div className="text-left">
            <span className="font-bold text-gray-900 block mb-1">Nơi nhận:</span>
            <div className="ml-3 text-xs text-gray-700 font-medium whitespace-pre-line leading-relaxed">
              {formData.noiNhanBaoCao || '- Như trên;\n- Lưu văn phòng.'}
            </div>
          </div>

          {/* ➡️ CỘT BÊN PHẢI: KHU VỰC CHỮ KÝ VÀ HỌ TÊN CÁN BỘ */}
          <div className="flex justify-end">
            <div className="text-center min-w-[220px]">
              {/* Chức vụ người ký viết hoa, đậm */}
              <div className="font-bold text-gray-900 uppercase tracking-tight">
                {formData.chucVuNguoiKy || '[CHỨC VỤ LÃNH ĐẠO]'}
              </div>
              
              {/* Chỉ dẫn ký tên */}
              <div className="text-[11px] text-gray-400 italic mt-1.5 mb-14">
                (Ký, ghi rõ họ tên)
              </div>
              
              {/* Họ tên người ký nằm dưới cùng */}
              <div className="font-bold text-gray-800 tracking-wide text-[14px]">
                {formData.hoTenNguoiKy || '[Họ và tên]'}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

// suggestion 
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

function FileUploadZone({
  multiple = false,
  maxFiles = 5,
  acceptedTypes = '.txt,.doc,.docx,.pdf,.xls,.xlsx',
  category,
  files = [],
  sessionUuid,
  fieldCode,
  onFilesChange
}: {
  multiple?: boolean;
  maxFiles?: number;
  acceptedTypes?: string;
  category: FileCategory;
  sessionUuid?: string | null;
  fieldCode?: string;
  files: UploadingFile[];
  onFilesChange: React.Dispatch<React.SetStateAction<UploadingFile[]>> | ((files: UploadingFile[]) => void);
}) {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const currentCount = files.length;
    const availableSlots = maxFiles - currentCount;
    const filesToAdd = selectedFiles.slice(0, availableSlots);

    if (filesToAdd.length === 0) {
      alert(`Đã đạt giới hạn tối đa ${maxFiles} file`);
      return;
    }
    
    
    const newUploadingFiles: UploadingFile[] = filesToAdd.map((file, index) => ({
      id: `tmp_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
      file: file,
      progress: 0,
      status: 'PENDING'
    }));


    // Bọc logic cập nhật tương thích với cấu trúc cha Map mới
    const updateHook = (updater: any) => {
      if (typeof onFilesChange === 'function' && onFilesChange.prototype === undefined) {
        const nextFiles = typeof updater === 'function' ? updater(files) : updater;
        (onFilesChange as (files: UploadingFile[]) => void)(nextFiles);
      }
    };

    const nextFiles = [...files, ...newUploadingFiles];

    if (typeof onFilesChange === 'function') {
      try {
        (onFilesChange as React.Dispatch<React.SetStateAction<UploadingFile[]>>)(
          (prev: UploadingFile[]) => [...prev, ...newUploadingFiles]
        );
      } catch (err) {
        console.warn("onFilesChange không phải useState Setter, buộc phải gửi mảng thô.", err);
        (onFilesChange as (files: UploadingFile[]) => void)(nextFiles);
      }
    }
    

    function safelyUpdateFiles(
      handler: React.Dispatch<React.SetStateAction<UploadingFile[]>> | ((files: UploadingFile[]) => void),
      updateFn: (prev: UploadingFile[]) => UploadingFile[]
    ) {
      // Chúng ta kiểm tra gián tiếp: Bản chất React useState Setter cho phép nhận hàm làm tham số.
      // Nhưng nếu đây là một hàm callback nghiệp vụ thông thường từ Cha truyền xuống,
      // chúng ta bắt buộc phải lấy giá trị hiện tại ra, tính toán mảng mới rồi mới truyền đi.
      
      try {
        // Giả định đây là React useState Setter (Bật functional update dạng prev => ...)
        // Chúng ta truyền trực tiếp hàm updateFn vào.
        (handler as Function)(updateFn);
      } catch (error) {
        // Nếu xảy ra lỗi hoặc nếu đây là hàm callback thuần túy không hỗ trợ functional update,
        // Bạn cần đảm bảo hàm handler nhận mảng thô (updatedFilesArray).
        // Lưu ý: Cách này tối ưu nhất khi handler là useState Setter để tránh Stale State trong vòng lặp Async.
        console.warn("onFilesChange không phải là một useState Setter, chuyển hướng xử lý mảng thô.");
      }
    }

    // Upload each new file to the server and update its status accordingly.
    newUploadingFiles.forEach((fileItem) => {
      uploadFileToServer(
        fileItem,
        category,
        sessionUuid,
        fieldCode,
        (fileId, progress) => {
          if (typeof onFilesChange === 'function') {
            safelyUpdateFiles(onFilesChange, (prev) =>
              prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
            );
          }
        },
        (fileId, status, backendFileId, error) => {
          if (typeof onFilesChange === 'function') {
            safelyUpdateFiles(onFilesChange, (prev) =>
              prev.map((f) =>
                f.id === fileId ? { ...f, status, backendFileId, error } : f
              )
            );
          }
        }
      );
    });

  e.target.value = '';
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;

    const input = document.createElement('input');
    input.type = 'file';
    const dataTransfer = new DataTransfer();
    droppedFiles.forEach(file => dataTransfer.items.add(file));
    input.files = dataTransfer.files;

    handleFileInput({ target: input } as any);
  };

  const removeFile = async (fileItem: UploadingFile, index: number) => {
    if (fileItem.status === 'SUCCESS' && fileItem.backendFileId) {
      await deleteFileFromServer(fileItem.backendFileId);
    }

    const newFiles = files.filter((_, i) => i !== index);
    if (typeof onFilesChange === 'function') {
      onFilesChange(newFiles);
    }
  };
  
  return (
    <div>
      <label
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer block"
      >
        <input
          type="file"
          multiple={multiple}
          accept={acceptedTypes}
          onChange={handleFileInput}
          className="hidden"
        />
        <Upload size={32} className="mx-auto text-gray-400 mb-3" />
        <p className="text-sm font-medium text-gray-700 mb-1">
          Kéo thả file vào đây hoặc click để chọn
        </p>
        <p className="text-xs text-gray-500">
          {multiple && `Hỗ trợ nhiều file (tối đa ${maxFiles}) • `}
          {acceptedTypes}
        </p>
        {files.length > 0 && (
          <p className="text-xs text-blue-600 mt-1 font-medium">
            Đã tải: {files.filter(f => f.status === 'SUCCESS').length}/{files.length}
          </p>
        )}
      </label>

      {files.length > 0 && (
        <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
          {files.map((fileItem, index) => (
            <div key={fileItem.id} className="flex flex-col p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <File size={14} className={`flex-shrink-0 ${
                    fileItem.status === 'SUCCESS' ? 'text-green-600' :
                    fileItem.status === 'FAILED' ? 'text-red-500' :
                    'text-blue-600'
                  }`} />
                  <span className="font-medium text-slate-700 truncate">{fileItem.file.name}</span>
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {(fileItem.file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  onClick={() => removeFile(fileItem, index)}
                  className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-red-600 transition-colors ml-2"
                  disabled={fileItem.status === 'UPLOADING'}
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${
                  fileItem.status === 'SUCCESS' ? 'text-green-600' :
                  fileItem.status === 'FAILED' ? 'text-red-500' :
                  fileItem.status === 'UPLOADING' ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {fileItem.status === 'SUCCESS' && '✓ Đã lên hệ thống'}
                  {fileItem.status === 'UPLOADING' && `Đang tải... ${fileItem.progress}%`}
                  {fileItem.status === 'FAILED' && `✕ Lỗi: ${fileItem.error || 'Upload failed'}`}
                  {fileItem.status === 'PENDING' && 'Chờ tải...'}
                </span>

                {fileItem.backendFileId && (
                  <span className="text-xs text-gray-400 font-mono">ID: {fileItem.backendFileId.slice(0, 12)}...</span>
                )}
              </div>

              {fileItem.status === 'UPLOADING' && (
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-blue-600 h-full transition-all duration-200"
                    style={{ width: `${fileItem.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}