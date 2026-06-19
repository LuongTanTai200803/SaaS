import { useState, useEffect } from 'react';
import {
  User, CreditCard, FileText, Share2, Copy, Check,
  Pencil, Trash2, ChevronRight, TrendingUp, Users,
  Calendar, LogOut, Bell, Settings, ExternalLink,
  Award, BarChart3, Link2, DollarSign, Zap
} from 'lucide-react';
import api from '../api'; // Import đối tượng 'api' tổng hợp
import { UserProfile, Document } from '../api/userApi'; // Giữ lại các kiểu dữ liệu cần thiết

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileData = await api.userApi.getProfile(); // Sử dụng api.userApi
        const documentsData = await api.userApi.getDocuments(0, 10); // Sử dụng api.userApi
        setProfile(profileData);
        setDocuments(documentsData.content);
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

  const affiliateLink = profile?.affiliate.link || '';

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

  return (
    <div className="flex gap-0 min-h-[600px]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-100 rounded-l-2xl">
        {loading ? (
          <div className="p-5 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
            <div className="mt-3 h-8 bg-gray-200 rounded-lg"></div>
          </div>
        ) : profile ? (
        <div className="p-5 border-b border-gray-100">
          {/* User summary */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
              {profile.fullName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{profile.fullName}</p>
              <p className="text-xs text-gray-500 truncate">
                Gói {profile.packageType === 'PROFESSIONAL' ? 'Chuyên nghiệp' : profile.packageType === 'BASIC' ? 'Cơ bản' : 'Dùng thử'}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-3 py-2 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500" />
              <span className="text-xs font-medium text-amber-700">{profile.creditBalance} credits còn lại</span>
            </div>
            {/* TODO: Max credits for package is not in profile API response */}
            {/* <span className="text-xs text-amber-500">/ 300</span> */}
          </div>
        </div>
        ) : null}

        {/* Navigation */}
        <nav className="p-3">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 text-left ${
                activeTab === tab.key
                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={activeTab === tab.key ? 'text-blue-600' : 'text-gray-400'}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-3 mt-auto border-t border-gray-100 absolute bottom-0 w-64">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 bg-gray-50/50 rounded-r-2xl p-6 min-h-[600px]">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">Lỗi!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {loading && <div className="text-center p-10">Đang tải dữ liệu...</div>}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Hồ sơ & Tài khoản</h3>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Pencil size={14} />
                Chỉnh sửa
              </button>
            </div>

            {profile && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {profile.fullName.charAt(0)}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 shadow-sm">
                    <Pencil size={12} className="text-gray-500" />
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  {[
                    { label: 'Họ và tên', value: profile.fullName },
                    { label: 'Email', value: profile.email },
                    { label: 'Đơn vị công tác', value: profile.agency },
                    { label: 'Số điện thoại', value: 'Chưa cập nhật' }, // Not in API
                    { label: 'Chức vụ', value: 'Chưa cập nhật' }, // Not in API
                    { label: 'Ngày tham gia', value: 'Chưa có trong API' }, // Not in API
                  ].map((field, i) => (
                    <div key={i}>
                      <p className="text-xs text-gray-500 mb-0.5">{field.label}</p>
                      <p className="text-sm font-medium text-gray-900">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Settings size={15} className="text-gray-400" />
                Cài đặt thông báo
              </h4>
              <div className="space-y-3">
                {['Thông báo qua email khi hết credit', 'Nhận bản tin cập nhật tính năng mới', 'Thông báo khi affiliate có giao dịch'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item}</span>
                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${i === 0 ? 'bg-blue-600' : 'bg-gray-200'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${i === 0 ? 'left-5' : 'left-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="space-y-5">
            {profile && (
            <>
              <h3 className="text-lg font-semibold text-gray-900">Gói dịch vụ & Credit</h3>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Award size={18} />
                    <span className="text-sm font-medium text-blue-100">Gói hiện tại</span>
                  </div>
                  <h4 className="text-2xl font-bold mb-1">
                    Gói {profile.packageType === 'PROFESSIONAL' ? 'Chuyên nghiệp' : profile.packageType === 'BASIC' ? 'Cơ bản' : 'Dùng thử'}
                  </h4>
                  <p className="text-blue-200 text-sm">Làm mới ngày {new Date(profile.expireDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-200 text-xs mb-1">Credit còn lại</p>
                  <p className="text-4xl font-bold">{profile.creditBalance}</p>
                  {/* TODO: Max credits for package is not in profile API response */}
                  {/* <p className="text-blue-200 text-sm">/ 300 credits</p> */}
                </div>
              </div>
              <div className="mt-4 bg-white/20 rounded-full h-2">
                {/* TODO: Need max credits to calculate percentage */}
                <div className="bg-white rounded-full h-2 w-[78%]" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Dùng thử', price: '0đ', credits: '3 credits', active: false },
                { name: 'Cơ bản', price: '199.000đ', credits: '100 credits', active: false },
                { name: 'Chuyên nghiệp', price: '549.000đ', credits: '300 credits', active: true },
                { name: 'Pro', price: '1.199.000đ', credits: '800 credits', active: false },
              ].slice(0,3).map((plan, i) => (
                <div key={i} className={`p-4 rounded-xl border-2 transition-all ${plan.active ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                  <p className="font-semibold text-gray-900 text-sm">{plan.name}</p>
                  <p className="text-blue-600 font-bold mt-1">{plan.price}<span className="text-xs text-gray-400 font-normal">/tháng</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">{plan.credits}</p>
                  {plan.active && <span className="inline-block mt-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Đang dùng</span>}
                </div>
              ))}
            </div>

            {/* TODO: API for payment history is missing in the spec. Using mock data for now. */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Lịch sử thanh toán</h4>
              <div className="space-y-2">
                {[
                  { date: '01/06/2025', desc: 'Gia hạn Gói Chuyên nghiệp', amount: '549.000đ', status: 'Thành công' },
                  { date: '01/05/2025', desc: 'Gia hạn Gói Chuyên nghiệp', amount: '549.000đ', status: 'Thành công' },
                  { date: '01/04/2025', desc: 'Nâng cấp lên Chuyên nghiệp', amount: '549.000đ', status: 'Thành công' },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm text-gray-800">{tx.desc}</p>
                      <p className="text-xs text-gray-400">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{tx.amount}</p>
                      <span className="text-xs text-green-600">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Lịch sử văn bản</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{documents.length} văn bản</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tên văn bản</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Loại trợ lý</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ngày tạo</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Trạng thái</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map(doc => (
                    <tr key={doc.sessionId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-gray-400 flex-shrink-0" />
                          <span className="font-medium text-gray-800 truncate max-w-[200px]">{doc.sessionName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {/* TODO: Map tagId to a user-friendly name */}
                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-md">{doc.tagId}</span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-xs">{new Date(doc.updatedAt).toLocaleDateString('vi-VN')}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${doc.status === 'Hoàn thành' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 justify-end">
                          <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors">
                            <Pencil size={11} />
                            Tiếp tục
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
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

        {/* Affiliate Tab */}
        {activeTab === 'affiliate' && (
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-900">Hệ thống Affiliate</h3>
            
            {/* TODO: API for affiliate stats is missing in the spec. Using mock data for now. */}
            <div className="grid grid-cols-2 gap-4">
              {affiliateStats.map((stat, i) => ( // Using mock data
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900">
                      {stat.label === 'Thu nhập tạm tính'
                        ? `${(profile?.affiliate.totalEarnings || 0).toLocaleString('vi-VN')}đ`
                        : stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {profile && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Link giới thiệu của bạn</h4>
              <p className="text-xs text-gray-500 mb-3">Nhận 10% hoa hồng cho mỗi người dùng đăng ký qua link của bạn</p>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                  <Link2 size={14} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{affiliateLink}</span>
                </div>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${copied ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Đã sao chép' : 'Sao chép'}
                </button>
              </div>
            </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-gray-900">Thu nhập theo tháng</h4>
                <span className="text-xs text-gray-400">6 tháng gần nhất</span>
              </div>
              <div className="flex items-end gap-3 h-28">
                {[40, 65, 30, 80, 55, 90].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-blue-100 rounded-t-md transition-all" style={{ height: `${h}%` }}>
                      <div className="w-full bg-blue-500 rounded-t-md h-full opacity-80" />
                    </div>
                    <span className="text-xs text-gray-400">{['T1','T2','T3','T4','T5','T6'][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TODO: API for affiliate referrals is missing in the spec. Using mock data for now. */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Danh sách người giới thiệu</h4>
              <div className="space-y-2">
                {[
                  { name: 'Trần Thị B', date: '28/05/2025', plan: 'Cơ bản', commission: '19.900đ', paid: true },
                  { name: 'Lê Văn C', date: '15/05/2025', plan: 'Chuyên nghiệp', commission: '54.900đ', paid: true },
                  { name: 'Phạm Thị D', date: '05/05/2025', plan: 'Cơ bản', commission: '19.900đ', paid: false },
                ].map((ref, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                        {ref.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{ref.name}</p>
                        <p className="text-xs text-gray-400">{ref.date} · {ref.plan}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{ref.commission}</p>
                      <span className={`text-xs ${ref.paid ? 'text-green-600' : 'text-amber-500'}`}>
                        {ref.paid ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
