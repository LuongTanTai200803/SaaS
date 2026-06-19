import React, { useState } from 'react';
import { TrendingUp, Users, Zap, DollarSign, AlertCircle, CheckCircle, ArrowUp, ArrowDown } from 'lucide-react';

export function ExecutiveDashboard() {
  const [selectedRange, setSelectedRange] = useState<'today' | '7days' | '30days'>('30days');
  const rangeOptions = [
    { key: 'today', label: 'Hôm nay' },
    { key: '7days', label: '7 ngày qua' },
    { key: '30days', label: '30 ngày qua' },
  ];

  const kpiData = [
    {
      title: 'Doanh thu tháng',
      value: '47.293.000 VND',
      change: '+12.5%',
      trend: 'up',
      icon: <DollarSign size={24} />,
      color: 'from-green-500 to-emerald-600',
      sparkline: [20, 35, 28, 42, 38, 45, 47],
    },
    {
      title: 'Người dùng hoạt động',
      value: '2.847',
      change: '+8.2%',
      trend: 'up',
      icon: <Users size={24} />,
      color: 'from-blue-500 to-cyan-600',
      sparkline: [15, 22, 18, 25, 23, 27, 28],
    },
    {
      title: 'Token AI đã dùng',
      value: '12,4M',
      change: '+23.1%',
      trend: 'up',
      icon: <Zap size={24} />,
      color: 'from-purple-500 to-pink-600',
      sparkline: [8, 10, 12, 9, 11, 11.5, 12.4],
    },
    {
      title: 'Hoa hồng đang chờ',
      value: '8.920.000 VND',
      change: '-3.2%',
      trend: 'down',
      icon: <TrendingUp size={24} />,
      color: 'from-orange-500 to-red-600',
      sparkline: [10, 9.5, 9.2, 9, 8.8, 8.9, 8.92],
    },
  ];

  const recentEvents = [
    { id: 1, type: 'success', message: 'Người dùng #1234 nâng cấp lên gói Pro', time: '2 phút trước', icon: <CheckCircle size={16} /> },
    { id: 2, type: 'success', message: 'Gia hạn API thành công cho Cơ quan XYZ', time: '15 phút trước', icon: <CheckCircle size={16} /> },
    { id: 3, type: 'warning', message: 'Cảnh báo bảo mật IP 103.45.67.89', time: '1 giờ trước', icon: <AlertCircle size={16} /> },
    { id: 4, type: 'success', message: 'Khách hàng doanh nghiệp mới: Bộ GD&ĐT', time: '2 giờ trước', icon: <CheckCircle size={16} /> },
    { id: 5, type: 'success', message: 'Đã nhận thanh toán 15.000.000 VND từ người dùng #5678', time: '3 giờ trước', icon: <CheckCircle size={16} /> },
    { id: 6, type: 'warning', message: 'Phát hiện độ trễ API cao (DeepSeek V4)', time: '4 giờ trước', icon: <AlertCircle size={16} /> },
    { id: 7, type: 'warning', message: 'Hệ thống tự động kích hoạt Model dự phòng DeepSeek Flash do API chính quá tải', time: '5 phút trước', icon: <AlertCircle size={16} /> },
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

  const topAssistants = [
    { name: 'Trợ lý Văn kiện Đảng', tokens: 4500000, percent: 36, color: 'bg-cyan-500' },
    { name: 'Trợ lý Soạn Giáo án', tokens: 3200000, percent: 25, color: 'bg-emerald-500' },
    { name: 'Trợ lý Tóm tắt văn bản', tokens: 2100000, percent: 16, color: 'bg-violet-500' },
    { name: 'Trợ lý Hỗ trợ CV', tokens: 1350000, percent: 11, color: 'bg-slate-500' },
    { name: 'Trợ lý Phân tích', tokens: 980000, percent: 8, color: 'bg-slate-500/70' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-slate-100">
        <h1 className="text-2xl font-bold">Bảng điều hành</h1>
        <p className="text-sm text-slate-400 mt-1">Tổng quan thời gian thực về hiệu suất và số liệu hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-slate-900 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white`}>
                {kpi.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {kpi.trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                {kpi.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-100 mb-1">{kpi.value}</div>
            <div className="text-xs text-slate-400 mb-3">{kpi.title}</div>
            <div className="h-8 flex items-end gap-0.5">
              {kpi.sparkline.map((value, i) => (
                <div
                  key={i}
                  className={`flex-1 bg-gradient-to-t ${kpi.color} opacity-60 rounded-t`}
                  style={{ height: `${(value / Math.max(...kpi.sparkline)) * 100}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Doanh thu và Mức sử dụng AI</h2>
              <p className="text-sm text-slate-400">Xu hướng dữ liệu theo khoảng thời gian đã chọn</p>
            </div>
            <div className="flex items-center gap-2 rounded-3xl bg-slate-950/70 border border-slate-800 px-3 py-2 text-xs text-slate-300">
              {rangeOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setSelectedRange(option.key as 'today' | '7days' | '30days')}
                  className={`rounded-full px-3 py-1 transition ${selectedRange === option.key ? 'bg-cyan-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-sky-500" />
              <span className="text-slate-400">Doanh thu (VND)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-slate-400">Token (M)</span>
            </div>
          </div>

          <div className="relative h-[300px]">
            <svg className="w-full h-full" viewBox="0 0 700 300" preserveAspectRatio="none">
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 75}
                  x2="700"
                  y2={i * 75}
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              <path
                d={`M 0 ${300 - (currentChartData[0].revenue / maxRevenue) * 300} ${currentChartData
                  .map((d, i) => `L ${(i / (currentChartData.length - 1)) * 700} ${300 - (d.revenue / maxRevenue) * 300}`)
                  .join(' ')} L 700 300 L 0 300 Z`}
                fill="url(#revenueGradient)"
                opacity="0.3"
              />
              <path
                d={`M 0 ${300 - (currentChartData[0].revenue / maxRevenue) * 300} ${currentChartData
                  .map((d, i) => `L ${(i / (currentChartData.length - 1)) * 700} ${300 - (d.revenue / maxRevenue) * 300}`)
                  .join(' ')}`}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
              />
              <path
                d={`M 0 ${300 - (currentChartData[0].tokens / maxTokens) * 300} ${currentChartData
                  .map((d, i) => `L ${(i / (currentChartData.length - 1)) * 700} ${300 - (d.tokens / maxTokens) * 300}`)
                  .join(' ')}`}
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
              />

              <defs>
                <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 text-xs text-slate-500">
              {currentChartData.map((d, i) => (
                <span key={i} className="text-slate-400">{selectedRange === 'today' ? d.day : `Ngày ${d.day}`}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-4">Top trợ lý AI</h2>
          <div className="space-y-4">
            {topAssistants.map((assistant) => (
              <div key={assistant.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>{assistant.name}</span>
                  <span>{(assistant.tokens / 1000000).toFixed(1)}M Token</span>
                </div>
                <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div className={`${assistant.color} h-full rounded-full`} style={{ width: `${assistant.percent}%` }} />
                </div>
                <div className="text-xs text-slate-500">{assistant.percent}% tổng mức tiêu thụ</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Sự kiện hệ thống gần đây</h2>
        <div className="space-y-3">
          {recentEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 bg-slate-800/60 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors"
            >
              <div className={`mt-0.5 ${event.type === 'success' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {event.icon}
              </div>
              <div className="flex-1 min-w-0 text-slate-200">
                <p className="text-sm">{event.message}</p>
                <p className="text-xs text-slate-400 mt-1">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
