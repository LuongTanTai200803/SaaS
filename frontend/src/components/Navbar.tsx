import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ChevronDown, Menu, X, Bell, LayoutDashboard,
  Languages, Phone, Mail, Shield, Zap
} from 'lucide-react';
import { BillingModal } from './BillingModal';
import { useAuth } from '../context/AuthContext';
import { EXTERNAL_LINKS } from '../api/urls'; // Giữ nguyên nếu EXTERNAL_LINKS được sử dụng

type NavItem = 'home' | 'assistants' | 'templates' | 'pricing' | 'guide' | 'affiliate';
type Tab = 'login' | 'register';

const navItems: { key: NavItem; label: string }[] = [
  { key: 'home', label: 'Trang chủ' },
  { key: 'assistants', label: 'Menu Trợ lý' },
  { key: 'templates', label: 'Văn bản của Tôi' },
  { key: 'guide', label: 'Hướng dẫn' },
  { key: 'pricing', label: 'Bảng giá' },
  { key: 'affiliate', label: 'Affiliate' },
];

interface NavbarProps {
  onNavigate: (page: 'home' | 'wizard', assistantId?: string) => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const { isLoggedIn, profile, showDashboard, setShowDashboard, openAuthModal } = useAuth(); // Lấy openAuthModal từ AuthContext
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavItem>('home'); // Navbar manages its own activeNav
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [assistantMenuOpen, setAssistantMenuOpen] = useState(false);

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'vi' | 'en' | 'zh'>('vi');


  const navigate = useNavigate();

  const assistantMenu = [
    { id: '1', title: 'Văn kiện Đảng' },
    { id: '2', title: 'Văn bản Nhà nước' },
    { id: '3', title: 'Quản lý Giáo dục' },
    { id: '4', title: 'Biên tập & Phát biểu' },
    { id: '5', title: 'Rút gọn & Kiểm tra' },
    { id: '6', title: 'Soạn Giáo án' },
    { id: '7', title: 'Ma trận & Đề thi' },
    { id: '8', title: 'Chấm & Đánh giá' },
    { id: '9', title: 'Báo cáo Thành tích' },
  ];
  const handleProtectedNavigate = (page: 'home' | 'wizard', assistantId?: string) => {
    if (page === 'wizard' && !isLoggedIn) {
      openAuthModal('login'); // Sử dụng openAuthModal từ AuthContext
      return;
    }
    onNavigate(page, assistantId);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#1E3A8A] rounded-lg flex items-center justify-center shadow-md">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="leading-none">
              <span className="font-bold text-[#1F2937] text-base tracking-tight">Văn phòng số</span>
              <span className="hidden md:block text-[10px] text-gray-400 font-normal">vanphongso.ai.vn</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              
              // 🏛️ XỬ LÝ RIÊNG CHO NÚT MENU TRỢ LÝ
              if (item.key === 'assistants') {
                return (
                  <div key={item.key} className="relative"> {/* Neo vị trí dropdown ăn theo nút này */}
                    <button
                      onClick={() => {
                        setActiveNav('assistants');
                        setShowDashboard(false);
                        setAssistantMenuOpen(prev => !prev); // Đảo trạng thái đóng/mở chuẩn xác
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeNav === 'assistants' || assistantMenuOpen
                          ? 'text-[#1E3A8A] bg-blue-50'
                          : 'text-gray-600 hover:text-[#1F2937] hover:bg-gray-50'
                      }`}
                    >
                      {item.label}
                    </button>

                    {/* Khối Dropdown đổ xuống khi trạng thái bằng true */}
                    {assistantMenuOpen && (
                      <>
                        {/* 🛡️ Tấm khiên ảo: Bấm trượt ra ngoài hoặc bấm lại nút cha là tự động đóng */}
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={(e) => {
                            e.stopPropagation(); // Chặn nổi bọt sự kiện
                            setAssistantMenuOpen(false);
                          }} 
                        />
                        
                        {/* Nội dung thực của Dropdown menu */}
                        <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1">
                          {assistantMenu.map(subItem => (
                            <button
                              key={subItem.id}
                              onClick={() => {
                                setAssistantMenuOpen(false); // Chọn xong trợ lý ➡️ Đóng ngay lập tức
                                setActiveNav('assistants');
                                handleProtectedNavigate('wizard', subItem.id);
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition-colors block"
                            >
                              {subItem.title}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              }

              // 🟢 XỬ LÝ CÁC NÚT ĐIỀU HƯỚNG THƯỜNG KHÁC (Trang chủ, Bảng giá, Hướng dẫn...)
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveNav(item.key);
                    setAssistantMenuOpen(false); // Cán bộ chuyển trang khác ➡️ Ép đóng menu trợ lý lại
                    setShowDashboard(false);
                    if (item.key === 'home') handleProtectedNavigate('home');
                    // Thêm các điều hướng trang khác của Tài tại đây...
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeNav === item.key
                      ? 'text-[#1E3A8A] bg-blue-50'
                      : 'text-gray-600 hover:text-[#1F2937] hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-sm"
              >
                <Languages size={16} />
                <span className="hidden sm:inline">{currentLang === 'vi' ? 'Tiếng Việt' : currentLang === 'en' ? 'English' : '中文'}</span>
                <ChevronDown size={12} className={`transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {langMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
                  {[
                    { code: 'vi' as const, label: 'Tiếng Việt', flag: '🇻🇳' },
                    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
                    { code: 'zh' as const, label: '中文', flag: '🇨🇳' },
                  ].map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setCurrentLang(lang.code); setLangMenuOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 ${currentLang === lang.code ? 'bg-blue-50 text-[#1E3A8A]' : 'text-gray-700'}`}
                    >
                      <span>{lang.flag}</span>
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <>
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Bell size={18} /> 
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <button
                  onClick={() => setShowDashboard(!showDashboard)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${showDashboard ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="w-6 h-6 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {profile ? profile.fullName.charAt(0) : '?'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">{profile?.fullName || 'Tài khoản'}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${showDashboard ? 'rotate-180' : ''}`} />
                </button>
                <button
                  onClick={() => setIsBillingModalOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all text-sm font-medium shadow-sm"
                >
                  <Zap size={14} />
                  <span className="text-xs">{profile?.creditBalance || 0} credits</span>
                </button>
                {profile?.role === 'ROLE_ADMIN' ? (
                  <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all text-sm font-semibold shadow-md"
                  >
                    <Shield size={15} />
                    Admin
                  </button>
                ) : (
                  // Only show Workspace button if not an admin
                  // The credit button is already hidden for admin by the previous check
                  <button
                    onClick={() => handleProtectedNavigate('wizard')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium shadow-sm"
                  >
                    <LayoutDashboard size={15} />
                    Workspace
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    openAuthModal('login'); // Sử dụng openAuthModal từ AuthContext
                  }}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium text-sm"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => {
                    openAuthModal('register'); // Sử dụng openAuthModal từ AuthContext
                  }}
                  className="px-4 py-2 border border-[#1E3A8A] text-[#1E3A8A] rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
                >
                  Đăng ký
                </button>
              </>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-500">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {navItems.map(item => (
              <button key={item.key} onClick={() => { setActiveNav(item.key); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <BillingModal isOpen={isBillingModalOpen} onClose={() => setIsBillingModalOpen(false)} /> {/* BillingModal vẫn được quản lý tại Navbar */}
    </>
  );
}