import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  FileText, Users, TrendingUp, BookOpen, ArrowRight, Sparkles, Building2, GraduationCap, FileEdit, Search, Zap, Star, Shield, Clock, LayoutDashboard, CheckCircle2, Globe, Lock, BarChart2, Lightbulb, MessageCircle, Shield as ShieldIcon, Globe as GlobeIcon, Lock as LockIcon, CheckCircle2 as CheckCircle2Icon, // Import Shield, Globe, Lock, CheckCircle2 with aliases
  Target, Eye, EyeOff, Phone, Mail, FilePlus, X, Facebook,
} from 'lucide-react'; // Added Facebook icon

import { BillingModal } from './BillingModal';
import { AuthModal } from './AuthModal';
import { Dashboard } from './Dashboard';
import { EXTERNAL_LINKS } from '../api/urls'; // Giữ nguyên nếu EXTERNAL_LINKS được sử dụng
import { UserProfile } from '../api/userApi'; // Giữ lại kiểu dữ liệu UserProfile nếu cần
import api from '../api'; // Import đối tượng 'api' tổng hợp
import { Navbar } from './Navbar'; // Import Navbar component
import { useAuth } from '../context/AuthContext';
 
type NavItem = 'home' | 'assistants' | 'templates' | 'pricing' | 'guide' | 'affiliate';

const navItems: { key: NavItem; label: string }[] = [
  { key: 'home', label: 'Trang chủ' },
  { key: 'assistants', label: 'Menu Trợ lý' },
  { key: 'templates', label: 'Văn bản của Tôi' },
  { key: 'guide', label: 'Hướng dẫn' },
  { key: 'pricing', label: 'Bảng giá' },
  { key: 'affiliate', label: 'Affiliate' },
];

const assistants = [
  { 
    id: '1', 
    icon: <Building2 size={30} />, 
    title: 'Văn kiện Đảng', 
    desc: 'Soạn nghị quyết, chỉ thị, kế hoạch Đảng chuẩn thể thức', 
    color: 'text-red-700', 
    bg: 'bg-red-100/50', // Màu nền cực kỳ nhẹ (giảm opacity hoặc dùng tone 50)
    border: 'border-red-500' // Viền đậm rõ ràng
  },
  { 
    id: '2', 
    icon: <FileText size={30} />, 
    title: 'Văn bản Nhà nước', 
    desc: 'HĐND, UBND, MTTQ theo đúng quy chuẩn ban hành', 
    color: 'text-blue-700', 
    bg: 'bg-blue-100/50', 
    border: 'border-blue-500' 
  },
  { 
    id: '3', 
    icon: <GraduationCap size={30} />, 
    title: 'Quản lý Giáo dục', 
    desc: 'Công văn giáo dục, kế hoạch chuyên môn, báo cáo', 
    color: 'text-emerald-700', 
    bg: 'bg-emerald-100/50', 
    border: 'border-emerald-500' 
  },
  { 
    id: '4', 
    icon: <FileEdit size={30} />, 
    title: 'Biên tập & Phát biểu', 
    desc: 'Chuẩn hóa văn phong, soạn bài phát biểu chuyên nghiệp', 
    color: 'text-violet-700', 
    bg: 'bg-violet-100/50', 
    border: 'border-violet-500' 
  },
  { 
    id: '5', 
    icon: <Search size={30} />, 
    title: 'Rút gọn & Kiểm tra', 
    desc: 'Tóm tắt, rút gọn và kiểm tra lỗi chính tả tự động', 
    color: 'text-orange-700', 
    bg: 'bg-orange-100/50', 
    border: 'border-orange-500' 
  },
  { 
    id: '6', 
    icon: <BookOpen size={30} />, 
    title: 'Soạn giáo án', 
    desc: 'Giáo án điện tử chuẩn CTGDPT 2018 theo từng môn', 
    color: 'text-sky-700', 
    bg: 'bg-sky-100/50', 
    border: 'border-sky-500' 
  },
  { 
    id: '7', 
    icon: <BarChart2 size={30} />, 
    title: 'Ma trận & Đề kiểm tra', 
    desc: 'Tạo ma trận, câu hỏi và đề thi tự động theo chuẩn', 
    color: 'text-indigo-700', 
    bg: 'bg-indigo-100/50', 
    border: 'border-indigo-500' 
  },
  { 
    id: '8', 
    icon: <Star size={30} />, 
    title: 'Chấm & Đánh giá', 
    desc: 'Hỗ trợ chấm điểm, nhận xét học sinh theo rubric', 
    color: 'text-pink-700', 
    bg: 'bg-pink-100/50', 
    border: 'border-pink-500' 
  },
  { 
    id: '9', 
    icon: <TrendingUp size={30} />, 
    title: 'Viết Báo cáo thành tích', 
    desc: 'Báo cáo thi đua, thành tích cá nhân và tập thể', 
    color: 'text-amber-700', 
    bg: 'bg-amber-100/50', 
    border: 'border-amber-500' 
  },
  { 
    id: '10', 
    icon: <Sparkles size={30} />, 
    title: 'ChatPro Toàn năng', 
    desc: 'Cửa sổ chat đa model AI (DeepSeek, GPT-4o, Claude)', 
    color: 'text-cyan-700', 
    bg: 'bg-cyan-100/50', 
    border: 'border-cyan-500' 
  },
];

