import React, { useState } from 'react';
import { ShieldCheck, Settings2, Link2 } from 'lucide-react';

type TabKey = 'general' | 'security' | 'api';

interface SettingsState {
  defaultLanguage: string;
  supportEmail: string;
  signupCreditGift: number;
  maintenanceMode: boolean;
  apiBaseUrl: string;
  apiKeyHeader: string;
  apiAccessEnabled: boolean;
}

export function SystemSettings() {
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [settings, setSettings] = useState<SettingsState>({
    defaultLanguage: 'vi',
    supportEmail: 'support@aipro.vn',
    signupCreditGift: 5,
    maintenanceMode: false,
    apiBaseUrl: 'https://api.aipro.vn/v1',
    apiKeyHeader: 'x-api-key',
    apiAccessEnabled: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Cài đặt hệ thống</h1>
        <p className="text-sm text-slate-400 mt-1">Quản lý cấu hình chung, bảo mật và cổng API cho hệ thống AI.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-2">
          <span className="text-sm text-slate-400">Chọn phân vùng cài đặt</span>
          <div className="inline-flex rounded-full border border-slate-800 bg-slate-900 p-1">
            <button
              onClick={() => setActiveTab('general')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === 'general'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              Cài đặt chung
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === 'security'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              Bảo mật & Hạn mức
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === 'api'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              Cổng API
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-cyan-500 transition-colors"
        >
          Lưu thay đổi
        </button>
      </div>

      {saved && (
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Cài đặt đã được lưu thành công.
        </div>
      )}

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-slate-100">
              <Settings2 size={20} className="text-cyan-400" />
              <div>
                <h2 className="text-lg font-semibold">Cài đặt chung</h2>
                <p className="text-sm text-slate-400">Thiết lập thông tin hiển thị và hỗ trợ hệ thống.</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200">
                <span>Tên ngôn ngữ mặc định</span>
                <input
                  value={settings.defaultLanguage}
                  onChange={(event) => setSettings({ ...settings, defaultLanguage: event.target.value })}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span>Email hỗ trợ</span>
                <input
                  value={settings.supportEmail}
                  onChange={(event) => setSettings({ ...settings, supportEmail: event.target.value })}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-slate-100">
              <ShieldCheck size={20} className="text-cyan-400" />
              <div>
                <h2 className="text-lg font-semibold">Bảo mật & Hạn mức</h2>
                <p className="text-sm text-slate-400">Quản lý các cấu hình bảo mật, hạn mức và ưu đãi trên hệ thống.</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200">
                <span>Tín dụng tặng kèm khi đăng ký</span>
                <input
                  type="number"
                  min={0}
                  value={settings.signupCreditGift}
                  onChange={(event) => setSettings({ ...settings, signupCreditGift: Number(event.target.value) })}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </label>

              <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">Chế độ bảo trì toàn hệ thống</p>
                    <p className="text-xs text-slate-400">Tắt/bật toàn bộ hệ thống cho bảo trì ngắn hạn.</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(event) => setSettings({ ...settings, maintenanceMode: event.target.checked })}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-slate-700 transition peer-checked:bg-cyan-600"></div>
                    <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-slate-100">
              <Link2 size={20} className="text-cyan-400" />
              <div>
                <h2 className="text-lg font-semibold">Cổng API</h2>
                <p className="text-sm text-slate-400">Quản lý đầu mối API và cấu hình truy cập cho dịch vụ.</p>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200">
                <span>Endpoint API</span>
                <input
                  value={settings.apiBaseUrl}
                  onChange={(event) => setSettings({ ...settings, apiBaseUrl: event.target.value })}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span>Header API Key</span>
                <input
                  value={settings.apiKeyHeader}
                  onChange={(event) => setSettings({ ...settings, apiKeyHeader: event.target.value })}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </label>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Bật truy cập cổng API</p>
                  <p className="text-xs text-slate-400">Cho phép hệ thống tiếp nhận yêu cầu API từ bên ngoài.</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.apiAccessEnabled}
                    onChange={(event) => setSettings({ ...settings, apiAccessEnabled: event.target.checked })}
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-slate-700 transition peer-checked:bg-cyan-600"></div>
                  <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
