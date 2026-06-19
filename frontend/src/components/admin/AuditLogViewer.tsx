import React, { useMemo, useState } from 'react';
import { Download, Filter } from 'lucide-react';

type Severity = 'ALL' | 'INFO' | 'WARN' | 'DANGER';

interface AuditLogEntry {
  timestamp: string;
  account: string;
  module: string;
  action: string;
  severity: Severity;
  ip: string;
}

const auditLogs: AuditLogEntry[] = [
  {
    timestamp: '2026-06-18 17:05',
    account: 'admin@example.com',
    module: 'AI Control',
    action: 'Cập nhật Prompt Trợ lý Giáo án',
    severity: 'INFO',
    ip: '192.168.1.5',
  },
  {
    timestamp: '2026-06-18 16:30',
    account: 'hệ_thống',
    module: 'Auth',
    action: 'Phát hiện 5 lần nhập sai mật khẩu từ IP 103.45.67.89',
    severity: 'DANGER',
    ip: '103.45.67.89',
  },
  {
    timestamp: '2026-06-18 15:45',
    account: 'admin@example.com',
    module: 'User Management',
    action: 'Khóa người dùng user123 do vi phạm chính sách',
    severity: 'WARN',
    ip: '192.168.1.12',
  },
  {
    timestamp: '2026-06-18 14:20',
    account: 'admin@example.com',
    module: 'AI Control',
    action: 'Thay đổi cấu hình Model Failover',
    severity: 'INFO',
    ip: '192.168.1.5',
  },
  {
    timestamp: '2026-06-18 13:10',
    account: 'hệ_thống',
    module: 'Billing',
    action: 'Tạo báo cáo thanh toán hàng ngày',
    severity: 'INFO',
    ip: '127.0.0.1',
  },
];

const severityOptions: { value: Severity; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'INFO', label: 'INFO' },
  { value: 'WARN', label: 'WARN' },
  { value: 'DANGER', label: 'DANGER' },
];

const severityStyles: Record<Severity, string> = {
  ALL: 'bg-slate-700 text-slate-200 border-slate-600',
  INFO: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  WARN: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  DANGER: 'bg-red-500/15 text-red-300 border-red-500/30',
};

function downloadCsv(entries: AuditLogEntry[]) {
  const header = ['Thời gian', 'Tài khoản thao tác', 'Phân hệ', 'Hành động', 'Trạng thái', 'Địa chỉ IP'];
  const rows = entries.map((entry) => [
    entry.timestamp,
    entry.account,
    entry.module,
    entry.action,
    entry.severity,
    entry.ip,
  ]);
  const csvContent = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function AuditLogViewer() {
  const [severityFilter, setSeverityFilter] = useState<Severity>('ALL');

  const filteredLogs = useMemo(
    () =>
      severityFilter === 'ALL'
        ? auditLogs
        : auditLogs.filter((entry) => entry.severity === severityFilter),
    [severityFilter]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Nhật ký kiểm toán</h1>
        <p className="text-sm text-slate-400 mt-1">Giám sát các thay đổi hệ thống và hành động người dùng quan trọng.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Filter size={18} className="text-slate-400" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as Severity)}
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {severityOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-slate-950 text-slate-100">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => downloadCsv(filteredLogs)}
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-cyan-500 transition-colors"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-[0.16em] text-xs">
            <tr>
              <th className="px-4 py-4">Thời gian</th>
              <th className="px-4 py-4">Tài khoản</th>
              <th className="px-4 py-4">Phân hệ</th>
              <th className="px-4 py-4">Hành động</th>
              <th className="px-4 py-4">Trạng thái</th>
              <th className="px-4 py-4">Địa chỉ IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {filteredLogs.map((entry, index) => (
              <tr key={`${entry.timestamp}-${index}`} className="hover:bg-slate-950/70 transition-colors">
                <td className="px-4 py-4 align-top text-slate-200">{entry.timestamp}</td>
                <td className="px-4 py-4 align-top text-slate-200">{entry.account}</td>
                <td className="px-4 py-4 align-top text-slate-200">{entry.module}</td>
                <td className="px-4 py-4 align-top text-slate-200 max-w-[300px] break-words">{entry.action}</td>
                <td className="px-4 py-4 align-top">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${severityStyles[entry.severity]}`}>
                    {entry.severity}
                  </span>
                </td>
                <td className="px-4 py-4 align-top text-slate-200">{entry.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
