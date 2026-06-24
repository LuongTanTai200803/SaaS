import { useState } from 'react';
import { X, Check, Zap, Loader2, ArrowRight, HelpCircle, ShieldCheck } from 'lucide-react';

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PricingPlan {
  id: string;
  name: string;
  pricePerMonth: number; // Đổi sang giá gốc theo tháng để tính toán động chính xác
  credits: string;       // Chuỗi hiển thị credits kèm chu kỳ
  model: string;         // Bổ sung phân loại model AI phục vụ chuyên sâu
  features: string[];
  popular?: boolean;
  bgClass: string;       // Màu nền cực nhẹ ở trạng thái tĩnh
  borderClass: string;   // Màu viền tương phản cao
  textClass: string;     // Màu chữ đại diện cho icon/badge
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'trial',
    name: 'Dùng thử',
    pricePerMonth: 0,
    credits: '3 Credits',
    model: ' (Tốc độ cao)',
    bgClass: 'bg-red-50/40',
    borderClass: 'border-red-200 hover:border-red-400',
    textClass: 'text-red-700',
    features: [
      'Cấp ngay 3 Credits miễn phí trải nghiệm',
      'Giới hạn tạo tối đa 3 văn bản/ngày',
      'Quy đổi: Khoảng 3-5 công văn ngắn',
      'Hỗ trợ cộng đồng qua Ticket cơ bản',
      'Lưu trữ bản nháp trực tuyến tối đa 24 giờ'
    ]
  },
  {
    id: 'basic',
    name: 'Cơ bản',
    pricePerMonth: 199000,
    credits: '100 Credits / tháng',
    model: ' (Chính xác)',
    bgClass: 'bg-blue-50/40',
    borderClass: 'border-blue-200 hover:border-blue-400',
    textClass: 'text-blue-700',
    features: [
      'Nhận 100 Credits nạp vào ví mỗi tháng',
      'Quy đổi: Tạo ~100 văn bản hoặc 50 giáo án chi tiết',
      'Không giới hạn số lượng sinh văn bản trong ngày',
      'Hỗ trợ kỹ thuật qua Email phản hồi trong 12 giờ',
      'Kho lưu trữ Văn bản cá nhân: 50MB (Bảo mật AES-256)',
      'Tự động kiểm tra lỗi chính tả & thể thức hành chính'
    ]
  },
  {
    id: 'pro',
    name: 'Chuyên nghiệp',
    pricePerMonth: 549000,
    credits: '300 Credits / tháng',
    model: ' (Mới nhất & Thông minh)',
    bgClass: 'bg-violet-50/40',
    borderClass: 'border-violet-300 hover:border-violet-500',
    textClass: 'text-violet-700',
    features: [
      'Nhận 300 Credits nạp vào ví mỗi tháng',
      'Quy đổi: Soạn ~300 văn bản nghiệp vụ hoặc 150 đề thi',
      'Ưu tiên băng thông AI (Không nghẽn giờ cao điểm)',
      'Hỗ trợ ưu tiên trực tiếp qua Zalo / Hotline riêng',
      'Kho lưu trữ mở rộng: 500MB tài liệu lưu trữ',
      'Mở khóa tính năng API Access kết nối phần mềm nội bộ',
      'Đường truyền riêng tư mã hóa dữ liệu đầu cuối'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Tổ chức / Pro',
    pricePerMonth: 1199000,
    credits: '800 Credits / tháng',
    model: ' (Toàn bộ bằng bộ lõi Claude 4.6 Sonnet)',
    bgClass: 'bg-amber-50/40',
    borderClass: 'border-amber-300 hover:border-amber-500',
    textClass: 'text-amber-700',
    features: [
      'Nhận 800 Credits nạp vào ví mỗi tháng',
      'Quy đổi: Tạo ~800 tài liệu dài (Phù hợp tổ bộ môn / phòng ban)',
      'Team Collaboration: Chia sẻ nhóm tối đa 5 tài khoản',
      'Hỗ trợ kỹ thuật chuyên biệt 24/7 có kỹ sư vận hành riêng',
      'Dung lượng lưu trữ dữ liệu văn phòng: Không giới hạn',
      'Fine-tune nghiệp vụ: Huấn luyện AI theo phong cách riêng',
      'Cam kết chất lượng vận hành ổn định Uptime 99.9%'
    ]
  }
];

const monthOptions = [
  { value: 1, label: '1 tháng', discount: 0 },
  { value: 3, label: '3 tháng', discount: 0 },
  { value: 6, label: '6 tháng', discount: 0.1 },
  { value: 12, label: '12 tháng', discount: 0.2 }
];

