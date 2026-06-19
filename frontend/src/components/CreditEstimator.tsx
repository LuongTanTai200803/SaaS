import React, { useState, useEffect } from 'react';

interface CreditEstimatorProps {
  inputText: string;            // Lấy từ ô nhập text Menu 3
  uploadedFiles: File[];        // Danh sách file từ Menu 2, 3, 5
  selectedModel: string;        // Model được chọn ở Menu 6
  outputSize: 'SHORT' | 'MEDIUM' | 'LONG' | string; // Độ dài ở Menu 6
}

interface CreditBreakdown {
  wordCount: number;
  wordTokens: number;
  wordCredits: number;
  fileCount: number;
  fileSizeKB: number;
  fileCredits: number;
  totalInputCredits: number;
  outputTokens: number;
  outputCredits: number;
  totalCredits: number;
}

export const CreditEstimator: React.FC<CreditEstimatorProps> = ({
  inputText,
  uploadedFiles,
  selectedModel,
  outputSize
}) => {
  const [breakdown, setBreakdown] = useState<CreditBreakdown>({
    wordCount: 0,
    wordTokens: 0,
    wordCredits: 0,
    fileCount: 0,
    fileSizeKB: 0,
    fileCredits: 0,
    totalInputCredits: 0,
    outputTokens: 0,
    outputCredits: 0,
    totalCredits: 0,
  });

  useEffect(() => {
    // ============= TÍNH TOÁN INPUT CREDITS =============

    // 1. Text Input: Số từ * 1.3 = số token
    const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
    const wordTokens = Math.round(wordCount * 1.3);

    // Quy đổi token sang credit: 1000 tokens = 1 credit (giả định)
    // Hoặc có thể điều chỉnh tỷ lệ này theo hệ thống của bạn
    const TOKEN_TO_CREDIT_RATIO = 1000; // 1000 tokens = 1 credit
    const wordCredits = wordTokens / TOKEN_TO_CREDIT_RATIO;

    // 2. File Input: 100KB = 0.2-0.5 credit (lấy trung bình 0.35)
    const totalFileSizeBytes = uploadedFiles.reduce((sum, file) => sum + file.size, 0);
    const totalFileSizeKB = totalFileSizeBytes / 1024;
    const fileCredits = (totalFileSizeKB / 100) * 0.35; // 100KB = 0.35 credit

    const totalInputCredits = wordCredits + fileCredits;

    // ============= TÍNH TOÁN OUTPUT CREDITS =============

    // Base output tokens theo độ dài
    let baseOutputTokens = 500; // SHORT
    if (outputSize === 'MEDIUM' || (typeof outputSize === 'string' && outputSize.toLowerCase().includes('trung bình'))) baseOutputTokens = 1200;
    if (outputSize === 'LONG' || (typeof outputSize === 'string' && (outputSize.toLowerCase().includes('dài') || outputSize.toLowerCase().includes('đầy đủ') || outputSize.toLowerCase().includes('chi tiết')))) baseOutputTokens = 2500;

    // Hệ số nhân theo Model
    let modelMultiplier = 1.0;
    if (selectedModel === 'claude-sonnet-4.6') modelMultiplier = 2.5;
    if (selectedModel === 'gpt-5.4-mini') modelMultiplier = 1.5;
    if (selectedModel === 'deepseek-v4-flash') modelMultiplier = 0.8;

    // Output credits = (tokens / 1000) * model multiplier
    const outputCredits = (baseOutputTokens / TOKEN_TO_CREDIT_RATIO) * modelMultiplier;

    // ============= TỔNG HỢP =============
    const totalCredits = totalInputCredits + outputCredits;

    setBreakdown({
      wordCount,
      wordTokens,
      wordCredits: parseFloat(wordCredits.toFixed(3)),
      fileCount: uploadedFiles.length,
      fileSizeKB: parseFloat(totalFileSizeKB.toFixed(2)),
      fileCredits: parseFloat(fileCredits.toFixed(3)),
      totalInputCredits: parseFloat(totalInputCredits.toFixed(3)),
      outputTokens: baseOutputTokens,
      outputCredits: parseFloat(outputCredits.toFixed(3)),
      totalCredits: parseFloat(totalCredits.toFixed(3)),
    });

  }, [inputText, uploadedFiles, selectedModel, outputSize]);

  // Tạm thời ẩn Credit Estimator để người dùng không bị "xót ví"
  return null;
  
  /* 
  // UI hiển thị tổng Credit
  // return (
  //   <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mt-4">
  //     <div className="flex justify-between items-center text-base font-bold text-blue-900">
  //       <span>Tổng số Credit ước tính:</span>
  //       <span className="text-lg">{breakdown.totalCredits} Credits</span>
  //     </div>
  //   </div>
  // );
  */
};
