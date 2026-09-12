import { X } from "lucide-react";
import { Dashboard } from "../Dashboard";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

export function ProfilePanel() {
  const { setShowDashboard } = useAuth();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
        document.body.style.overflow = '';
    };
    }, []);

  return (
    <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]">
      <div className="h-full overflow-y-auto">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-6 min-h-full">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Quản lý cá nhân</h2>

              <button
                type="button"
                onClick={() => setShowDashboard(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Đóng profile"
              >
                <X size={16} />
              </button>
            </div>

            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  );
}