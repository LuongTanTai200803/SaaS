import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit, Ban, DollarSign, ChevronDown, MoreVertical, Clock } from 'lucide-react';
import api  from '../../api';
import { AdminUser } from '../../api/adminApi';
import { CreditSummary } from '../../api/userApi';


interface User extends AdminUser {
  displayName: string;
  avatar: string;
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
  const [users, setUsers] = useState<User[]>([]);

  const getUserInitials = (email: string, userId: string) => {
    const source = email || userId;

    return source
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  };

  const mapAdminUser = (
    user: AdminUser,
    creditSummary?: CreditSummary
  ): User => ({
    ...user,
    displayName: user.email || user.userId,
    avatar: getUserInitials(user.email, user.userId),
    creditSummary,
  });


  // Fetch and map admin users to include displayName and avatar
  useEffect(() => {
    let cancelled = false;

    const fetchUsers = async () => {
      try {
        const response = await api.adminApi.getUsers({
          page: 0,
          size: 20,
        });

        if (cancelled) return;

        const userList: AdminUser[] = Array.isArray(response)
          ? response
          : response?.data ?? [];

        const usersWithCreditSummary = await Promise.all(
          userList.map(async (user) => {
            try {
              const creditResponse =
                await api.adminApi.getUserCreditSummary(user.userId);

              return mapAdminUser(
                user,
                creditResponse?.data ?? undefined
              );
            } catch (error) {
              console.error(
                `[UserManagement] Không thể tải credit của user ${user.userId}:`,
                error
              );

              return mapAdminUser(user);
            }
          })
        );

        if (!cancelled) {
          setUsers(usersWithCreditSummary);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            '[UserManagement] Không thể tải danh sách users:',
            error
          );
          setUsers([]);
        }
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, []);



  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterCreditStatus, setFilterCreditStatus] = useState<string>('all');
  const [selectedHistoryUserId, setSelectedHistoryUserId] = useState<string | null>(null);


  const getPlanColor = (packageType: string) => {
    switch (packageType) {
      case 'PREMIUM':
      case 'ENTERPRISE':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'STANDARD':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'FREE':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getPlanLabel = (packageType: string) => {
    switch (packageType) {
      case 'FREE':
        return 'Miễn phí';
      case 'STANDARD':
        return 'Tiêu chuẩn';
      case 'PREMIUM':
        return 'Cao cấp';
      case 'ENTERPRISE':
        return 'Doanh nghiệp';
      default:
        return packageType;
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

  // Calculate the total credits for a user by summing the remaining monthly credits and purchased balance.
  const getTotalCredits = (user: User) => {
    return (
      Number(user.creditSummary?.monthly.remaining ?? 0) +
      Number(user.creditSummary?.purchased.balance ?? 0)
    );
  };

  const getCreditStatus = (user: User) => {
    const totalCredits = getTotalCredits(user);

    if (totalCredits <= 0) return 'zero';
    if (totalCredits < 100) return 'low';

    return 'healthy';
  };


  const matchesCreditFilter = (user: User) => {
  switch (filterCreditStatus) {
    case 'zero':
      return getTotalCredits(user) <= 0;
    case 'low':
      return getTotalCredits(user) > 0 && getTotalCredits(user) < 100;
    default:
      return true;
  }
};

  // đồng bộ 
  const matchesDepartment = (agency: string | null | undefined) => {
    const normalizedAgency = agency?.toLowerCase() ?? '';

    switch (filterDepartment) {
      case 'ministry':
        return normalizedAgency.includes('bộ');

      case 'provincial':
        return (
          normalizedAgency.includes('tỉnh') ||
          normalizedAgency.includes('sở')
        );

      case 'district':
        return (
          normalizedAgency.includes('quận') ||
          normalizedAgency.includes('huyện')
        );

      case 'school_public':
        return normalizedAgency.includes('trường');

      case 'school_private':
        return normalizedAgency.includes('tư thục');

      default:
        return true;
    }
  };

  const filteredUsers = users.filter((user) => {
  const query = searchQuery.toLowerCase();

  const matchesSearch =
    user.displayName.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.userId.toLowerCase().includes(query);

  const matchesPlan =
    filterPlan === 'all' ||
    user.packageType.toLowerCase() === filterPlan;

  return (
    matchesSearch &&
    matchesPlan &&
    matchesDepartment(user.agency) &&
    matchesCreditFilter(user)
  );
});
  


  const selectedHistoryUser = selectedHistoryUserId
  ? users.find((user) => user.userId === selectedHistoryUserId)
  : null;


  return (
  <div className="space-y-6">
    {/* Page Header */}
    <div className="flex items-center justify-between text-black">
      <div>
        <h1 className="text-2xl font-bold text-black">
          Quản lý Người dùng & Đăng ký
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Quản lý người dùng, credit và đăng ký
        </p>
      </div>

      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
        + Thêm người dùng mới
      </button>
    </div>

    {/* Filters & Search */}
    <div className="bg-white ring-1 ring-slate-200 rounded-xl p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Tìm theo tên, email hoặc ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Filter by Plan */}
        <div>
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="all">Tất cả gói</option>
            <option value="free">FREE</option>
            <option value="standard">STANDARD</option>
            <option value="premium">PREMIUM</option>
            <option value="enterprise">ENTERPRISE</option>
          </select>
        </div>

        {/* Filter by Department */}
        <div>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="all">Tất cả tình trạng tín dụng</option>
            <option value="low">Sắp hết hạn {'<10%'}</option>
            <option value="zero">Đã hết Credits (0%)</option>
          </select>
        </div>
      </div>
    </div>

    {/* Data Table */}
    <div className="bg-white ring-1 ring-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
      <tr className="bg-slate-100 border-b border-slate-200">
        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Người dùng
        </th>

        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Thông tin
        </th>

        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Gói
        </th>
          {/* Total Credit */}

        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Số dư credit
        </th>

        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Trạng thái
        </th>

        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Hành động
        </th>
      </tr>
    </thead>

          <tbody className="divide-y divide-slate-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.userId}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {/* User Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold">
                        {user.avatar}
                      </div>

                      <div>
                        <div className="text-sm font-medium text-black">
                          {user.displayName}
                        </div>

                        <div className="text-xs text-slate-600">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Agency and Expiration Info */}
                 <td className="px-6 py-4">
                  <div className="text-sm text-slate-800">
                    {user.agency || 'Chưa cập nhật đơn vị'}
                  </div>

                  <div className="text-xs text-slate-600">
                    ID: {user.userId}
                  </div>

                  <div className="text-xs text-slate-600">
                    Hết hạn:{' '}
                    {user.expireDate
                      ? new Date(user.expireDate).toLocaleDateString('vi-VN')
                      : 'Không có thời hạn'}
                  </div>
                </td>

                  {/* Plan */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getPlanColor(
                          user.packageType
                        )}`}
                      >
                        {getPlanLabel(user.packageType)}
                      </span>
                    </td>

                    {/* Total Credit */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-800">
                        {getTotalCredits(user).toLocaleString('vi-VN')} credits
                      </div>

                      <div className="text-xs text-slate-500">
                        Monthly:{' '}
                        {Number(user.creditSummary?.monthly?.remaining ?? 0).toLocaleString(
                          'vi-VN'
                        )}
                      </div>

                      <div className="text-xs text-slate-500">
                        Đã nạp:{' '}
                        {Number(user.creditSummary?.purchased?.balance ?? 0).toLocaleString(
                          'vi-VN'
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          user.status
                        )}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'ACTIVE'
                              ? 'bg-green-500'
                              : user.status === 'PENDING_VERIFY'
                              ? 'bg-sky-500'
                              : user.status === 'EXPIRED'
                              ? 'bg-orange-500'
                              : 'bg-rose-500'
                          }`}
                        />

                        {getStatusLabel(user.status)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-green-600"
                          title="Nạp thêm credit"
                        >
                          <DollarSign size={16} />
                        </button>

                        <button
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-amber-600"
                          title="Xem lịch sử hoạt động"
                          onClick={() => setSelectedHistoryUserId(user.userId)}
                        >
                          <Clock size={16} />
                        </button>
                      </div>
                    </td>

                
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-600"
                >
                  Không tìm thấy người dùng phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User History */}
      {selectedHistoryUserId && (
        <div className="bg-slate-50 border-t border-slate-200 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <p className="text-lg font-semibold text-black">
                Lịch sử tài liệu gần nhất của{' '}
                {selectedHistoryUser?.displayName ?? 'người dùng'}
              </p>

              <p className="text-sm text-slate-600">
                Danh sách văn bản mà người dùng đã tạo với 9 trợ lý AI để
                minh bạch dữ liệu.
              </p>
            </div>

            <button
              className="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              onClick={() => setSelectedHistoryUserId(null)}
            >
              Đóng lịch sử
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assistantHistory.map((entry) => (
              <div
                key={`${entry.assistant}-${entry.document}`}
                className="rounded-2xl ring-1 ring-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {entry.assistant}
                </p>

                <p className="mt-3 text-sm font-semibold text-black">
                  {entry.document}
                </p>

                <p className="mt-2 text-xs text-slate-600">
                  {entry.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Hiển thị{' '}
          <span className="font-medium text-black">
            1-{Math.max(1, filteredUsers.length)}
          </span>{' '}
          trong tổng số{' '}
          <span className="font-medium text-black">
            {filteredUsers.length}
          </span>{' '}
          người dùng
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white ring-1 ring-slate-300 hover:bg-slate-100 text-slate-700 rounded text-sm transition-colors">
            Trước
          </button>

          <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm shadow-sm">
            1
          </button>

          <button className="px-3 py-1.5 bg-white ring-1 ring-slate-300 hover:bg-slate-100 text-slate-700 rounded text-sm transition-colors">
            2
          </button>

          <button className="px-3 py-1.5 bg-white ring-1 ring-slate-300 hover:bg-slate-100 text-slate-700 rounded text-sm transition-colors">
            3
          </button>

          <button className="px-3 py-1.5 bg-white ring-1 ring-slate-300 hover:bg-slate-100 text-slate-700 rounded text-sm transition-colors">
            Sau
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
