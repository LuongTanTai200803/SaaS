import { useState, useEffect } from 'react';
import {
  User, CreditCard, FileText, Share2, Copy, Check,
  Pencil, Trash2, ChevronRight, TrendingUp, Users,
  Calendar, LogOut, Bell, Settings, ExternalLink,
  Award, BarChart3, Link2, DollarSign, Zap, 
} from 'lucide-react';
import CharAt from './CharAt';
import api from '../api'; // Import đối tượng 'api' tổng hợp
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { UserProfile, Document, CreditSummary,  UpdateProfilePayload} from '../api/userApi'; // Giữ lại các kiểu dữ liệu cần thiết

type DashTab = 'profile' | 'subscription' | 'history' | 'affiliate';

// TODO: API for these stats is missing in the spec. Using mock data for now.
const affiliateStats = [
  { label: 'Người giới thiệu', value: '12', icon: <Users size={18} />, color: 'text-blue-600 bg-blue-50' },
  { label: 'Đã thanh toán', value: '8', icon: <Check size={18} />, color: 'text-green-600 bg-green-50' },
  { label: 'Thu nhập tạm tính', value: '0đ', icon: <DollarSign size={18} />, color: 'text-amber-600 bg-amber-50' },
  { label: 'Tỷ lệ chuyển đổi', value: '66%', icon: <TrendingUp size={18} />, color: 'text-purple-600 bg-purple-50' },
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashTab>('profile');
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const affiliateLink = profile?.affiliate?.link ?? '';

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.dispatchEvent(new Event('auth-changed'));
    window.location.href = '/';
  };

  const tabs: { key: DashTab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: 'Thông tin tài khoản', icon: <User size={16} /> },
    { key: 'subscription', label: 'Gói dịch vụ & Credit', icon: <CreditCard size={16} /> },
    { key: 'history', label: 'Lịch sử văn bản', icon: <FileText size={16} /> },
    { key: 'affiliate', label: 'Hệ thống Affiliate', icon: <Share2 size={16} /> },
  ];

  const [creditSummary, setCreditSummary] = useState<CreditSummary | null>(null);
  const [subscriptionTab, setSubscriptionTab] = useState<'plan' | 'credit'>('plan');

  const formatDate = (value?: string | null) => {
  if (!value) return 'Chưa có';
    return new Date(value).toLocaleDateString('vi-VN');
  };

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    fullName: '',
    agency: '',
    phone: '',
    position: '',
  });

  const profileFields: Array<{
    key: 'fullName' | 'email' | 'agency' | 'phone' | 'position' | 'created_at';
    label: string;
    value: string;
    editable?: boolean;
  }> = profile
    ? [
        { key: 'fullName', label: 'Họ và tên', value: profile.fullName, editable: true },
        { key: 'email', label: 'Email', value: profile.email, editable: false },
        { key: 'agency', label: 'Đơn vị công tác', value: profile.agency, editable: true },
        { key: 'phone', label: 'Số điện thoại', value: profile.phone || 'Chưa cập nhật', editable: true },
        { key: 'position', label: 'Chức vụ', value: profile.position || 'Chưa cập nhật', editable: true },
        { key: 'created_at', label: 'Ngày tham gia', value: formatDate(profile.created_at), editable: false },
      ]
    : [];

  // Handlers for editing the user profile
  const handleProfileEditStart = () => {
  if (!profile) return;
    setEditedProfile({
      fullName: profile.fullName,
      agency: profile.agency,
      phone: profile.phone ?? '',
      position: profile.position ?? '',
    });
    setIsEditingProfile(true);
  };

  const handleProfileInputChange = (
    field: 'fullName' | 'agency' | 'phone' | 'position',
    value: string
  ) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  // Handler for saving the edited user profile
  const handleProfileSave = async () => {
    if (!profile) return;

    try {
      const payload: UpdateProfilePayload = {
        fullName: (editedProfile.fullName || profile.fullName).trim(),
        agency: (editedProfile.agency || profile.agency).trim(),
        phone: (editedProfile.phone ?? '').trim() || null,
        position: (editedProfile.position ?? '').trim() || null,
      };

      const response = await api.userApi.updateProfile(payload);
      if (!response.success) {
        setError(response.message);
        return;
      }
      const newProfile = (response && response.data) ? response.data : response;

      setProfile(newProfile); // updatedProfile is UserProfile
      setIsEditingProfile(false);
      setEditedProfile({ fullName: '', agency: '', phone: '', position: '' });
      setError(null);
    } catch (err) {
      console.error('Failed to update profile', err);
      setError('Không thể cập nhật hồ sơ.');
    }
  };

  const handleProfileCancel = () => {
    setEditedProfile({ fullName: '', agency: '', phone: '', position: '' });
    setIsEditingProfile(false);
  };
  
  // Fetch initial data for the dashboard (profile, documents, credit summary)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [profileData, documentsData, creditSummaryData] = await Promise.all([
          api.userApi.getProfile(),
          api.userApi.getDocuments(0, 10),
          api.userApi.getCreditSummary().catch(() => null),
        ]);

        setProfile(profileData);

        // normalise documentsData (mock vs real may return array or { content: [] })
        if (Array.isArray(documentsData)) {
          setDocuments(documentsData);
        } else {
          setDocuments(documentsData?.content ?? []);
        }

        // creditSummaryData is already the CreditSummary (no .data)
        setCreditSummary(creditSummaryData?.data ?? null);
        setError(null);
      } catch (err) {
        setError('Không thể tải dữ liệu từ máy chủ.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dashboardText = {
    sectionTitle: 'text-xl font-bold text-slate-900',
    cardTitle: 'text-base font-bold text-slate-800',
    fieldLabel: 'text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500',
    fieldValue: 'text-base font-semibold text-slate-800',
    body: 'text-sm font-medium text-slate-700',
    muted: 'text-sm text-slate-500',
  };


  return (
    <div className="flex min-h-[600px] gap-0">
      <aside className="w-64 flex-shrink-0 rounded-l-2xl border-r border-gray-100 bg-white">
        {loading ? (
          <div className="p-5 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 rounded bg-gray-200" />
                <div className="h-2 w-3/4 rounded bg-gray-200" />
              </div>
            </div>
            <div className="mt-3 h-8 rounded-lg bg-gray-200" />
          </div>
        ) : profile ? (
          <div className="border-b border-gray-100 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-semibold text-white">
                {profile.fullName?.charAt(0) ??''}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{profile.fullName}</p>
                <p className="truncate text-xs text-gray-500">
                  Gói {profile.packageType === 'PROFESSIONAL' ? 'Chuyên nghiệp' : profile.packageType === 'BASIC' ? 'Cơ bản' : 'Dùng thử'}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2">
              <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" />
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button" className="text-left text-xs font-medium text-amber-700 underline-offset-2 hover:text-amber-800 hover:underline">
                      Credit
                    </button>
                  </PopoverTrigger>
                  <PopoverContent side="right" align="start" className="w-72 p-3">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Tháng này</span>
                        <span>{creditSummary?.monthly?.remaining ?? 0} / {creditSummary?.monthly?.allocated ?? 0}</span>
                      </div>
                      <div className="rounded-lg bg-amber-50 p-2">
                        <div className="flex items-center justify-between text-[11px] text-amber-700">
                          <span>Credit còn lại</span>
                          <span className="font-semibold">{creditSummary?.monthly?.remaining ?? 0}</span>
                        </div>
                        <div className="mt-1 text-[11px] text-gray-500">Được cấp: {creditSummary?.monthly?.allocated ?? 0}</div>
                        <div className="mt-1 text-[11px] text-gray-500">Chu kỳ: {creditSummary?.monthly?.cycleStart ? new Date(creditSummary.monthly.cycleStart).toLocaleDateString('vi-VN') : 'Chưa có'} - {creditSummary?.monthly?.cycleEnd ? new Date(creditSummary.monthly.cycleEnd).toLocaleDateString('vi-VN') : 'Chưa có'}</div>
                      </div>
                      <div className="rounded-lg bg-sky-50 p-2">
                        <div className="flex items-center justify-between text-[11px] text-sky-700">
                          <span>Đã mua</span>
                          <span className="font-semibold">{creditSummary?.purchased?.balance ?? 0}</span>
                        </div>
                        <div className="mt-1 text-[11px] text-gray-500">
                          Hết hạn: {creditSummary?.purchased?.expireAt ? new Date(creditSummary.purchased.expireAt).toLocaleDateString('vi-VN') : (creditSummary?.subscriptionExpireDate ? new Date(creditSummary.subscriptionExpireDate).toLocaleDateString('vi-VN') : 'Chưa có')}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        ) : null}

        <nav className="p-3">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`mb-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all ${activeTab === tab.key ? 'border border-blue-100 bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <span className="flex items-center gap-3">
                <span className={activeTab === tab.key ? 'text-blue-600' : 'text-gray-400'}>{tab.icon}</span>
                {tab.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-gray-100 p-3">
          <button onClick={handleLogout} className="flex w-full items-start justify-start gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600">
            <LogOut size={16} className="mt-0.5" />
            <span className="text-left">Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="min-h-[600px] flex-1 rounded-r-2xl bg-slate-100 p-6">
        {error && (
          <div className="rounded-lg border border-red-400 bg-red-100 px-4 py-3 text-red-700" role="alert">
            <strong className="font-bold">Lỗi!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {loading && <div className="p-10 text-center">Đang tải dữ liệu...</div>}

        {activeTab === 'profile' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className={dashboardText.sectionTitle}>Hồ sơ & Tài khoản</h3>
              {isEditingProfile ? (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={handleProfileCancel} className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">Hủy</button>
                  <button type="button" onClick={handleProfileSave} className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">Lưu</button>
                </div>
              ) : (
                <button type="button" onClick={handleProfileEditStart} className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                  <Pencil size={14} /> Chỉnh sửa
                </button>
              )}
            </div>

            {profile && (
              <div className="rounded-xl border border-gray-100 bg-white p-6">
                <div className="flex items-start gap-6">
                  <div className="relative flex-shrink-0">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-4xl font-bold text-white shadow-lg">
                      {profile.fullName?.charAt(0) ?? ''}
                      </div>
                    <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50"><Pencil size={12} className="text-gray-500" /></button>
                  </div>

                  <div className="grid flex-1 grid-cols-2 gap-4">
                    {profileFields.map(field => (
                      <div key={field.key} className="min-w-0">
                        <p className="mb-0.5 text-xs text-gray-500">{field.label}</p>
                        {isEditingProfile && field.editable ? (
                          <input
                            type="text"
                            value={field.key === 'fullName' ? editedProfile.fullName : field.key === 'agency' ? editedProfile.agency : field.key === 'phone' ? editedProfile.phone : editedProfile.position}
                            onChange={(e) => handleProfileInputChange(field.key as 'fullName' | 'agency' | 'phone' | 'position', e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        ) : (
                          <p className="break-words text-sm font-medium text-gray-900">
                            {field.key === 'email' ? profile.email : field.key === 'created_at' ? formatDate(profile.created_at) : field.value}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900"><Settings size={15} className="text-gray-400" /> Cài đặt thông báo</h4>
              <div className="space-y-3">
                {['Thông báo qua email khi hết credit', 'Nhận bản tin cập nhật tính năng mới', 'Thông báo khi affiliate có giao dịch'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item}</span>
                    <div className={`relative h-5 w-10 rounded-full transition-colors ${i === 0 ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${i === 0 ? 'left-5' : 'left-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* subscription tab content */}
       {activeTab === 'subscription' && (
  <div className="space-y-5">
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setSubscriptionTab('plan')}
        className={`px-4 py-2 rounded-lg text-sm font-medium ${
          subscriptionTab === 'plan' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
        }`}
      >
        Gói dịch vụ
      </button>

      <button
        type="button"
        onClick={() => setSubscriptionTab('credit')}
        className={`px-4 py-2 rounded-lg text-sm font-medium ${
          subscriptionTab === 'credit' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
        }`}
      >
        Credit
      </button>
    </div>

    {subscriptionTab === 'plan' && (
      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-gray-900">Gói dịch vụ</h3>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Award size={18} />
                <span className="text-base font-semibold text-blue-100">Gói hiện tại</span>
              </div>

              <h4 className="text-2xl font-bold mb-1">
                {creditSummary?.packageType ?? profile?.packageType ?? 'N/A'}
              </h4>

              <p className="text-blue-200 text-sm">
                Hết hạn:{' '}
                {creditSummary?.subscriptionExpireDate
                  ? new Date(creditSummary.subscriptionExpireDate).toLocaleDateString('vi-VN')
                  : profile?.expireDate
                    ? new Date(profile.expireDate).toLocaleDateString('vi-VN')
                    : 'Chưa có'}
              </p>
            </div>

            <div className="text-right">
              <p className="text-blue-200 text-xs mb-1">Credit còn lại</p>
              <p className="text-4xl font-bold">
                {creditSummary?.monthly?.remaining ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className={dashboardText.fieldLabel}>Package type</p>
            <p className="text-lg font-semibold text-gray-900">
              {creditSummary?.packageType ?? profile?.packageType ?? 'N/A'}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className={dashboardText.fieldLabel}>Ngày hết hạn</p>
            <p className="text-lg font-semibold text-gray-900">
              {creditSummary?.subscriptionExpireDate
                ? new Date(creditSummary.subscriptionExpireDate).toLocaleDateString('vi-VN')
                : profile?.expireDate
                  ? new Date(profile.expireDate).toLocaleDateString('vi-VN')
                  : 'Chưa có'}
            </p>
          </div>
        </div>
      </div>
    )}

    {subscriptionTab === 'credit' && (
      <div className="space-y-5">
        <h3 className="text-lg font-semibold text-gray-900">Credit</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className={dashboardText.fieldLabel}>Credit được cấp</p>
            <p className={dashboardText.fieldValue}>
              {creditSummary?.monthly?.allocated ?? 0}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className={dashboardText.fieldLabel}>Credit còn lại</p>
            <p className={dashboardText.fieldValue}>
              {creditSummary?.monthly?.remaining ?? 0}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className={dashboardText.fieldLabel}>Chu kỳ bắt đầu</p>
            <p className={dashboardText.fieldValue}>
              {creditSummary?.monthly?.cycleStart
                ? new Date(creditSummary.monthly.cycleStart).toLocaleDateString('vi-VN')
                : 'Chưa có'}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className={dashboardText.fieldLabel}>Chu kỳ kết thúc</p>
            <p className={dashboardText.fieldValue}>
              {creditSummary?.monthly?.cycleEnd
                ? new Date(creditSummary.monthly.cycleEnd).toLocaleDateString('vi-VN')
                : 'Chưa có'}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className={dashboardText.fieldLabel}>Credit đã mua</p>
            <p className={dashboardText.fieldValue}>
              {creditSummary?.purchased?.balance ?? 0}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className={dashboardText.fieldLabel}>Hết hạn dùng</p>
            <p className={dashboardText.fieldValue}>
              {creditSummary?.purchased?.expireAt
                ? new Date(creditSummary.purchased.expireAt).toLocaleDateString('vi-VN')
                : 'Chưa có'}
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
)}

        {/*  history tab */}
        {activeTab === 'history' && (
  <div className="space-y-5">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-bold text-gray-900">Lịch sử văn bản</h3>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">{documents.length} văn bản</span>
      </div>
    </div>

    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-100 bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Tên văn bản</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Loại trợ lý</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Ngày tạo</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Trạng thái</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {documents.map(doc => (
            <tr key={doc.sessionId} className="border-b border-gray-50 transition-colors hover:bg-gray-50/50">
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="flex-shrink-0 text-gray-400" />
                  <span className="max-w-[200px] truncate font-medium text-gray-800">{doc.sessionName}</span>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <span className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700">{doc.tagId}</span>
              </td>
              <td className="px-4 py-3.5 text-xs text-gray-500">{new Date(doc.updatedAt).toLocaleDateString('vi-VN')}</td>
              <td className="px-4 py-3.5">
                <span className={`rounded-md px-2 py-1 text-xs font-medium ${doc.status === 'Hoàn thành' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {doc.status}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center justify-end gap-1">
                  <button className="flex items-center gap-1 rounded-md border border-blue-200 px-2.5 py-1.5 text-xs text-blue-600 transition-colors hover:bg-blue-50">
                    <Pencil size={11} /> Tiếp tục
                  </button>
                  <button className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500">
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

        {activeTab === 'affiliate' && (
          <div className="space-y-5">
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v20M2 12h20" strokeLinecap="round" /></svg>
              </div>
              <h4 className="mt-4 text-lg font-bold text-slate-800">Đang phát triển</h4>
              <p className="mt-2 text-sm text-slate-500">Tính năng affiliate sẽ được mở trong phiên bản tiếp theo.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}