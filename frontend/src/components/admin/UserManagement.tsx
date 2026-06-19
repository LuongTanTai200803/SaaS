import React, { useState } from 'react';
import { Search, Filter, Edit, Ban, DollarSign, ChevronDown, MoreVertical, Clock } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  agency: string;
  plan: 'Basic' | 'Pro' | 'Enterprise';
  creditBalance: number;
  creditLimit: number;
  status: 'ACTIVE' | 'PENDING_VERIFY' | 'EXPIRED' | 'SUSPENDED';
  lastActive: string;
}

const assistantHistory = [
  { assistant: 'Văn kiện', document: 'Dự thảo Nghị quyết nhân sự', date: '16/06/2026' },
  { assistant: 'Giáo án', document: 'Kế hoạch dạy học Toán 10', date: '16/06/2026' },
  { assistant: 'Văn bản NN', document: 'Công văn triển khai đơn giá', date: '15/06/2026' },
  { assistant: 'Tổng hợp', document: 'Báo cáo tổng kết tháng 5', date: '15/06/2026' },
  { assistant: 'Hỗ trợ CV', document: 'Mẫu quyết định khen thưởng', date: '14/06/2026' },
  { assistant: 'Phân tích', document: 'Tổng hợp số liệu tuyển sinh', date: '14/06/2026' },
  { assistant: 'Đánh giá', document: 'Báo cáo kiểm tra nội bộ', date: '13/06/2026' },
  { assistant: 'Chấm điểm', document: 'Phiếu chấm thi học kỳ', date: '13/06/2026' },
  { assistant: 'Lập lịch', document: 'Lịch đào tạo nội bộ', date: '12/06/2026' },
];

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterCreditStatus, setFilterCreditStatus] = useState<string>('all');
  const [selectedHistoryUserId, setSelectedHistoryUserId] = useState<string | null>(null);

  const users: User[] = [
    {
      id: 'USR001',
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@education.gov.vn',
      avatar: 'A',
      agency: 'Bộ Giáo dục',
      plan: 'Enterprise',
      creditBalance: 8500,
      creditLimit: 10000,
      status: 'ACTIVE',
      lastActive: '2 phút trước',
    },
    {
      id: 'USR002',
      name: 'Trần Thị Bình',
      email: 'binh.tran@tinh.gov.vn',
      avatar: 'B',
      agency: 'Tỉnh ủy',
      plan: 'Pro',
      creditBalance: 450,
      creditLimit: 5000,
      status: 'PENDING_VERIFY',
      lastActive: '1 giờ trước',
    },
    {
      id: 'USR003',
      name: 'Lê Minh Cường',
      email: 'cuong.le@truongthptnguyendu.vn',
      avatar: 'C',
      agency: 'Trường THPT Nguyễn Du',
      plan: 'Basic',
      creditBalance: 0,
      creditLimit: 1000,
      status: 'EXPIRED',
      lastActive: '3 giờ trước',
    },
    {
      id: 'USR004',
      name: 'Phạm Thu Dung',
      email: 'dung.pham@trunguong.gov.vn',
      avatar: 'D',
      agency: 'Cơ quan Trung ương',
      plan: 'Pro',
      creditBalance: 4800,
      creditLimit: 5000,
      status: 'SUSPENDED',
      lastActive: '2 ngày trước',
    },
    {
      id: 'USR005',
      name: 'Hoàng Văn Em',
      email: 'em.hoang@finance.gov.vn',
      avatar: 'E',
      agency: 'Sở Tài chính',
      plan: 'Enterprise',
      creditBalance: 9850,
      creditLimit: 20000,
      status: 'PENDING_VERIFY',
      lastActive: '10 phút trước',
    },
  ];

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Enterprise':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Pro':
        return 'bg-slate-500/20 text-cyan-300 border-cyan-500/30';
      case 'Basic':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'Enterprise':
        return 'Doanh nghiệp';
      case 'Pro':
        return 'Pro';
      case 'Basic':
        return 'Cơ bản';
      default:
        return plan;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang hoạt động';
      case 'PENDING_VERIFY':
        return 'Chờ xác minh';
      case 'EXPIRED':
        return 'Hết hạn';
      case 'SUSPENDED':
        return 'Tạm khóa';
      default:
        return status;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'PENDING_VERIFY':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'EXPIRED':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'SUSPENDED':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getCreditStatus = (user: User) => {
    const ratio = user.creditLimit === 0 ? 0 : user.creditBalance / user.creditLimit;
    if (ratio === 0) return 'zero';
    if (ratio < 0.1) return 'low';
    return 'healthy';
  };

  const matchesDepartment = (agency: string) => {
    switch (filterDepartment) {
      case 'ministry':
        return agency.includes('Bộ');
      case 'provincial':
        return agency.includes('Tỉnh') || agency.includes('Sở');
      case 'district':
        return agency.includes('Quận') || agency.includes('Huyện');
      case 'school_public':
        return agency.includes('Trường');
      case 'school_private':
        return agency.includes('Tư thục');
      default:
        return true;
    }
  };

  const matchesCreditFilter = (user: User) => {
    switch (filterCreditStatus) {
      case 'low':
        return getCreditStatus(user) === 'low';
      case 'zero':
        return getCreditStatus(user) === 'zero';
      default:
        return true;
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = filterPlan === 'all' || user.plan.toLowerCase() === filterPlan;
    return matchesSearch && matchesPlan && matchesDepartment(user.agency) && matchesCreditFilter(user);
  });

  const selectedHistoryUser = selectedHistoryUserId ? users.find((user) => user.id === selectedHistoryUserId) : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between text-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Quản lý Người dùng & Đăng ký</h1>
          <p className="text-sm text-slate-400 mt-1">Quản lý người dùng, credit và đăng ký</p>
        </div>
        <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors">
          + Thêm người dùng mới
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Tìm theo tên, email hoặc ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-100 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Filter by Plan */}
          <div>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100"
            >
              <option value="all">Tất cả gói</option>
              <option value="basic">Cơ bản</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Doanh nghiệp</option>
            </select>
          </div>

          {/* Filter by Department */}
          <div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100"
            >
              <option value="all">Tất cả đơn vị</option>
              <optgroup label="Cơ quan">
                <option value="ministry">Bộ</option>
                <option value="provincial">Tỉnh/TP</option>
                <option value="district">Quận/Huyện</option>
              </optgroup>
              <optgroup label="Trường học">
                <option value="school_public">Trường công lập</option>
                <option value="school_private">Trường tư thục</option>
              </optgroup>
            </select>
          </div>

          <div>
            <select
              value={filterCreditStatus}
              onChange={(e) => setFilterCreditStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100"
            >
              <option value="all">Tất cả tình trạng tín dụng</option>
              <option value="low">Sắp hết hạn {'<10%'} </option>
              <option value="zero">Đã hết Credits (0%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Đơn vị
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Gói
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Số dư credit
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-slate-700 flex items-center justify-center text-white font-semibold">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-100">{user.name}</div>
                          <div className="text-xs text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>

                  {/* Agency */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-300">{user.agency}</div>
                    <div className="text-xs text-slate-400">ID: {user.id}</div>
                  </td>

                  {/* Plan */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getPlanColor(user.plan)}`}>
                      {getPlanLabel(user.plan)}
                    </span>
                  </td>

                  {/* Credit Balance */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          {user.creditBalance.toLocaleString()} / {user.creditLimit.toLocaleString()}
                        </span>
                        <span className="text-slate-400">
                          {Math.round((user.creditBalance / user.creditLimit) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            user.creditBalance / user.creditLimit > 0.7
                              ? 'bg-green-500'
                              : user.creditBalance / user.creditLimit > 0.3
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${(user.creditBalance / user.creditLimit) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(user.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        user.status === 'ACTIVE' ? 'bg-green-500' : user.status === 'PENDING_VERIFY' ? 'bg-sky-500' : user.status === 'EXPIRED' ? 'bg-orange-500' : 'bg-rose-500'
                      }`} />
                      {getStatusLabel(user.status)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-slate-100"
                        title="Chỉnh sửa người dùng"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-green-400"
                        title="Nạp thêm credit"
                      >
                        <DollarSign size={16} />
                      </button>
                      <button
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-amber-300"
                        title="Xem lịch sử hoạt động"
                        onClick={() => setSelectedHistoryUserId(user.id)}
                      >
                        <Clock size={16} />
                      </button>
                      <button
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300 hover:text-red-400"
                        title="Khóa tài khoản"
                      >
                        <Ban size={16} />
                      </button>
                      <button
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-300"
                        title="Thêm hành động"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Không tìm thấy người dùng phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedHistoryUserId && (
          <div className="bg-slate-950 border-t border-slate-800 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <p className="text-lg font-semibold text-slate-100">Lịch sử tài liệu gần nhất của {selectedHistoryUser?.name ?? 'người dùng'}</p>
                <p className="text-sm text-slate-400">
                  Danh sách văn bản mà người dùng đã tạo với 9 trợ lý AI để minh bạch dữ liệu.
                </p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                onClick={() => setSelectedHistoryUserId(null)}
              >
                Đóng lịch sử
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {assistantHistory.map((entry) => (
                <div key={`${entry.assistant}-${entry.document}`} className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{entry.assistant}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-100">{entry.document}</p>
                  <p className="mt-2 text-xs text-slate-500">{entry.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-sm text-slate-400">
            Hiển thị <span className="font-medium text-slate-300">1-{Math.max(1, filteredUsers.length)}</span> trong tổng số{' '}
            <span className="font-medium text-slate-300">{filteredUsers.length}</span> người dùng
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm transition-colors">
              Trước
            </button>
            <button className="px-3 py-1.5 bg-cyan-600 text-white rounded text-sm">1</button>
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm transition-colors">
              3
            </button>
            <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-sm transition-colors">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
