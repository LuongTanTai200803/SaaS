import React, { useState } from 'react';
import {
  LayoutDashboard, Users, CreditCard, Cpu, TrendingUp,
  FileText, Settings, Search, Circle, ChevronDown, LogOut,
  Menu, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExecutiveDashboard } from './ExecutiveDashboard';
import { UserManagement } from './UserManagement';
import { AIModelControls } from './AIModelControls';
import { FinanceAffiliate } from './FinanceAffiliate';
import { TemplateLibrary } from './TemplateLibrary';
import { AuditLogViewer } from './AuditLogViewer';
import { SystemSettings } from './SystemSettings';

type AdminPage = 'dashboard' | 'users' | 'ai-models' | 'finance' | 'templates' | 'audit-logs' | 'settings';

interface SidebarItem {
  id: AdminPage | 'audit-logs' | 'settings' | 'templates';
  label: string;
  icon: React.ReactNode;
}

export function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Bảng điều khiển', icon: <LayoutDashboard size={20} /> },
    { id: 'users', label: 'Quản lý người dùng', icon: <Users size={20} /> },
    { id: 'finance', label: 'Đăng ký & Thanh toán', icon: <CreditCard size={20} /> },
    { id: 'ai-models', label: 'Quản lý Model AI', icon: <Cpu size={20} /> },
    { id: 'templates', label: 'Thư viện mẫu', icon: <FileText size={20} /> },
    { id: 'audit-logs', label: 'Nhật ký kiểm toán', icon: <TrendingUp size={20} /> },
    { id: 'settings', label: 'Cài đặt', icon: <Settings size={20} /> },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'users':
        return <UserManagement />;
      case 'ai-models':
        return <AIModelControls />;
      case 'finance':
        return <FinanceAffiliate />;
      case 'templates':
        return <TemplateLibrary />;
      case 'audit-logs':
        return <AuditLogViewer />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <div className="text-slate-400">Trang đang xây dựng</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-[280px]' : 'w-0'
        } bg-slate-950 border-r border-slate-800 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Cpu size={18} className="text-cyan-300" />
            </div>
              <span className="font-bold text-lg text-slate-100">Quản trị AI</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1 hover:bg-slate-800 rounded"
          >
            <X size={20} className="text-slate-100" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
              }`}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile (Moved to header for better visibility and consistency) */}
        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-900 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-slate-700 flex items-center justify-center text-white font-semibold text-sm">
              A
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-slate-100">Admin User</div>
              <div className="text-xs text-slate-400">admin@example.com</div>
            </div>
            <LogOut size={16} className="text-slate-400 group-hover:text-red-400" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (Adjusted for dark slate theme) */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu size={20} className="text-slate-100" />
            </button>

            {/* Home Button */}
            <button
              onClick={() => navigate('/')}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-sm font-medium transition-colors"
            >
              Về trang chủ
            </button>
            {/* Global Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Tìm kiếm người dùng, giao dịch, nhật ký..." className="w-[400px] pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-slate-100 placeholder:text-slate-500" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* System Health */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-700">
              <Circle size={8} className="fill-emerald-500 text-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-300">API Online</span>
            </div>

            {/* Admin Profile Dropdown */}
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-900 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-slate-700 flex items-center justify-center text-white font-semibold text-sm">
                A
              </div>
              <div className="flex-1 text-left hidden md:block">
                <div className="text-sm font-medium text-slate-100">Quản trị viên</div>
                <div className="text-xs text-slate-400">admin@example.com</div>
              </div>
              <ChevronDown size={16} className="text-slate-400" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-950 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
