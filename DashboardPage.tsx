import React from 'react';
import { DashboardContent } from '@/features/dashboard/DashboardContent';

export function DashboardPage() {
  return (
    <div className="flex w-full h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        {/* DashboardContent ở features giờ được nhúng vào Page này */}
        <DashboardContent />
      </div>
    </div>
  );
}