import React from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  ChartBarIcon
} from '@/components/ui/Icons';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { ReminderStatsResponse } from '@/types/reminder';

interface ReminderStatsCardProps {
  stats: ReminderStatsResponse | null;
  loading?: boolean;
}

export const ReminderStatsCard: React.FC<ReminderStatsCardProps> = ({
  stats,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-500">
          <ChartBarIcon className="h-12 w-12 mx-auto mb-2" />
          <p>Không có dữ liệu thống kê</p>
        </div>
      </div>
    );
  }

  const statItems = [
    {
      label: 'Tổng nhắc nhở',
      value: stats.totalReminders,
      icon: <CalendarDaysIcon className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Đã hoàn thành',
      value: stats.completedReminders,
      icon: <CheckCircleIcon className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Quá hạn',
      value: stats.overdueReminders,
      icon: <ExclamationTriangleIcon className="h-6 w-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      label: 'Hôm nay',
      value: stats.todayReminders,
      icon: <CalendarDaysIcon className="h-6 w-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      label: 'Sắp tới',
      value: stats.upcomingReminders,
      icon: <ClockIcon className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <ChartBarIcon className="h-6 w-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Thống kê</h3>
        </div>

        <div className="space-y-4">
          {statItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <div className={item.color}>
                    {item.icon}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Completion Rate */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Tỷ lệ hoàn thành</span>
            <span className="text-sm font-bold text-gray-900">
              {stats.completionRate.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(stats.completionRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Truy cập nhanh</h4>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
              📅 Nhắc nhở hôm nay
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
              ⚠️ Nhắc nhở quá hạn
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
              🔔 Sắp tới
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
              ✅ Đã hoàn thành
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
