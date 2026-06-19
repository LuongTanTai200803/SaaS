import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: '1',
    label: 'Trợ lý Văn kiện Đảng',
    icon: '🏛️',
  },
  {
    id: '2',
    label: 'Trợ lý Văn bản Nhà nước',
    icon: '🏢',
  },
  {
    id: '3',
    label: 'Trợ lý Quản lý Giáo dục',
    icon: '🎓',
  },
  {
    id: '4',
    label: 'Trợ lý Biên tập & Phát biểu',
    icon: '📚',
  },
  {
    id: '5',
    label: 'Trợ lý Soạn giáo án',
    icon: '📝',
  },
  {
    id: '6',
    label: 'Trợ lý tạo Ma trận & Đề Kiểm tra',
    icon: '📝',
  },
];

interface SidebarProps {
  onNavigate: (page: 'dashboard' | 'exam-generator') => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeItem, setActiveItem] = useState<string>('6');

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const isActive = activeItem === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            setActiveItem(item.id);
            if (hasChildren) {
              toggleItem(item.id);
            } else {
              if (item.id === '6') {
                onNavigate('exam-generator');
              } else {
                onNavigate('dashboard');
              }
            }
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
            isActive
              ? 'bg-blue-50 text-blue-700 border-r-3 border-r-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
          style={{ paddingLeft: `${16 + level * 16}px` }}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="flex-1 text-left text-sm">{item.label}</span>
          {hasChildren && (
            <span className="text-gray-400">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </button>
        {hasChildren && isExpanded && (
          <div>
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Văn phòng số</h1>
        <p className="text-xs text-gray-500 mt-1">AI Assistant Platform</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Version 1.0.0
        </div>
      </div>
    </div>
  );
}
