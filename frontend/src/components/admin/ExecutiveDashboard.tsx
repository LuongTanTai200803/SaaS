import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users,
  Zap,
  DollarSign,
  CreditCard,
} from 'lucide-react';
import api from '../../api';
import type {
  AdminDashboard,
  AdminRevenueAnalytics,
  AdminAiUsageAnalytics,
  PaymentInvoice,
  AdminTopAssistant,

} from '../../api/adminApi';

export function ExecutiveDashboard() {

  // State for managing payment invoices and loading status
  const [invoices, setInvoices] = useState<PaymentInvoice[]>([]);
  const [invoiceLoading, setInvoiceLoading] = useState(true);

  // State for managing the selected date range for the dashboard charts
  const [selectedRange, setSelectedRange] = useState<'today' | '7days' | '30days'>('30days');
  const [revenue, setRevenue] = useState<AdminRevenueAnalytics | null>(null);
  const [aiUsage, setAiUsage] = useState<AdminAiUsageAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [topAssistants, setTopAssistants] = useState<AdminTopAssistant[]>([]);

  // Fetch analytics data (revenue and AI usage) based on the selected date range
  useEffect(() => {
  let cancelled = false;

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);

    try {
      const [
        revenueResponse,
        aiUsageResponse,
        topAssistantsResponse,
      ] = await Promise.all([
        api.adminApi.getRevenue(selectedRange),
        api.adminApi.getAiUsage(selectedRange),
        api.adminApi.getTopAssistants(selectedRange),
      ]);

      if (cancelled) return;

      setRevenue(revenueResponse.data);
      setAiUsage(aiUsageResponse.data);
      setTopAssistants(topAssistantsResponse.data);
    } catch (error) {
      if (!cancelled) {
        console.error(
          '[ExecutiveDashboard] Không thể tải analytics:',
          error
        );
        setRevenue(null);
        setAiUsage(null);
      }
    } finally {
      if (!cancelled) {
        setAnalyticsLoading(false);
      }
    }
  };

  fetchAnalytics();

  return () => {
    cancelled = true;
  };
}, [selectedRange]);


  const rangeOptions = [
    { key: 'today', label: 'Hôm nay' },
    { key: '7days', label: '7 ngày qua' },
    { key: '30days', label: '30 ngày qua' },
  ];
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchAdminData = async () => {
      try {
        const [dashboardResponse, invoiceResponse] = await Promise.all([
          api.adminApi.getDashboard(),
          api.adminApi.getPaymentInvoices(),
        ]);

        if (cancelled) return;

        setDashboard(dashboardResponse.data);

        const invoicePayload = invoiceResponse?.data;
        setInvoices(Array.isArray(invoicePayload) ? invoicePayload : []);
      } catch (error) {
        if (!cancelled) {
          console.error('[ExecutiveDashboard] Không thể tải dữ liệu:', error);
          setInvoices([]);
        }
      } finally {
        if (!cancelled) {
          setInvoiceLoading(false);
        }
      }
    };

    fetchAdminData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!dashboard) {
    return null;
  }



    const kpiData = [
  {
    title: 'Tổng người dùng',
    value: dashboard.userCount.toLocaleString('vi-VN'),
    icon: <Users size={24} />,
    color: 'from-blue-500 to-cyan-600',
  },
  {
    title: 'User đang hoạt động',
    value: dashboard.activeUserCount.toLocaleString('vi-VN'),
    icon: <Users size={24} />,
    color: 'from-emerald-500 to-green-600',
  },
  {
  title: 'Doanh thu',
  value: revenue
    ? `${revenue.totalRevenue.toLocaleString('vi-VN')} VND`
    : 'Đang tải...',
  icon: <DollarSign size={24} />,
  color: 'from-green-500 to-emerald-600',
},
  {
  title: 'Đơn thanh toán',
  value: revenue
    ? revenue.paidInvoiceCount.toLocaleString('vi-VN')
    : 'Đang tải...',
  icon: <TrendingUp size={24} />,
  color: 'from-orange-500 to-amber-600',
},
  {
  title: 'AI calls',
  value: aiUsage
    ? aiUsage.transactionCount.toLocaleString('vi-VN')
    : 'Đang tải...',
  icon: <Zap size={24} />,
  color: 'from-violet-500 to-purple-600',
},
  {
  title: 'Credit đã sử dụng',
  value: aiUsage
    ? aiUsage.creditsConsumed.toLocaleString('vi-VN')
    : 'Đang tải...',
  icon: <CreditCard size={24} />,
  color: 'from-cyan-500 to-blue-600',
},
];


  const chartDataSets = {
    today: [
      { day: '08:00', revenue: 530, tokens: 360 },
      { day: '10:00', revenue: 780, tokens: 520 },
      { day: '12:00', revenue: 910, tokens: 610 },
      { day: '14:00', revenue: 860, tokens: 590 },
      { day: '16:00', revenue: 980, tokens: 680 },
    ],
    '7days': [
      { day: '2', revenue: 1300, tokens: 900 },
      { day: '4', revenue: 1500, tokens: 1020 },
      { day: '6', revenue: 1700, tokens: 1180 },
      { day: '8', revenue: 1600, tokens: 1120 },
      { day: '10', revenue: 1800, tokens: 1250 },
      { day: '12', revenue: 1900, tokens: 1320 },
      { day: '14', revenue: 2100, tokens: 1420 },
    ],
    '30days': [
      { day: '1', revenue: 1200, tokens: 800 },
      { day: '5', revenue: 1800, tokens: 1200 },
      { day: '10', revenue: 2200, tokens: 1600 },
      { day: '15', revenue: 2800, tokens: 2100 },
      { day: '20', revenue: 3200, tokens: 2400 },
      { day: '25', revenue: 3800, tokens: 2900 },
      { day: '30', revenue: 4700, tokens: 3400 },
    ],
  };

  const currentChartData = chartDataSets[selectedRange];
  const maxRevenue = Math.max(...currentChartData.map((d) => d.revenue));
  const maxTokens = Math.max(...currentChartData.map((d) => d.tokens));



  return (
  <div className="space-y-6">
    <div className="text-black">
      <h1 className="text-2xl font-bold">Bảng điều hành</h1>
      <p className="text-sm text-slate-600 mt-1">
        Tổng quan thời gian thực về hiệu suất và số liệu hệ thống
      </p>
    </div>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {kpiData.map((kpi) => (
        <div
          key={kpi.title}
          className="bg-white rounded-xl p-5 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shrink-0`}
            >
              {kpi.icon}
            </div>

            <div className="min-w-0">
              <div className="text-2xl font-bold text-black truncate">
                {kpi.value}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                {kpi.title}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Revenue & AI Usage */}
    <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-4">
      <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-black">
              Doanh thu và Mức sử dụng AI
            </h2>
            <p className="text-sm text-slate-600">
              Xu hướng dữ liệu theo khoảng thời gian đã chọn
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center justify-start gap-2 rounded-xl bg-slate-100 p-2 text-xs text-slate-700 sm:w-auto sm:justify-end">
            {rangeOptions.map((option) => (
              <button
                key={option.key}
                onClick={() =>
                  setSelectedRange(
                    option.key as 'today' | '7days' | '30days'
                  )
                }
                className={`whitespace-nowrap rounded-lg px-3 py-2 transition ${
                  selectedRange === option.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-white hover:text-black'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-sky-500" />
            <span className="text-slate-700">
              Doanh thu (VND)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span className="text-slate-700">
              Token (M)
            </span>
          </div>
        </div>

        <div className="relative h-[300px]">
          <svg
            className="w-full h-full"
            viewBox="0 0 700 300"
            preserveAspectRatio="none"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={i * 75}
                x2="700"
                y2={i * 75}
                stroke="#CBD5E1"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            <path
              d={`M 0 ${
                300 -
                (currentChartData[0].revenue / maxRevenue) * 300
              } ${currentChartData
                .map(
                  (d, i) =>
                    `L ${
                      (i / (currentChartData.length - 1)) * 700
                    } ${
                      300 -
                      (d.revenue / maxRevenue) * 300
                    }`
                )
                .join(' ')} L 700 300 L 0 300 Z`}
              fill="url(#revenueGradient)"
              opacity="0.25"
            />

            <path
              d={`M 0 ${
                300 -
                (currentChartData[0].revenue / maxRevenue) * 300
              } ${currentChartData
                .map(
                  (d, i) =>
                    `L ${
                      (i / (currentChartData.length - 1)) * 700
                    } ${
                      300 -
                      (d.revenue / maxRevenue) * 300
                    }`
                )
                .join(' ')}`}
              fill="none"
              stroke="#2563EB"
              strokeWidth="3"
            />

            <path
              d={`M 0 ${
                300 -
                (currentChartData[0].tokens / maxTokens) * 300
              } ${currentChartData
                .map(
                  (d, i) =>
                    `L ${
                      (i / (currentChartData.length - 1)) * 700
                    } ${
                      300 -
                      (d.tokens / maxTokens) * 300
                    }`
                )
                .join(' ')}`}
              fill="none"
              stroke="#059669"
              strokeWidth="3"
            />

            <defs>
              <linearGradient
                id="revenueGradient"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#2563EB"
                  stopOpacity="0.35"
                />
                <stop
                  offset="100%"
                  stopColor="#2563EB"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 text-xs text-slate-600">
            {currentChartData.map((d, i) => (
              <span key={i}>
                {selectedRange === 'today'
                  ? d.day
                  : `Ngày ${d.day}`}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Top AI Assistants */}
      <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-bold text-black mb-4">
          Top trợ lý AI
        </h2>

        <div className="space-y-4">
          
          {topAssistants.map((assistant) => (
            <div key={assistant.assistantId} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-black">
                <span>{assistant.name}</span>
                <span className="text-slate-700">
                  {(assistant.totalTokens / 1_000_000).toFixed(1)}M Token
                </span>
              </div>

              <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-violet-600"
                  style={{ width: `${assistant.usagePercent}%` }}
                />
              </div>

              <div className="text-xs text-slate-600">
                {assistant.usagePercent}% tổng mức tiêu thụ
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>

    {/* Recent Payment Transactions */}
    <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-black">
            Giao dịch thanh toán gần đây
          </h2>

          <p className="text-sm text-slate-600">
            Các đơn thanh toán mới nhất
          </p>
        </div>
      </div>

      {invoiceLoading ? (
        <div className="py-8 text-center text-sm text-slate-600">
          Đang tải giao dịch...
        </div>
      ) : invoices.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-600">
          Chưa có giao dịch thanh toán.
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.slice(0, 5).map((invoice) => (
            <div
              key={invoice.invoiceId}
              className="flex items-center justify-between gap-4 rounded-lg bg-slate-100 p-3 hover:bg-slate-200 transition-colors"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-black">
                  {invoice.invoiceId}
                </p>

                <p className="text-xs text-slate-700">
                  User: {invoice.userId} · Gói: {invoice.packageType}
                </p>

                <p className="text-xs text-slate-600">
                  {new Date(invoice.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-emerald-700">
                  {invoice.finalAmount.toLocaleString('vi-VN')} VND
                </p>

                <span className="text-xs text-slate-700">
                  {invoice.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}