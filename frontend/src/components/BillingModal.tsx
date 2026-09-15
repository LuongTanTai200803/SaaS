import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check, Zap, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../api';

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentInfo {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  additionalInfo: string;
}

interface BillingInvoice {
  invoiceId: string;
  packageType: string;
  durationMonths: number;
  memoId: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  qrCodeUrl: string;
  status: string;
  paymentInfo?: PaymentInfo;
  paymentDate?: string | null;
  createdAt?: string;
  userId?: string;
}

  interface PackageApiItem {
    id: number;
    packageType: string;
    packageCategory?: string;
    price: number;
    displayPrice?: string;
    creditLimit?: number | string;
    duration?: number;
    durationHuman?: string;
    allowedModels?: string[];
    description?: string;
    storageQuotaMb?: number;
    isFree?: boolean;
    canPurchase?: boolean;
    badge?: string;
  }

  interface PricingPlan {
    id: string;
    packageType: string;
    packageGroup: 'subscription' | 'credit';
    name: string;
    pricePerMonth: number;
    credits: string;
    model: string;
    features: string[];
    popular?: boolean;
    bgClass: string;
    borderClass: string;
    textClass: string;
  }

const monthOptions = [
  { value: 1, label: '1 tháng', discount: 0 },
  { value: 6, label: '6 tháng', discount: 0.1 },
  { value: 12, label: '12 tháng', discount: 0.2 }
];

const creditOnlyMonthOptions = [{ value: 1, label: '1 tháng', discount: 0 }];


const planToPackageType: Record<string, string> = {
  trial: 'TRIAL',
  basic: 'BASIC',
  pro: 'PRO',
  premium: 'PREMIUM',
};

const POLLING_DURATION_MS = 10 * 60 * 1000;
const POLLING_INTERVAL_MS = 5 * 1000;

