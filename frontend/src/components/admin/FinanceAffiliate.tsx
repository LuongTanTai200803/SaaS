import React, { useState } from 'react';
import { DollarSign, TrendingUp, Link2, Copy, Check, Eye, Download, Filter } from 'lucide-react';

interface Affiliate {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  totalClicks: number;
  conversions: number;
  commission: number;
  status: 'Active' | 'Pending' | 'Paid';
}

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  memoId: string;
  bankName: string;
  status: 'Success' | 'Pending' | 'Failed';
  timestamp: string;
}

export function FinanceAffiliate() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'affiliates' | 'transactions'>('affiliates');

  const affiliates: Affiliate[] = [
    {
      id: 'AFF001',
      name: 'Nguyễn Văn A',
      email: 'vana@partner.vn',
      referralCode: 'PARTNER_VNA2024',
      totalClicks: 1250,
      conversions: 47,
      commission: 2350000,
      status: 'Active',
    },
    {
      id: 'AFF002',
      name: 'Trần Thị B',
      email: 'tranb@agency.vn',
      referralCode: 'AGENCY_TTB2024',
      totalClicks: 890,
      conversions: 32,
      commission: 1600000,
      status: 'Active',
    },
    {
      id: 'AFF003',
      name: 'Lê Minh C',
      email: 'leminc@edu.vn',
      referralCode: 'EDU_LMC2024',
      totalClicks: 2340,
      conversions: 89,
      commission: 4450000,
      status: 'Pending',
    },
  ];

  const transactions: Transaction[] = [
    {
      id: 'TXN001',
      userId: 'USR123',
      userName: 'Hoàng Văn D',
      amount: 15000000,
      memoId: 'AIPRO_USR123_2024',
      bankName: 'Vietcombank',
      status: 'Success',
      timestamp: '2024-06-08 14:23:45',
    },
    {
      id: 'TXN002',
      userId: 'USR456',
      userName: 'Phạm Thu E',
      amount: 5000000,
      memoId: 'AIPRO_USR456_2024',
      bankName: 'Techcombank',
      status: 'Success',
      timestamp: '2024-06-08 13:15:20',
    },
    {
      id: 'TXN003',
      userId: 'USR789',
      userName: 'Đặng Minh F',
      amount: 10000000,
      memoId: 'AIPRO_USR789_2024',
      bankName: 'VPBank',
      status: 'Pending',
      timestamp: '2024-06-08 12:08:10',
    },
    {
      id: 'TXN004',
      userId: 'USR234',
      userName: 'Vũ Thị G',
      amount: 20000000,
      memoId: 'AIPRO_USR234_2024',
      bankName: 'BIDV',
      status: 'Failed',
      timestamp: '2024-06-08 11:45:33',
    },
  ];

  const copyReferralLink = (code: string) => {
    const link = `https://aipro.gov.vn/ref/${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
      case 'Active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Failed':
      case 'Paid':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const translateStatusLabel = (status: string) => {
    switch (status) {
      case 'Success':
      case 'Active':
        return 'Đang hoạt động';
      case 'Pending':
        return 'Đang chờ';
      case 'Paid':
        return 'Đã thanh toán';
      case 'Failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Quản lý Tài chính & Affiliate</h1>
        <p className="text-sm text-slate-400 mt-1">Quản lý chương trình hợp tác và lịch sử giao dịch</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Doanh thu tháng</span>
            <DollarSign size={18} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">245.8M VND</div>
          <div className="text-xs text-green-500 mt-1">+18.2% so với tháng trước</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Đối tác đang hoạt động</span>
            <TrendingUp size={18} className="text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">127</div>
          <div className="text-xs text-slate-400 mt-1">+12 đối tác mới trong tháng</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Hoa hồng chờ duyệt</span>
            <DollarSign size={18} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">8.9M VND</div>
          <div className="text-xs text-slate-400 mt-1">12 khoản thanh toán đang chờ</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">Tỷ lệ chuyển đổi</span>
            <TrendingUp size={18} className="text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">3.7%</div>
          <div className="text-xs text-emerald-400 mt-1">+0.5% cải thiện</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('affiliates')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'affiliates'
                ? 'bg-slate-800 text-slate-100 border-b-2 border-cyan-500'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            Đối tác Affiliate
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'bg-slate-800 text-slate-100 border-b-2 border-cyan-500'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
            }`}
          >
            Giao dịch VietQR
          </button>
        </div>

        {/* Affiliates Table */}
        {activeTab === 'affiliates' && ( /* Changed to blue-800/50 and blue-700 */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-700">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Đối tác</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Link giới thiệu</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Lượt click</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Chuyển đổi</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Hoa hồng</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {affiliates.map((affiliate) => (
                  <tr key={affiliate.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-slate-100">{affiliate.name}</div>
                        <div className="text-xs text-slate-400">{affiliate.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-200 border border-slate-700">
                          {affiliate.referralCode}
                        </code>
                        <button
                          onClick={() => copyReferralLink(affiliate.referralCode)}
                          className="p-1.5 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-slate-100"
                        >
                          {copiedCode === affiliate.referralCode ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link2 size={14} className="text-cyan-400" />
                        <span className="text-sm text-slate-200">{affiliate.totalClicks.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-200">
                        {affiliate.conversions} <span className="text-xs text-slate-400">({((affiliate.conversions / affiliate.totalClicks) * 100).toFixed(1)}%)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-green-400">
                        {affiliate.commission.toLocaleString()} VND
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(affiliate.status)}`}>
                        {translateStatusLabel(affiliate.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors">
                        <Eye size={14} />
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Transactions Table */}
        {activeTab === 'transactions' && (
          <div className="text-slate-100">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors">
                  <Filter size={14} />
                  Bộ lọc
                </button>
                <select className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option>Tất cả ngân hàng</option>
                  <option>Vietcombank</option>
                  <option>Techcombank</option>
                  <option>VPBank</option>
                  <option>BIDV</option>
                </select>
                <select className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option>Tất cả trạng thái</option>
                  <option>Thành công</option>
                  <option>Đang chờ</option>
                  <option>Thất bại</option>
                </select>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-medium transition-colors">
                <Download size={14} />
                Xuất CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-slate-700">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Mã giao dịch</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Người dùng</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Số tiền</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Mã Memo</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Ngân hàng</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Thời gian</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <code className="text-xs font-mono text-cyan-300">{txn.id}</code>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-slate-100">{txn.userName}</div>
                          <div className="text-xs text-slate-400">{txn.userId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-green-400">
                          {txn.amount.toLocaleString()} VND
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-200 border border-slate-700">
                          {txn.memoId}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-200">{txn.bankName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-400">{txn.timestamp}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(txn.status)}`}>
                          {translateStatusLabel(txn.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
