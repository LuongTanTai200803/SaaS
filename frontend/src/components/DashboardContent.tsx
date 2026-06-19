import { TrendingUp, Users, FileText, Clock } from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

const stats: StatCard[] = [
  {
    title: 'Tổng số truy vấn',
    value: '2,543',
    change: '+12.5%',
    icon: <TrendingUp size={24} />,
    trend: 'up',
  },
  {
    title: 'Người dùng hoạt động',
    value: '186',
    change: '+8.2%',
    icon: <Users size={24} />,
    trend: 'up',
  },
  {
    title: 'Tài liệu đã tạo',
    value: '1,247',
    change: '+18.7%',
    icon: <FileText size={24} />,
    trend: 'up',
  },
  {
    title: 'Thời gian trung bình',
    value: '2.4 phút',
    change: '-5.3%',
    icon: <Clock size={24} />,
    trend: 'down',
  },
];

const recentActivities = [
  {
    id: 1,
    user: 'Trần Thị B',
    action: 'đã tạo giáo án mới',
    assistant: 'Trợ lý Soạn giáo án',
    time: '5 phút trước',
  },
  {
    id: 2,
    user: 'Lê Văn C',
    action: 'đã biên tập văn bản',
    assistant: 'Trợ lý Biên tập & Phát biểu',
    time: '12 phút trước',
  },
  {
    id: 3,
    user: 'Phạm Thị D',
    action: 'đã tạo đề kiểm tra',
    assistant: 'Trợ lý tạo Ma trận & Đề Kiểm tra',
    time: '23 phút trước',
  },
  {
    id: 4,
    user: 'Hoàng Văn E',
    action: 'đã tra cứu văn kiện',
    assistant: 'Trợ lý Văn kiện Đảng',
    time: '1 giờ trước',
  },
];

export function DashboardContent() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Tổng quan</h2>
        <p className="text-sm text-gray-600 mt-1">
          Thống kê hoạt động của hệ thống AI Assistant
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                {stat.icon}
              </div>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  stat.trend === 'up'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">{stat.title}</h3>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hoạt động gần đây
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>{' '}
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.assistant} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Trợ lý phổ biến
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Soạn giáo án', usage: '45%', color: 'bg-blue-500' },
              { name: 'Biên tập & Phát biểu', usage: '28%', color: 'bg-green-500' },
              { name: 'Ma trận & Đề KT', usage: '18%', color: 'bg-yellow-500' },
              { name: 'Văn kiện Đảng', usage: '9%', color: 'bg-purple-500' },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">{item.name}</span>
                  <span className="text-sm font-medium text-gray-900">{item.usage}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: item.usage }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