const stats = [
  { label: 'Người dùng', value: '10.000+', icon: <Users size={20} /> },
  { label: 'Văn bản đã tạo', value: '250.000+', icon: <FileText size={20} /> },
  { label: 'Cơ quan tin dùng', value: '500+', icon: <Building2 size={20} /> },
  { label: 'Tiết kiệm thời gian', value: '80%', icon: <Clock size={20} /> },
];

const pricingPlans = [
  { name: 'Dùng thử', price: '0đ', credits: '3 credits', period: '', features: ['3 lần sử dụng miễn phí', 'Tất cả 10 trợ lý AI', 'Xuất file Word/PDF'], highlighted: false, badge: '' },
  { name: 'Cơ bản', price: '199.000đ', credits: '100 credits', period: '/tháng', features: ['100 credits/tháng', 'Tất cả 10 trợ lý AI', 'Lịch sử văn bản 30 ngày', 'Hỗ trợ qua email'], highlighted: false, badge: '' },
  { name: 'Chuyên nghiệp', price: '549.000đ', credits: '300 credits', period: '/tháng', features: ['300 credits/tháng', 'Tất cả 10 trợ lý AI', 'Lịch sử không giới hạn', 'Ưu tiên hỗ trợ', 'Xuất hàng loạt'], highlighted: true, badge: 'Phổ biến nhất' },
  { name: 'Pro', price: '1.199.000đ', credits: '800 credits', period: '/tháng', features: ['800 credits/tháng', 'Tất cả 10 trợ lý AI', 'API tích hợp', 'Tài khoản nhóm 5 người', 'Hỗ trợ 24/7'], highlighted: false, badge: '' },
];

const trustPoints = [
  { icon: <ShieldIcon size={18} />, text: 'Bảo mật cấp độ chính phủ, mã hóa AES-256' },
  { icon: <GlobeIcon size={18} />, text: 'Chuẩn hóa theo quy định pháp luật hiện hành' },
  { icon: <LockIcon size={18} />, text: 'Không lưu trữ nội dung văn bản mật' },
  { icon: <CheckCircle2Icon size={18} />, text: 'Đã được kiểm duyệt bởi chuyên gia hành chính' },
];

interface HomePageProps {
  onNavigate: (page: 'home' | 'wizard', assistantId?: string) => void;
  initialShowDashboard?: boolean;
}

