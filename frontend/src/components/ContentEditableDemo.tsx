import React, { useState, useRef } from 'react';

/**
 * Component demo để so sánh useState vs useRef cho contentEditable
 * Để test: Gõ chữ vào cả 2 editors và quan sát behavior
 */
export function ContentEditableDemo() {
  const [renderCount, setRenderCount] = useState(0);

  // ❌ WRONG APPROACH: useState
  const [contentWithState, setContentWithState] = useState('Gõ vào đây để test useState (WRONG)...');

  // ✅ CORRECT APPROACH: useRef
  const contentRef = useRef('Gõ vào đây để test useRef (CORRECT)...');
  const editorRef = useRef<HTMLDivElement>(null);

  const handleStateChange = (e: React.FormEvent<HTMLDivElement>) => {
    setContentWithState(e.currentTarget.innerHTML);
    // Trigger re-render để đếm
    setRenderCount(prev => prev + 1);
  };

  const handleRefChange = () => {
    if (editorRef.current) {
      contentRef.current = editorRef.current.innerHTML;
      console.log('Ref updated (no re-render):', contentRef.current.substring(0, 50));
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ContentEditable: useState vs useRef</h1>

      {/* Render counter */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm font-semibold text-blue-900 mb-1">Component Render Count:</div>
        <div className="text-3xl font-bold text-blue-600">{renderCount}</div>
        <div className="text-xs text-blue-600 mt-1">
          Mỗi lần re-render tốn performance. useRef không tăng số này!
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* ❌ useState approach */}
        <div>
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm font-semibold">
              ❌ useState (WRONG)
            </span>
          </div>
          <div
            contentEditable
            suppressContentEditableWarning
            onInput={handleStateChange}
            className="min-h-[200px] p-4 border-2 border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            dangerouslySetInnerHTML={{ __html: contentWithState }}
          />
          <div className="mt-2 text-xs text-red-600">
            <strong>Vấn đề:</strong>
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li>Cursor nhảy về cuối mỗi khi gõ</li>
              <li>Không thể gõ ở giữa text</li>
              <li>Tiếng Việt bị lỗi (â, ơ, ư...)</li>
              <li>Re-render liên tục (xem counter)</li>
            </ul>
          </div>
        </div>

        {/* ✅ useRef approach */}
        <div>
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm font-semibold">
              ✅ useRef (CORRECT)
            </span>
          </div>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleRefChange}
            onBlur={handleRefChange}
            className="min-h-[200px] p-4 border-2 border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            dangerouslySetInnerHTML={{ __html: contentRef.current }}
          />
          <div className="mt-2 text-xs text-green-600">
            <strong>Ưu điểm:</strong>
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li>Cursor giữ nguyên vị trí ✓</li>
              <li>Gõ ở bất kỳ đâu đều OK ✓</li>
              <li>Tiếng Việt hoạt động bình thường ✓</li>
              <li>Không re-render (counter không tăng) ✓</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-6 bg-slate-100 rounded-lg">
        <h2 className="font-bold text-lg mb-3">📋 Hướng dẫn test:</h2>
        <ol className="list-decimal ml-5 space-y-2 text-sm">
          <li>
            <strong>Test 1 - Cursor stability:</strong> Click vào giữa text ở cả 2 editors, rồi gõ chữ.
            <div className="text-xs text-slate-600 ml-4 mt-1">
              ❌ useState: Cursor nhảy về cuối<br />
              ✅ useRef: Cursor ở đúng chỗ
            </div>
          </li>
          <li>
            <strong>Test 2 - Tiếng Việt:</strong> Gõ các từ có dấu: "Việt Nam", "trường học", "người dùng"
            <div className="text-xs text-slate-600 ml-4 mt-1">
              ❌ useState: Lỗi IME, chữ bị lộn xộn<br />
              ✅ useRef: Gõ bình thường
            </div>
          </li>
          <li>
            <strong>Test 3 - Performance:</strong> Gõ nhanh 10-20 ký tự liên tiếp
            <div className="text-xs text-slate-600 ml-4 mt-1">
              ❌ useState: Render count tăng liên tục (lag)<br />
              ✅ useRef: Render count = 0 (mượt mà)
            </div>
          </li>
          <li>
            <strong>Test 4 - Selection:</strong> Chọn (highlight) một đoạn text rồi gõ để replace
            <div className="text-xs text-slate-600 ml-4 mt-1">
              ❌ useState: Selection bị mất<br />
              ✅ useRef: Replace chính xác đoạn đã chọn
            </div>
          </li>
        </ol>
      </div>

      {/* Code comparison */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold mb-2 text-red-700">❌ useState Code:</h3>
          <pre className="bg-red-50 p-4 rounded text-xs overflow-x-auto border border-red-200">
{`const [content, setContent] = useState('');

<div
  contentEditable
  onInput={(e) => setContent(e.currentTarget.innerHTML)}
  dangerouslySetInnerHTML={{ __html: content }}
/>

// ❌ Re-render every keystroke!
// ❌ Cursor lost on re-render
// ❌ IME broken`}
          </pre>
        </div>

        <div>
          <h3 className="font-bold mb-2 text-green-700">✅ useRef Code:</h3>
          <pre className="bg-green-50 p-4 rounded text-xs overflow-x-auto border border-green-200">
{`const contentRef = useRef('');
const editorRef = useRef<HTMLDivElement>(null);

const handleChange = () => {
  contentRef.current = editorRef.current!.innerHTML;
  // No setState → No re-render!
};

<div
  ref={editorRef}
  contentEditable
  onInput={handleChange}
  dangerouslySetInnerHTML={{ __html: contentRef.current }}
/>

// ✅ No re-render
// ✅ Cursor stable
// ✅ IME works`}
          </pre>
        </div>
      </div>
    </div>
  );
}
