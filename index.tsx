import React from 'react';
import { DashboardPage } from '@/pages/DashboardPage';

/**
 * Khai báo các route tại đây (khi dùng chung với thư viện react-router-dom)
 */
export function AppRoutes() {
  return (
    <div>
      {/* 
        Placeholder: Gắn DashboardPage làm trang mặc định 
      */}
      <DashboardPage />
    </div>
  );
}