export function BillingModal({ isOpen, onClose }: BillingModalProps) {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [selectedMonths, setSelectedMonths] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [invoiceData, setInvoiceData] = useState<BillingInvoice | null>(null);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  // Polling configuration for checking invoice status
  const [pollingDeadline, setPollingDeadline] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
 

  const [invoiceError, setInvoiceError] = useState<string | null>(null);

  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [packageError, setPackageError] = useState<string | null>(null);

  const currentDiscount = monthOptions.find((m) => m.value === selectedMonths)?.discount || 0;

  const [packageFilter, setPackageFilter] = useState<'subscription' | 'credit'>('subscription');
  const visiblePlans = pricingPlans.filter((plan) => plan.packageGroup === packageFilter);

  const getPackageErrorMessage = (error: any) => {
    const status = error?.response?.status;
    const serverMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data?.detail;

    if (status === 404) {
      return 'Hiện tại danh sách gói chưa được mở hoặc chưa có dữ liệu. Vui lòng thử lại sau.';
    }

    if (status === 401) {
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    }

    if (status === 500) {
      return 'Hệ thống đang gặp sự cố khi tải gói. Vui lòng thử lại sau.';
    }

    if (serverMessage) {
      return serverMessage;
    }

    return 'Không tải được danh sách gói. Vui lòng thử lại sau.';
  };

  const isCreditMode = packageFilter === 'credit';

  const activeMonthOptions = isCreditMode ? creditOnlyMonthOptions : monthOptions;

  const calculateTotal = (basePricePerMonth: number) => {
    if (isCreditMode) return basePricePerMonth;
    const rawTotal = basePricePerMonth * selectedMonths;
    return rawTotal * (1 - currentDiscount);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const checkInvoiceStatus = async (invoiceId: string) => {
    try {
      const response = await api.creditApi.getInvoiceStatus(invoiceId);

      const rawStatus =
        response?.data?.data?.status ??
        response?.data?.status ??
        response?.status ??
        'PENDING';

      const nextStatus = String(rawStatus).toUpperCase();

      setInvoiceData((previous) =>
        previous
          ? {
              ...previous,
              status: nextStatus,
            }
          : previous
      );

      return nextStatus;
    } catch (error) {
      console.error('Invoice status check failed:', error);
      return 'PENDING';
    }
  };

  // polling trạng thái hoá đơn
  useEffect(() => {
    const invoiceId = invoiceData?.invoiceId;
    const deadline = pollingDeadline;

    if (
      !invoiceId ||
      invoiceData.status !== 'PENDING' ||
      !deadline
    ) {
      return;
    }

    let cancelled = false;
    let finalCheckStarted = false;

    const poll = async () => {
      if (cancelled) return;

      const now = Date.now();

      if (now >= deadline) {
        if (finalCheckStarted) return;

        finalCheckStarted = true;

        // Kiểm tra lần cuối đúng thời điểm hết 10 phút.
        await checkInvoiceStatus(invoiceId);

        if (!cancelled) {
          setRemainingSeconds(0);
          setPollingDeadline(null);
        }

        return;
      }

      await checkInvoiceStatus(invoiceId);
    };

    const intervalId = window.setInterval(poll, POLLING_INTERVAL_MS);

    // Kiểm tra ngay sau khi mở QR, không phải chờ 5 giây.
    poll();

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [invoiceData?.invoiceId, invoiceData?.status, pollingDeadline]);

  // Cập nhật thời gian còn lại cho việc polling hoá đơn
  useEffect(() => {
    if (!pollingDeadline || invoiceData?.status !== 'PENDING') {
      setRemainingSeconds(0);
      return;
    }

    const updateRemainingTime = () => {
      const remainingMs = Math.max(0, pollingDeadline - Date.now());
      const nextSeconds = Math.ceil(remainingMs / 1000);

      setRemainingSeconds(nextSeconds);

    // Polling effect sẽ thực hiện lần check cuối khi deadline đến.
    };

    updateRemainingTime();

    const timerId = window.setInterval(updateRemainingTime, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [pollingDeadline, invoiceData?.status]);


  // Chuyển hướng người dùng về trang chủ sau khi hoá đơn được thanh toán thành công.
  useEffect(() => {
    if (!isOpen || invoiceData?.status !== 'PAID') {
      return;
    }

    const redirectTimer = window.setTimeout(() => {
      // Xóa trạng thái cũ để mở lại bảng giá không bị redirect lần nữa.
      setInvoiceData(null);
      setShowCheckout(false);
      setPollingDeadline(null);
      setRemainingSeconds(0);

      onClose();

      navigate(
        {
          pathname: '/',
          search: '',
          hash: '',
        },
        {
          replace: true,
        }
      );
    }, 2500);

    return () => {
      window.clearTimeout(redirectTimer);
    };
  }, [isOpen, invoiceData?.status, navigate, onClose]);

  // Chọn gói thanh toán
  const handleSelectPlan = async (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setInvoiceError(null);

    if (plan.pricePerMonth <= 0) {
      setInvoiceData(null);
      setShowCheckout(false);
      return;
    }

    setIsCreatingInvoice(true);

    try {
      const response = await api.creditApi.createInvoice({
        packageType: plan.packageType,
        durationMonths: selectedMonths,
      });

      const payload = response?.data?.data ?? response?.data ?? response;

      const paymentInfo = payload.paymentInfo
      ? {
          bankCode: String(payload.paymentInfo.bankCode ?? ''),
          accountNumber: String(payload.paymentInfo.accountNumber ?? ''),
          accountName: String(payload.paymentInfo.accountName ?? ''),
          amount: Number(payload.paymentInfo.amount ?? payload.finalAmount ?? 0),
          additionalInfo: String(
            payload.paymentInfo.additionalInfo ?? payload.memoId ?? ''
          ),
        }
      : undefined;

    const createdInvoice: BillingInvoice = {
      invoiceId: payload.invoiceId ?? '',
      packageType: payload.packageType ?? plan.packageType,
      durationMonths: Number(payload.durationMonths ?? selectedMonths),
      memoId: payload.memoId ?? '',
      originalAmount: Number(payload.originalAmount ?? 0),
      discountAmount: Number(payload.discountAmount ?? 0),
      finalAmount: Number(payload.finalAmount ?? 0),
      qrCodeUrl: payload.qrCodeUrl ?? '',
      status: String(payload.status ?? 'PENDING').toUpperCase(),
      paymentInfo,
      paymentDate: payload.paymentDate ?? null,
      createdAt: payload.createdAt ?? undefined,
      userId: payload.userId ?? undefined,
    };

      setInvoiceData(createdInvoice);

      if (createdInvoice.status === 'PENDING') {
        setPollingDeadline(Date.now() + POLLING_DURATION_MS);
        setRemainingSeconds(POLLING_DURATION_MS / 1000);
      } else {
        setPollingDeadline(null);
        setRemainingSeconds(0);
      }

      setShowCheckout(true);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Không thể tạo hoá đơn thanh toán.';
      setInvoiceError(message);
      setShowCheckout(false);
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  const handleManualStatusCheck = async () => {
    if (!invoiceData?.invoiceId) return;
    await checkInvoiceStatus(invoiceData.invoiceId);
  };


  useEffect(() => {
    if (!isOpen) return;

    const loadPackages = async () => {
      setIsLoadingPackages(true);
      setPackageError(null);

      try {
        const raw = await api.creditApi.getPackages();

        const data = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw?.result)
              ? raw.result
              : [];

        const mapped: PricingPlan[] = data.map((pkg: PackageApiItem, index: number) => {
        const price = Number(pkg.price ?? 0);
        const creditLimit = pkg.creditLimit ?? 0;

        const normalizedType = String(pkg.packageType ?? pkg.packageCategory ?? '').toUpperCase();
        const packageGroup: 'subscription' | 'credit' =
          normalizedType.includes('CREDIT') || normalizedType.includes('TOKEN') || normalizedType.includes('PACK') && !normalizedType.includes('SUB')
            ? 'credit'
            : 'subscription';

        return {
          id: String(pkg.id ?? pkg.packageType ?? index),
          packageType: pkg.packageType,
          packageGroup,
          name: pkg.packageType || pkg.packageCategory || `Gói ${index + 1}`,
          pricePerMonth: pkg.isFree ? 0 : price,
          credits: pkg.creditLimit ? `${creditLimit} Credits` : 'Theo gói',
          model: 'Model cao cấp',
          features: [
            pkg.description || 'Gói dịch vụ theo nhu cầu',
            `${pkg.duration ?? 1} ${pkg.durationHuman || 'tháng'}`,
            `Bộ nhớ: ${pkg.storageQuotaMb ? `${pkg.storageQuotaMb} MB` : 'Theo cấu hình'}`,
            'Tối ưu AI chuyên nghiệp',
          ],
          popular: !!pkg.badge || index === 1,
          bgClass: index % 2 === 0 ? 'bg-blue-50/40' : 'bg-violet-50/40',
          borderClass: index % 2 === 0 ? 'border-blue-200 hover:border-blue-400' : 'border-violet-200 hover:border-violet-400',
          textClass: index % 2 === 0 ? 'text-blue-700' : 'text-violet-700',
        };
      });

        setPricingPlans(mapped);
      } catch (error: any) {
        setPackageError(getPackageErrorMessage(error));
      } finally {
        setIsLoadingPackages(false);
      }
    };
    loadPackages();
  }, [isOpen]);

  useEffect(() => {
    if (packageFilter === 'credit') {
      setSelectedMonths(1);
    }
  }, [packageFilter]);

  const packageGridClass =
  visiblePlans.length === 1
    ? 'lg:grid-cols-1'
    : visiblePlans.length === 2
      ? 'lg:grid-cols-2'
      : visiblePlans.length === 3
        ? 'lg:grid-cols-3'
        : 'lg:grid-cols-4';

  // Get a user-friendly label for the package type
  const getFriendlyPackageLabel = (planName?: string, packageType?: string) => {
    const raw = (planName ?? packageType ?? '').trim();

    if (!raw) return 'Gói dịch vụ';

    const upper = raw.toUpperCase();

    if (upper.startsWith('CREDIT_')) {
      const value = raw.replace(/^CREDIT_/i, '').trim();
      return value ? `Credit ${value}` : 'Credit';
    }

    if (upper.startsWith('SUB_')) {
      const value = raw.replace(/^SUB_/i, '').trim();
      return value ? `Subscription ${value}` : 'Subscription';
    }

    if (upper.startsWith('PREMIUM')) return 'Premium';
    if (upper.startsWith('PRO')) return 'Pro';
    if (upper.startsWith('BASIC')) return 'Basic';
    if (upper.startsWith('TRIAL')) return 'Trial';

    return raw
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Get a user-friendly label for the package duration
  const getFriendlyDurationLabel = (durationMonths?: number) => {
    const months = Number(durationMonths ?? selectedMonths ?? 1);
    if (months <= 1) return 'Thời hạn dùng trong 1 tháng';
    return `Thời hạn dùng trong ${months} tháng`;
  };

  if (!isOpen) return null;
    if (invoiceData?.status === 'PAID') {
    return <PaymentSuccess />;
  }

  const formatRemainingTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

    return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div
  className={`bg-white rounded-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-gray-100 ${
    showCheckout ? 'max-w-xl' : 'max-w-7xl'
  }`}
>
       
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {showCheckout ? 'Thanh toán đơn hàng bảo mật' : 'Nâng cấp gói dịch vụ Trợ lý AI'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {showCheckout
                ? 'Quét mã QR qua ứng dụng Ngân hàng để kích hoạt tự động'
                : 'Mở khóa toàn bộ tính năng biên tập, tối ưu hóa hiệu suất văn phòng nghiệp vụ'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

          {/* ================== Body ==================== */}
          <div className="p-8 overflow-y-auto flex-1 bg-gray-50/40">
            {!showCheckout ? (
              <>
                {/* ===== 1. CHỌN LOẠI GÓI ===== */}
                <div className="flex justify-center gap-2 mb-8">
                  <button
                    type="button"
                    onClick={() => setPackageFilter('subscription')}
                    className={`py-2 px-4 rounded-lg font-semibold transition-all ${
                      packageFilter === 'subscription'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Subscription
                  </button>

                  <button
                    type="button"
                    onClick={() => setPackageFilter('credit')}
                    className={`py-2 px-4 rounded-lg font-semibold transition-all ${
                      packageFilter === 'credit'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Credit
                  </button>
                </div>

                {/* ===== 2. CHỌN THÁNG CHỈ DÙNG CHO CẢ HAI LOẠI GÓI ===== */}
                <div className="mb-8 bg-white border border-gray-200/60 rounded-xl p-5 shadow-sm max-w-md mx-auto">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5 text-center">
                    {isCreditMode
                      ? 'Chu kỳ sử dụng trong 1 tháng'
                      : 'Chọn chu kỳ hạn dùng (Tiết kiệm khi mua dài hạn)'}
                  </label>

                  <div className={`grid gap-2 ${isCreditMode ? 'grid-cols-1' : 'grid-cols-3'}`}>
                    {activeMonthOptions.map((option) => (
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
                

                {/* ===== 3. TẢI GÓI + HIỂN THỊ LỖI ===== */}
                {isLoadingPackages ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-5 py-3 text-sm text-blue-700">
                      <Loader2 className="animate-spin" size={18} />
                      Đang tải gói dịch vụ...
                    </div>
                  </div>
                ) : packageError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {packageError}
                  </div>
                ) : (
                 <div className="w-full min-h-[420px] flex items-center justify-center">
                  <div className="w-full max-w-6xl">
                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 ${packageGridClass} gap-6 items-stretch justify-center`}
                      >   
                      {visiblePlans.map((plan) => {
                      const finalTotal = calculateTotal(plan.pricePerMonth);
                      const perMonthComputed = isCreditMode ? finalTotal : finalTotal / selectedMonths;

                      return (
                        <div
                          key={plan.id}
                          onClick={() => handleSelectPlan(plan)}
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
                            <div className="mb-4">
                              <h3 className="text-base font-bold text-gray-900">{plan.name}</h3>
                              <span
                                className={`text-[10px] font-semibold ${plan.textClass} bg-white/90 border px-2 py-0.5 rounded inline-block mt-1`}
                              >
                                {plan.model}
                              </span>
                            </div>

                            {/* ===== 4. THÔNG TIN GIÁ CẢ ===== */}
                            <div className="mb-5 pb-4 border-b border-gray-100">
                              {plan.pricePerMonth === 0 ? (
                                <div className="text-2xl font-black text-gray-900">0 ₫</div>
                              ) : (
                                <>
                                  <div className="text-2xl font-black text-gray-900 tracking-tight">
                                    {formatPrice(finalTotal)}
                                  </div>

                                  {!isCreditMode && (
                                    <div className="text-[11px] text-gray-400 font-medium mt-0.5">
                                      Tính ra: {formatPrice(perMonthComputed)} / tháng
                                    </div>
                                  )}

                                  {!isCreditMode && selectedMonths > 1 && currentDiscount > 0 && (
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
                            disabled={isCreatingInvoice}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm ${
                              plan.popular
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-900 text-white hover:bg-gray-800'
                            } disabled:opacity-60 disabled:cursor-not-allowed`}
                          >
                            {isCreatingInvoice && selectedPlan?.id === plan.id
                              ? 'Đang tạo hoá đơn...'
                              : plan.pricePerMonth === 0
                                ? 'Dùng thử ngay'
                                : 'Đăng ký nâng cấp'}{' '}
                            <ArrowRight size={12} />
                          </button>

                        </div>
                      );
                    })}
                  </div>
                  </div> 
               
                </div> /* Close the w-full min-h-[420px] flex items-center justify-center div */
                )}

                {/* End of package selection grid */}
                {/* Invoice error message */}
                {invoiceError && (
                  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {invoiceError}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* ===== 5. CHI TIẾT HÓA ĐƠN / QR ===== */}
               <div className="max-w-xl mx-auto">
  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

    {/* Header */}
    <h3 className="text-sm font-bold text-gray-900 text-center mb-4">
      Thanh toán qua mã QR
    </h3>

    {/* Invoice summary */}
    <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-500">Gói dịch vụ</span>
        <span className="font-bold text-gray-800">
          {getFriendlyPackageLabel(
            selectedPlan?.name,
            invoiceData?.packageType ?? selectedPlan?.packageType
          )}
        </span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-500">Chu kỳ</span>
        <span className="font-bold text-gray-800">
          {getFriendlyDurationLabel(invoiceData?.durationMonths)}
        </span>
      </div>

      <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
        <span className="font-bold text-gray-700">
          Tổng thanh toán
        </span>
        <span className="text-lg font-black text-blue-600">
          {invoiceData
            ? formatPrice(invoiceData.finalAmount)
            : '0 ₫'}
        </span>
      </div>
    </div>

    {/* QR */}
    <div className="flex justify-center mb-4">
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
        {invoiceData?.qrCodeUrl ? (
          <img
            src={invoiceData.qrCodeUrl}
            alt="Mã QR thanh toán VietQR"
            className="w-[220px] h-[220px] object-contain"
          />
        ) : (
          <div className="w-[220px] h-[220px] rounded-lg bg-gray-100 animate-pulse" />
        )}
      </div>
    </div>

    <p className="text-[10px] text-gray-400 text-center mb-4">
      Quét bằng App Ngân hàng (VietQR)
    </p>

    {/* Payment information */}
    <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">

      <div className="flex justify-between px-3 py-2.5 border-b border-gray-100">
        <span className="text-gray-500">Ngân hàng</span>
        <span className="font-bold text-gray-800">
          {invoiceData?.paymentInfo?.bankCode || '—'}
        </span>
      </div>

      <div className="flex justify-between px-3 py-2.5 border-b border-gray-100">
        <span className="text-gray-500">Chủ tài khoản</span>
        <span className="font-bold text-gray-800 text-right">
          {invoiceData?.paymentInfo?.accountName || '—'}
        </span>
      </div>

      <div className="flex justify-between px-3 py-2.5 border-b border-gray-100">
        <span className="text-gray-500">Số tài khoản</span>
        <span className="font-mono font-bold text-gray-800">
          {invoiceData?.paymentInfo?.accountNumber || '—'}
        </span>
      </div>

      <div className="flex justify-between px-3 py-2.5 border-b border-gray-100">
        <span className="text-gray-500">Số tiền</span>
        <span className="font-black text-blue-600">
          {invoiceData
            ? formatPrice(invoiceData.finalAmount)
            : '0 ₫'}
        </span>
      </div>

      <div className="flex justify-between gap-3 px-3 py-2.5">
        <span className="text-gray-500 shrink-0">
          Nội dung CK
        </span>

        <div className="flex items-center gap-1">
          <span className="font-mono font-bold text-gray-800 text-right break-all">
            {invoiceData?.memoId || '—'}
          </span>

          <button
            type="button"
            onClick={() => {
              if (!invoiceData?.memoId) return;
              navigator.clipboard.writeText(invoiceData.memoId);
              alert('Đã sao chép nội dung chuyển khoản!');
            }}
            className="px-2 py-1 text-[10px] bg-blue-600 text-white rounded-md"
          >
            Copy
          </button>
        </div>
      </div>

    </div>

    {/* Warning */}
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3">
      <p className="text-[10px] text-amber-800 font-semibold">
        ⚠ Nhập chính xác số tiền và nội dung chuyển khoản để
        hệ thống tự động xác nhận thanh toán.
      </p>
    </div>

    {/* Status */}
    <div className="mt-3 bg-blue-50 rounded-xl p-3 text-center">

      <p className="text-xs font-semibold text-blue-800">
        {invoiceData?.status === 'PAID'
          ? 'Thanh toán đã hoàn tất'
          : 'Đang chờ xác nhận thanh toán'}
      </p>

      {pollingDeadline && invoiceData?.status !== 'PAID' && (
        <div className="text-2xl font-bold text-blue-700 tabular-nums mt-1">
          {formatRemainingTime(remainingSeconds)}
        </div>
      )}

      <p className="text-[10px] text-blue-600 mt-1">
        Hệ thống đang tự động kiểm tra giao dịch
      </p>
    </div>

    {/* Manual check */}
    <button
      type="button"
      onClick={handleManualStatusCheck}
      disabled={
        !invoiceData?.invoiceId ||
        invoiceData.status === 'PAID' ||
        !pollingDeadline
      }
      className="w-full mt-3 py-2.5 bg-blue-600 text-white rounded-xl
                 hover:bg-blue-700 transition-colors text-xs font-bold
                 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      Kiểm tra trạng thái thanh toán
    </button>

    {/* Back */}
    <button
      type="button"
      onClick={() => setShowCheckout(false)}
      className="w-full mt-2 py-2.5 border border-gray-300 text-gray-600
                 rounded-xl hover:bg-gray-50 transition-colors text-xs font-bold"
    >
      ← Quay lại bảng chọn gói
    </button>

  </div>  {/* bg-white */}
</div>  {/* max-w-xl */}


                      {/* Removed the extra closing button tag */}
              </>
            )}


          </div>
        </div>
      </div>
    );
}
function PaymentSuccess() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-9 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <Check
            size={42}
            strokeWidth={3}
            className="text-emerald-600"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          Thanh toán thành công
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          Gói dịch vụ và Credits đã được cập nhật cho tài khoản của bạn.
        </p>
      </div>
    </div>
  );
}