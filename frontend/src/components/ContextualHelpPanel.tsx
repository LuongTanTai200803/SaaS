import { useState, useEffect } from 'react';
import { Info, Plus, Lightbulb, ChevronRight, ChevronLeft } from 'lucide-react';
import { contextualHelpData, FieldHelp } from '../data/contextualHelp';

interface ContextualHelpPanelProps {
  focusedField: string | null;
  onExampleClick?: (value: string) => void;
}

export function ContextualHelpPanel({ focusedField, onExampleClick }: ContextualHelpPanelProps) {
  const [currentHelp, setCurrentHelp] = useState<FieldHelp | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Danh sách các ID có chức năng upload file, sẽ không hiển thị description và examples
  const fieldsWithUpload = [ ''];

  useEffect(() => {
    if (focusedField && contextualHelpData[focusedField]) {
      setCurrentHelp(contextualHelpData[focusedField]);
    } else {
      setCurrentHelp(null);
    }
  }, [focusedField]);

  if (isCollapsed) {
    return (
      <div className="w-12 bg-slate-50 border-l border-gray-200 flex flex-col items-center py-4 transition-all shrink-0 h-full">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 bg-white border border-gray-200 shadow-sm rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          title="Mở rộng hướng dẫn"
        >
          <ChevronLeft size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex-[2] min-w-0 border-l border-gray-200 bg-slate-50 flex flex-col overflow-hidden transition-all">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Lightbulb size={16} className="text-blue-600" />
          <h3 className="font-bold text-gray-900 text-sm">Hướng dẫn Thể thức</h3>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          title="Thu nhỏ panel"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentHelp ? (
          <div className="space-y-4">
            {/* Panel Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🏛️</span>
                <h4 className="font-bold text-slate-800 text-base">
                  Hướng dẫn Mục [{currentHelp.id}]
                </h4>
              </div>
              <div className="text-sm font-semibold text-gray-900 mb-1">
                {currentHelp.title}
              </div>
            </div>

            {/* Description */}
            {!fieldsWithUpload.includes(currentHelp.id) && (
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Info size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                    {currentHelp.description}
                  </div>
                </div>
              </div>
            )}

            {/* Examples */}
            {!fieldsWithUpload.includes(currentHelp.id) && currentHelp.examples && currentHelp.examples.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-blue-900 mb-2">
                  Danh sách mẫu chuẩn hệ thống (Bấm để điền nhanh):
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentHelp.examples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => onExampleClick && onExampleClick(example)}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-xs font-medium text-gray-700 hover:text-blue-700"
                    >
                      <Plus size={12} className="text-gray-400 group-hover:text-blue-600" />
                      <span>{example}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Note */}
            {currentHelp.note && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="text-xs text-amber-800">
                  <strong>Lưu ý:</strong> {currentHelp.note}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lightbulb size={24} className="text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">
              Hướng dẫn ngữ cảnh
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Click vào bất kỳ trường nhập liệu nào để xem hướng dẫn cụ thể và mẫu chuẩn
            </p>
          </div>
        )}
      </div>

      {/* Footer Tips */}
      {!currentHelp && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 flex-shrink-0">
          <div className="text-xs text-gray-600">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
              <span className="font-medium">Mẹo:</span>
            </div>
            <div className="text-gray-500 pl-3">
              Các mẫu chuẩn có thể được điền nhanh bằng 1 cú nhấp chuột
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