export function HomePage({ onNavigate, initialShowDashboard = false }: HomePageProps) {
  const { isLoggedIn, profile, showDashboard, setShowDashboard, openAuthModal } = useAuth(); // Lấy showDashboard và openAuthModal từ AuthContext
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);

  // React Router navigate

  useEffect(() => {
    if (initialShowDashboard) {
      setShowDashboard(true);
    }
  }, [initialShowDashboard, setShowDashboard]);

  const handleProtectedNavigate = (page: 'home' | 'wizard', assistantId?: string) => {
    if (page === 'wizard' && !isLoggedIn) {
      openAuthModal('login'); // Sử dụng openAuthModal từ AuthContext
      return;
    }
    onNavigate(page, assistantId);
  };
  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onNavigate={onNavigate}
      />

      {/* ── DASHBOARD PANEL (dropdown) ── */}
      {showDashboard && ( // Sử dụng state showDashboard để điều khiển hiển thị
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
      )}

      {!showDashboard && ( // Sử dụng state showDashboard để điều khiển hiển thị
        <>
          {isLoggedIn && profile && (
            <section className="max-w-[1280px] mx-auto px-8 py-8 bg-blue-50 rounded-xl border border-blue-100 mt-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#1F2937]">Chào mừng trở lại, {profile.fullName}!</h2>
                <p className="text-gray-600 text-sm mt-1">Bạn có {profile.creditBalance} credits còn lại. Hãy tiếp tục công việc của bạn.</p>
              </div>
              
            </section>
          )}
          {/* ── ASSISTANTS ── */}
          
          <section className="py-20 bg-gray-50">
            <div className="max-w-[1280px] mx-auto px-8">
              <div className="text-center mb-12">
                <span className="text-xs font-semibold text-[#1E3A8A] uppercase tracking-widest">Kho Trợ lý</span>
                <h2 className="text-3xl font-bold text-[#1F2937] mt-2 mb-3">10 Trợ lý AI chuyên biệt</h2>
                <p className="text-gray-500 max-w-xl mx-auto">
                  Mỗi trợ lý được huấn luyện chuyên sâu cho từng nghiệp vụ hành chính và giáo dục cụ thể
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {assistants.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleProtectedNavigate('wizard', a.id)}
                    /* 🎨 ĐÃ CẬP NHẬT: Loại bỏ bg-white cứng, thay bằng border-2 ăn theo ${a.border} và nền nhạt ${a.bg} */
                    className={`group p-5 ${a.bg} rounded-xl border-2 ${a.border} hover:bg-white hover:shadow-xl hover:border-current transition-all duration-200 text-left`}
                    style={{ '--current-color': a.color } as React.CSSProperties} // Mẹo giữ màu mượt mà khi hover
                  >
                    {/* Box chứa Icon: Đồng bộ màu sắc */}
                    <div className={`inline-flex items-center justify-center w-11 h-11 rounded-lg border-2 ${a.bg} ${a.border} ${a.color} mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                      {a.icon}
                    </div>
                    
                    <h3 className="font-bold text-[#1F2937] text-base mb-1.5 group-hover:text-[#1E3A8A] transition-colors">
                      {a.title}
                    </h3>
                    
                    <p className="text-sm text-gray-500 leading-relaxed min-h-[40px]">
                      {a.desc}
                    </p>
                    
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#1E3A8A] opacity-0 group-hover:opacity-100 transform translate-x-[-4px] group-hover:translate-x-0 transition-all duration-200">
                      Dùng thử ngay <ArrowRight size={12} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── STATS ── */}
          
          <section className="bg-[#1E3A8A] py-12">
            <div className="max-w-[1280px] mx-auto px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-white/10 rounded-lg mb-3 text-white">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* ── HERO ── */}
          <section className="max-w-[1280px] mx-auto px-8 py-20">
            <div className="grid grid-cols-12 gap-8 items-center">
              {/* Left 6 cols */}
              <div className="col-span-12 lg:col-span-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 text-[#1E3A8A] rounded-full text-xs font-semibold mb-6">
                  <Sparkles size={12} />
                  Nền tảng AI hành chính số Việt Nam
                </div>
                <h1 className="text-[2.6rem] leading-[1.15] font-bold text-[#1F2937] mb-5">
                  Tự động hóa văn kiện Đảng và<br />
                  <span className="text-[#1E3A8A]">Hành chính Nhà nước</span><br />
                  chuẩn thể thức
                </h1>
                <p className="text-base text-gray-500 leading-relaxed mb-8 max-w-lg">
                  Hệ thống 9 trợ lý AI chuyên biệt, xử lý ngôn ngữ tự nhiên và bóc tách dữ liệu số liệu thông minh — giúp cán bộ, công chức soạn thảo văn bản nhanh hơn <strong className="text-gray-700">10 lần</strong> so với phương pháp truyền thống.
                </p>
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <button
                    onClick={() => handleProtectedNavigate('wizard')}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1E3A8A] text-white rounded-xl hover:bg-blue-800 transition-all font-semibold shadow-lg hover:shadow-blue-200"
                  >
                    Bắt đầu ngay
                    <ArrowRight size={18} />
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold">
                    Xem demo
                  </button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {trustPoints.map((pt, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="text-[#1E3A8A]">{pt.icon}</span>
                      {pt.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 6 cols — UI mockup */}
              <div className="col-span-12 lg:col-span-6 flex justify-center">
                <div className="relative w-full max-w-[520px]">
                  {/* Drop shadow glow */}
                  <div className="absolute -inset-4 bg-blue-600/10 rounded-3xl blur-2xl" />
                  <div className="relative bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
                    {/* Window bar */}
                    <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 mx-4 h-6 bg-gray-100 rounded-md flex items-center px-3">
                        <span className="text-[10px] text-gray-400">vanphongai.vn/workspace</span>
                      </div>
                    </div>
                    {/* Mock workspace */}
                    <div className="flex h-52">
                      <div className="w-40 bg-[#1E3A8A] p-3 space-y-1 flex-shrink-0">
                        <p className="text-[10px] text-blue-200 font-semibold px-2 mb-2 uppercase tracking-wide">Trợ lý AI</p>
                        {['Văn kiện Đảng', 'Văn bản NN', 'Quản lý GD', 'Soạn giáo án'].map((item, i) => (
                          <div key={i} className={`px-2 py-1.5 rounded-md text-[11px] font-medium cursor-pointer ${i === 0 ? 'bg-white/20 text-white' : 'text-blue-200 hover:bg-white/10'}`}>
                            {item}
                          </div>
                        ))}
                      </div>
                      <div className="flex-1 p-4 space-y-3">
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-full" />
                        <div className="h-3 bg-gray-100 rounded w-5/6" />
                        <div className="h-3 bg-gray-100 rounded w-2/3" />
                        <div className="h-8 bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 rounded-lg mt-4 flex items-center px-3 gap-2">
                          <Sparkles size={12} className="text-[#1E3A8A]" />
                          <div className="flex-1 h-2 bg-blue-100 rounded animate-pulse" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-2.5 bg-blue-50 rounded w-full" />
                          <div className="h-2.5 bg-blue-50 rounded w-4/5" />
                          <div className="h-2.5 bg-blue-50 rounded w-full" />
                        </div>
                      </div>
                    </div>
                    {/* Footer bar */}
                    <div className="bg-gray-50 border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400">Đang xử lý bằng AI...</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── ABOUT / MISSION ── */}
          <section className="py-20 bg-white border-t border-gray-100">
            <div className="max-w-[1280px] mx-auto px-8">
              <div className="text-center mb-12">
                <span className="text-xs font-semibold text-[#1E3A8A] uppercase tracking-widest">Về chúng tôi</span>
                <h2 className="text-3xl font-bold text-[#1F2937] mt-2 mb-3">Slogan, Sứ mệnh & Tầm nhìn</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                {/* Slogan */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="w-12 h-12 bg-[#1E3A8A] rounded-xl flex items-center justify-center mb-4">
                    <MessageCircle size={24} className="text-white" />
                  </div>
                  <h3 className="font-bold text-[#1F2937] mb-2 text-lg">Slogan</h3>
                  <p className="text-sm text-gray-600 leading-relaxed italic">
                    "Tự động hóa văn kiện Đảng và Hành chính Nhà nước chuẩn thể thức — Số hóa toàn diện văn phòng công"
                  </p>
                </div>

                {/* Mission */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <Target size={24} className="text-white" />
                  </div>
                  <h3 className="font-bold text-[#1F2937] mb-2 text-lg">Sứ mệnh</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Số hóa và tự động hóa quy trình hành chính công, giúp cán bộ công chức, giáo viên tiết kiệm thời gian và nâng cao hiệu quả công việc.
                  </p>
                </div>

                {/* Vision */}
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-100">
                  <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center mb-4">
                    <Eye size={24} className="text-white" />
                  </div>
                  <h3 className="font-bold text-[#1F2937] mb-2 text-lg">Tầm nhìn</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Trở thành nền tảng AI hàng đầu Việt Nam trong lĩnh vực hành chính công và giáo dục, phục vụ hơn 100.000 cán bộ vào năm 2028.
                  </p>
                </div>
              </div>

              {/* Core competencies */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Lightbulb size={20} className="text-amber-600" />
                  </div>
                  <h3 className="font-bold text-[#1F2937] text-xl">Năng lực cốt lõi</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Xử lý Ngôn ngữ Tự nhiên (NLP)', desc: 'Hiểu và phân tích văn bản tiếng Việt chính xác, nhận diện ngữ cảnh hành chính' },
                    { title: 'Bóc tách & Cấu trúc hóa Dữ liệu', desc: 'Trích xuất thông tin từ văn bản phi cấu trúc thành dữ liệu có tổ chức' },
                    { title: 'Chuẩn hóa Thể thức Văn bản', desc: 'Đảm bảo 100% văn bản tuân thủ quy chuẩn Đảng và Nhà nước' },
                    { title: 'Bảo mật & Tuân thủ', desc: 'Mã hóa AES-256, không lưu trữ nội dung nhạy cảm, tuân thủ luật an ninh mạng' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 p-4 bg-white rounded-lg border border-gray-100">
                      <div className="w-1 h-full bg-[#1E3A8A] rounded-full flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-[#1F2937] text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── PRICING ── */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-[1280px] mx-auto px-8">
              <div className="text-center mb-12">
                <span className="text-xs font-semibold text-[#1E3A8A] uppercase tracking-widest">Bảng giá</span>
                <h2 className="text-3xl font-bold text-[#1F2937] mt-2 mb-3">Chọn gói phù hợp với bạn</h2>
                <p className="text-gray-500">Hệ thống credit linh hoạt, không cam kết hợp đồng dài hạn</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {pricingPlans.map((plan, i) => (
                  <div key={i} className={`relative rounded-2xl border-2 p-6 flex flex-col ${plan.highlighted ? 'border-[#1E3A8A] shadow-xl shadow-blue-100' : 'border-gray-100'}`}>
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 bg-[#1E3A8A] text-white text-xs font-semibold rounded-full">{plan.badge}</span>
                      </div>
                    )}
                    <h3 className="font-bold text-[#1F2937] mb-1">{plan.name}</h3>
                    <div className="mb-1">
                      <span className="text-2xl font-bold text-[#1E3A8A]">{plan.price}</span>
                      <span className="text-sm text-gray-400">{plan.period}</span>
                    </div>
                    <p className="text-xs text-amber-600 font-medium mb-5">{plan.credits}</p>
                    <ul className="space-y-2.5 flex-1 mb-6">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => plan.price === '0đ' ? handleProtectedNavigate('wizard') : setIsBillingModalOpen(true)}
                      className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${plan.highlighted ? 'bg-[#1E3A8A] text-white hover:bg-blue-800 shadow-md' : 'border-2 border-gray-200 text-gray-700 hover:border-[#1E3A8A] hover:text-[#1E3A8A]'}`}
                    >
                      {plan.price === '0đ' ? 'Dùng thử ngay' : 'Mua ngay'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA FINAL ── */}
          <section className="bg-gradient-to-r from-[#1E3A8A] to-indigo-700 py-16">
            <div className="max-w-[1280px] mx-auto px-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-3">Sẵn sàng số hóa quy trình hành chính?</h2>
              <p className="text-blue-200 mb-8 max-w-xl mx-auto">Hơn 500 cơ quan, đơn vị đã tin dùng. Đăng ký miễn phí — không cần thẻ ngân hàng.</p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleProtectedNavigate('wizard')}
                  className="px-8 py-3.5 bg-white text-[#1E3A8A] rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Dùng thử 3 lần miễn phí
                </button>
                <button className="px-8 py-3.5 border-2 border-white/40 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">
                  Liên hệ tư vấn
                </button>
              </div>
            </div>
          </section>

          {/* ── FOOTER ── */}
          <footer className="bg-[#111827] text-gray-400 py-12">
            <div className="max-w-[1280px] mx-auto px-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
                {/* About */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-[#1E3A8A] rounded-lg flex items-center justify-center">
                      <Sparkles size={16} className="text-white" />
                    </div>
                    <div className="leading-none">
                      <span className="text-white font-bold block">Văn phòng số</span>
                      <span className="text-[11px] text-gray-500">vanphongso.ai.vn</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-4">Giải pháp AI hàng đầu cho văn phòng hành chính Việt Nam</p>

                  {/* Contact info */}
                  <div className="flex items-center gap-4 mb-4"> {/* Changed to flex row for social icons */}
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                      <Facebook size={24} /> {/* Facebook icon */}
                    </a>
                    <a href="https://zalo.me/yourzalo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                      <MessageCircle size={24} /> {/* Zalo icon (using MessageCircle) */}
                    </a>
                    {/* You can add more social media icons here */}
                  </div>

                  {/* Mission statement */}
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-xs leading-relaxed text-gray-500">
                      <strong className="text-gray-300">Sứ mệnh:</strong> Số hóa và tự động hóa quy trình hành chính công,
                      giúp cán bộ công chức nâng cao hiệu quả làm việc.
                    </p>
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h4 className="text-white font-semibold mb-3 text-sm">Sản phẩm</h4>
                  <ul className="space-y-2">
                    {['Menu Trợ lý', 'Văn bản của Tôi', 'ChatPro Toàn năng', 'Bảng giá', 'API'].map((link, i) => (
                      <li key={i}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
                    ))}
                  </ul>
                </div>

                {/* Tools & Support */}
                <div>
                  <h4 className="text-white font-semibold mb-3 text-sm">Tiện ích & Hỗ trợ</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href={EXTERNAL_LINKS.TOOLS.ILOVEPDF} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors flex items-center gap-1.5">
                        <FilePlus size={12} />
                        Tách/Nối PDF
                      </a>
                    </li>
                    {['Hướng dẫn sử dụng', 'Tài liệu API', 'Video tutorials', 'Liên hệ hỗ trợ'].map((link, i) => (
                      <li key={i}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
                    ))}
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h4 className="text-white font-semibold mb-3 text-sm">Công ty</h4>
                  <ul className="space-y-2">
                    {['Về chúng tôi', 'Chính sách bảo mật', 'Điều khoản dịch vụ', 'Blog', 'Tuyển dụng', 'Affiliate'].map((link, i) => (
                      <li key={i}><a href="#" className="text-sm hover:text-white transition-colors">{link}</a></li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                <p>&copy; 2026 vanphongso.ai.vn - Văn phòng số. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><Shield size={12} /> Bảo mật AES-256</span>
                  <span>•</span>
                  <span>Chuẩn UX hành chính công VN</span>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

    </div>
  );
}
