import { useState } from 'react';
import { X, Check, Zap, Loader2 } from 'lucide-react';

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'trial',
    name: 'Dùng thử',
    price: 0,
    credits: 3,
    duration: '7 ngày',
    features: [
      '3 Credits miễn phí',
      'Claude Haiku 4.5',
      'Hỗ trợ cơ bản',
      'Giới hạn 3 văn bản/ngày'
    ]
  },
  {
    id: 'basic',
    name: 'Cơ bản',
    price: 199000,
    credits: 100,
    duration: 'tháng',
    features: [
      '100 Credits/tháng',
      'Claude Sonnet 4.5',
      'Hỗ trợ email',
      'Không giới hạn văn bản'
    ]
  },
  {
    id: 'pro',
    name: 'Chuyên nghiệp',
    price: 549000,
    credits: 300,
    duration: 'tháng',
    features: [
      '300 Credits/tháng',
      'Claude Sonnet 4.6',
      'Hỗ trợ ưu tiên',
      'API Access'
    ],
    popular: true
  },
  {
    id: 'premium',
    name: 'Pro',
    price: 1199000,
    credits: 800,
    duration: 'tháng',
    features: [
      '800 Credits/tháng',
      'Toàn bộ bằng Claude Sonnet 4.6',
      'Hỗ trợ 24/7',
      'Team collaboration'
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

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    if (plan.price > 0) {
      setShowCheckout(true);
    }
  };

  const calculateTotal = () => {
    if (!selectedPlan) return 0;
    const monthOption = monthOptions.find(m => m.value === selectedMonths);
    const basePrice = selectedPlan.price * selectedMonths;
    const discount = monthOption ? monthOption.discount : 0;
    return basePrice * (1 - discount);
  };

  const calculateDiscount = () => {
    if (!selectedPlan) return 0;
    const monthOption = monthOptions.find(m => m.value === selectedMonths);
    const discount = monthOption ? monthOption.discount : 0;
    return selectedPlan.price * selectedMonths * discount;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Mock QR data
  const qrData = {
    accountNumber: '0123456789',
    bankName: 'Vietcombank',
    accountName: 'CONG TY TNHH AI ASSISTANT',
    amount: calculateTotal(),
    memo: `BILL${Date.now().toString().slice(-8)}`
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {showCheckout ? 'Thanh toán đơn hàng' : 'Chọn gói dịch vụ'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {showCheckout ? 'Quét mã QR để hoàn tất thanh toán' : 'Lựa chọn gói phù hợp với nhu cầu của bạn'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {!showCheckout ? (
            <>
              {/* Month Selector */}
              <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Chọn thời hạn sử dụng
                </label>
                <select
                  value={selectedMonths}
                  onChange={(e) => setSelectedMonths(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-base font-medium"
                >
                  {monthOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                      {option.discount > 0 && ` - Giảm ${option.discount * 100}%`}
                    </option>
                  ))}
                </select>
                {selectedMonths === 12 && (
                  <p className="text-sm text-blue-700 mt-2 font-medium">
                    🎉 Tiết kiệm 20% khi mua gói 12 tháng!
                  </p>
                )}
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pricingPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative border-2 rounded-xl p-6 transition-all hover:shadow-lg cursor-pointer ${
                      plan.popular
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Zap size={14} />
                          Phổ biến
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="mb-2">
                        <span className="text-3xl font-bold text-gray-900">
                          {formatPrice(plan.price * selectedMonths * (1 - (monthOptions.find(m => m.value === selectedMonths)?.discount || 0)))}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {plan.credits} Credits / {selectedMonths} {plan.duration}
                      </p>
                      {selectedMonths > 1 && plan.price > 0 && (
                        <p className="text-xs text-gray-500 line-through mt-1">
                          {formatPrice(plan.price * selectedMonths)}
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                        plan.popular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {plan.price === 0 ? 'Dùng thử ngay' : 'Chọn gói này'}
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Checkout View */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Invoice Summary */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Thông tin hóa đơn</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Gói dịch vụ:</span>
                    <span className="font-semibold text-gray-900">{selectedPlan?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Số Credits:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedPlan?.credits} x {selectedMonths} = {(selectedPlan?.credits || 0) * selectedMonths} Credits
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Thời hạn:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedMonths} tháng
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4 space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tạm tính:</span>
                    <span className="text-gray-900">
                      {formatPrice((selectedPlan?.price || 0) * selectedMonths)}
                    </span>
                  </div>
                  {calculateDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá ({monthOptions.find(m => m.value === selectedMonths)?.discount! * 100}%):</span>
                      <span>-{formatPrice(calculateDiscount())}</span>
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-gray-300 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Tổng thanh toán:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckout(false)}
                  className="w-full mt-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  ← Chọn gói khác
                </button>
              </div>

              {/* Right: QR Code Payment */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
                  Quét mã QR để thanh toán
                </h3>

                {/* QR Code */}
                <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
                  <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="w-64 h-64 bg-white border-4 border-gray-300 mx-auto mb-2 flex items-center justify-center">
                        {/* Placeholder QR Code pattern */}
                        <div className="grid grid-cols-8 gap-1 p-4">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 ${
                                Math.random() > 0.5 ? 'bg-black' : 'bg-white'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">VietQR Code</p>
                    </div>
                  </div>

                  {/* Bank Info */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Ngân hàng:</span>
                      <span className="font-bold text-gray-900">{qrData.bankName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Số tài khoản:</span>
                      <span className="font-bold text-gray-900 font-mono">{qrData.accountNumber}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Chủ tài khoản:</span>
                      <span className="font-bold text-gray-900">{qrData.accountName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Số tiền:</span>
                      <span className="font-bold text-blue-600 text-lg">
                        {formatPrice(qrData.amount)}
                      </span>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                      <p className="text-xs text-gray-700 mb-1 font-semibold">
                        Nội dung chuyển khoản (BẮT BUỘC):
                      </p>
                      <p className="font-mono font-bold text-gray-900 text-base">
                        {qrData.memo}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Loading Status */}
                <div className="bg-white rounded-lg p-4 border-2 border-blue-300">
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="text-blue-600 animate-spin" size={20} />
                    <span className="text-sm text-gray-700">
                      Hệ thống đang chờ tín hiệu ngân hàng...
                    </span>
                  </div>
                  <p className="text-xs text-center text-gray-600 mt-2">
                    Tự động kích hoạt dưới 5 giây khi nhận được tiền
                  </p>
                </div>

                <div className="mt-4 bg-blue-100 border border-blue-300 rounded-lg p-4">
                  <p className="text-xs text-blue-900 text-center">
                    💡 <strong>Lưu ý:</strong> Vui lòng nhập chính xác nội dung chuyển khoản để hệ thống tự động xác nhận thanh toán
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