export function BillingModal({ isOpen, onClose }: BillingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  const currentDiscount = monthOptions.find(m => m.value === selectedMonths)?.discount || 0;

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    if (plan.pricePerMonth > 0) {
      setShowCheckout(true);
    }
  };

  const calculateTotal = (basePricePerMonth: number) => {
    const rawTotal = basePricePerMonth * selectedMonths;
    return rawTotal * (1 - currentDiscount);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Mock QR dữ liệu đồng bộ
  const qrData = {
    accountNumber: '0123456789',
    bankName: 'Vietcombank',
    accountName: 'CONG TY TNHH AI ASSISTANT',
    amount: selectedPlan ? calculateTotal(selectedPlan.pricePerMonth) : 0,
    memo: `BILL${Date.now().toString().slice(-8)}`
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-gray-100">
        
        {/* ── HEADER MODAL ── */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {showCheckout ? 'Thanh toán đơn hàng bảo mật' : 'Nâng cấp gói dịch vụ Trợ lý AI'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {showCheckout ? 'Quét mã QR qua ứng dụng Ngân hàng để kích hoạt tự động' : 'Mở khóa toàn bộ tính năng biên tập, tối ưu hóa hiệu suất văn phòng nghiệp vụ'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── CONTENT BODY AREA ── */}
        <div className="p-8 overflow-y-auto flex-1 bg-gray-50/40">
          {!showCheckout ? (
            <>
              {/* 🎛️ KHU VỰC CHỌN CHU KỲ SỬ DỤNG (THỜI HẠN) */}
              <div className="mb-8 bg-white border border-gray-200/60 rounded-xl p-5 shadow-sm max-w-md mx-auto">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5 text-center">
                  Chọn chu kỳ hạn dùng (Tiết kiệm khi mua dài hạn)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {monthOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedMonths(option.value)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all relative ${
                        selectedMonths === option.value
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                      {option.discount > 0 && (
                        <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full scale-90 shadow-sm">
                          -{option.discount * 100}%
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 📦 DANH SÁCH CARD BẢNG GIÁ DÀY THÔNG TIN */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {pricingPlans.map((plan) => {
                  const finalTotal = calculateTotal(plan.pricePerMonth);
                  const perMonthComputed = finalTotal / selectedMonths;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => handleSelectPlan(plan)}
                      /* 🎨 ĐÃ ĐỒNG BỘ: Sử dụng các biến bgClass và borderClass kết hợp với hover hiệu ứng sạch */
                      className={`relative border-2 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                        plan.popular
                          ? 'border-blue-600 shadow-lg scale-[1.01]'
                          : `border-gray-200/80 ${plan.bgClass} hover:bg-white`
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-blue-600 text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow">
                            <Zap size={10} /> Phổ biến nhất
                          </span>
                        </div>
                      )}

                      <div>
                        {/* Tên gói & Lõi xử lý AI */}
                        <div className="mb-4">
                          <h3 className="text-base font-bold text-gray-900">{plan.name}</h3>
                          <span className={`text-[10px] font-semibold ${plan.textClass} bg-white/90 border px-2 py-0.5 rounded inline-block mt-1`}>
                            {plan.model}
                          </span>
                        </div>

                        {/* Giá hiển thị động */}
                        <div className="mb-5 pb-4 border-b border-gray-100">
                          {plan.pricePerMonth === 0 ? (
                            <div className="text-2xl font-black text-gray-900">0 ₫</div>
                          ) : (
                            <>
                              <div className="text-2xl font-black text-gray-900 tracking-tight">
                                {formatPrice(finalTotal)}
                              </div>
                              <div className="text-[11px] text-gray-400 font-medium mt-0.5">
                                Tính ra: {formatPrice(perMonthComputed)} / tháng
                              </div>
                              {selectedMonths > 1 && currentDiscount > 0 && (
                                <div className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded inline-block mt-1.5">
                                  Tiết kiệm: {formatPrice((plan.pricePerMonth * selectedMonths) - finalTotal)}
                                </div>
                              )}
                            </>
                          )}
                          <div className="text-xs font-bold text-gray-700 mt-2.5">
                            Cấp phát: <span className="text-blue-600 font-extrabold">{plan.credits}</span>
                          </div>
                        </div>

                        {/* Chi tiết tính năng nghiệp vụ */}
                        <ul className="space-y-2.5 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="text-emerald-500 flex-shrink-0 mt-0.5" size={14} />
                              <span className="text-xs text-gray-600 leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm ${
                          plan.popular
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        {plan.pricePerMonth === 0 ? 'Dùng thử ngay' : 'Đăng ký nâng cấp'} <ArrowRight size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* ── CHECKOUT VIEW ── */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Cột trái: Tóm tắt đơn hàng */}
              <div className="bg-white border border-gray-200/70 shadow-sm rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100 mb-4">
                    Chi tiết hóa đơn dịch vụ
                  </h3>

                  <div className="space-y-3 text-xs mb-5">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gói giải pháp nâng cấp:</span>
                      <span className="font-bold text-gray-800">{selectedPlan?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tổng dung lượng Credits:</span>
                      <span className="font-bold text-blue-600">
                        {selectedPlan ? parseInt(selectedPlan.credits) * selectedMonths : 0} Credits vào tài khoản
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Thời gian duy trì chu kỳ:</span>
                      <span className="font-bold text-gray-800">{selectedMonths} tháng</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 space-y-2.5 text-xs mb-5">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Đơn giá gốc tổng số tháng:</span>
                      <span className="text-gray-700 line-through">
                        {selectedPlan ? formatPrice(selectedPlan.pricePerMonth * selectedMonths) : '0 ₫'}
                      </span>
                    </div>
                    {currentDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Chính sách giảm giá chu kỳ (-{currentDiscount * 100}%):</span>
                        <span>-{selectedPlan ? formatPrice((selectedPlan.pricePerMonth * selectedMonths) * currentDiscount) : '0 ₫'}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="border-t-2 border-dashed border-gray-200 pt-4 mb-5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-900">Tổng kinh phí thanh toán:</span>
                      <span className="text-xl font-black text-blue-600">
                        {selectedPlan ? formatPrice(calculateTotal(selectedPlan.pricePerMonth)) : '0 ₫'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="w-full py-2.5 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-xs font-bold"
                  >
                    ← Quay lại bảng chọn gói
                  </button>
                </div>
              </div>

              {/* Cột phải: Quét mã QR VietQR */}
              {/* ➡️ CỘT BÊN PHẢI: CỔNG QUÉT MÃ QR VIETQR XỊN 100% */}
<div className="bg-white border-2 border-blue-100 rounded-xl p-6 shadow-sm">
  <h3 className="text-sm font-bold text-gray-900 mb-4 text-center flex items-center justify-center gap-1.5">
    <ShieldCheck size={16} className="text-blue-600" /> Cổng quét mã QR chuyển khoản bảo mật
  </h3>

  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
    
    {/* 🎯 ĐÃ NÂNG CẤP: Gọi trực tiếp API VietQR mã hóa tự động số tiền và nội dung chuyển khoản */}
    <div className="bg-white rounded-lg p-4 max-w-[240px] mx-auto shadow-sm border border-gray-200/50 mb-4 text-center">
      {selectedPlan && (
        <img 
          src={`https://img.vietqr.io/image/${qrData.bankName}-${qrData.accountNumber}-qr_only.png?amount=${qrData.amount}&addInfo=${encodeURIComponent(qrData.memo)}&accountName=${encodeURIComponent(qrData.accountName)}`}
          alt="Mã QR Thanh toán VietQR xịn"
          className="w-full aspect-square object-contain mx-auto"
        />
      )}
      <p className="text-[10px] text-gray-400 font-semibold text-center mt-3 tracking-widest uppercase">Quét bằng App Ngân hàng (VietQR)</p>
    </div>

    {/* Thông tin tài khoản nhận */}
    <div className="space-y-2 text-xs">
      <div className="flex justify-between py-1.5 border-b border-gray-200/60">
        <span className="text-gray-500">Đơn vị thụ hưởng:</span>
        <span className="font-bold text-gray-800">{qrData.bankName}</span>
      </div>
      <div className="flex justify-between py-1.5 border-b border-gray-200/60">
        <span className="text-gray-500">Số tài khoản doanh nghiệp:</span>
        <span className="font-bold text-gray-900 font-mono tracking-wide">{qrData.accountNumber}</span>
      </div>
      <div className="flex justify-between py-1.5 border-b border-gray-200/60">
        <span className="text-gray-500">Tên chủ tài khoản:</span>
        <span className="font-bold text-gray-800 uppercase text-[11px]">{qrData.accountName}</span>
      </div>
      <div className="flex justify-between py-1.5 border-b border-gray-200/60">
        <span className="text-gray-500">Giá trị thực chuyển:</span>
        <span className="font-black text-blue-600 text-sm">
          {formatPrice(qrData.amount)}
        </span>
      </div>
      
      {/* 📋 Ô CHỨA MÃ VÀ NÚT COPY THÔNG MINH */}
      <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-3 mt-3 shadow-inner">
        <p className="text-[10px] text-amber-800 mb-1 font-bold uppercase tracking-wider">
          Nội dung chuyển khoản chính xác (BẮT BUỘC):
        </p>
        <div className="flex gap-1.5">
          <p className="flex-1 font-mono font-black text-amber-900 text-base bg-white border border-amber-100 px-3 py-1 rounded-md text-center tracking-wide">
            {qrData.memo}
          </p>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(qrData.memo);
              alert('Đã sao chép nội dung chuyển khoản!');
            }}
            className="px-2.5 bg-amber-600 text-white text-[11px] font-bold rounded-md hover:bg-amber-700 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Chờ cổng thanh toán webhook ngầm & Nút xác nhận thủ công */}
  <div className="space-y-3">
    <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100 flex items-center gap-3">
      <Loader2 className="text-blue-600 animate-spin flex-shrink-0" size={18} />
      <div className="leading-tight">
        <span className="text-xs font-bold text-gray-800">
          Đang đợi lệnh khớp từ phía Ngân hàng...
        </span>
        <p className="text-[10px] text-gray-500 mt-0.5">
          Hệ thống tự động phê duyệt credits sau 3-5 giây khi giao dịch thành công.
        </p>
      </div>
    </div>

    <button
      type="button"
      onClick={() => alert('Hệ thống đang kiểm tra lại giao dịch của bạn trên sao kê, vui lòng đợi trong giây lát!')}
      className="w-full py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-xs font-bold shadow-sm"
    >
      Tôi đã chuyển khoản thành công
    </button>
  </div>
</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}