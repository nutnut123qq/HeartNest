import React, { useState } from 'react';
import { ReminderCard } from './ReminderCard';
import { ReminderFilters } from './ReminderFilters';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import type { ReminderResponse, ReminderFilters as ReminderFiltersType } from '@/types/reminder';
import {
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarDaysIcon
} from '@/components/ui/Icons';

interface ReminderListProps {
  reminders: ReminderResponse[];
  loading?: boolean;
  error?: string | null;
  onEdit?: (reminder: ReminderResponse) => void;
  onDelete?: (id: string) => void;
  onFiltersChange?: (filters: ReminderFiltersType) => void;
  showFilters?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

export const ReminderList: React.FC<ReminderListProps> = ({
  reminders,
  loading = false,
  error = null,
  onEdit,
  onDelete,
  onFiltersChange,
  showFilters = true,
  emptyMessage = "Chưa có nhắc nhở nào",
  emptyDescription = "Tạo nhắc nhở đầu tiên để bắt đầu quản lý sức khỏe của bạn"
}) => {
  const [filters, setFilters] = useState<ReminderFiltersType>({});

  const handleFiltersChange = (newFilters: ReminderFiltersType) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const filterReminders = (reminders: ReminderResponse[]): ReminderResponse[] => {
    return reminders.filter(reminder => {
      // Type filter
      if (filters.type && reminder.type !== filters.type) {
        return false;
      }

      // Priority filter
      if (filters.priority && reminder.priority !== filters.priority) {
        return false;
      }

      // Status filter
      if (filters.status) {
        switch (filters.status) {
          case 'active':
            if (reminder.isCompleted || !reminder.isActive) return false;
            break;
          case 'completed':
            if (!reminder.isCompleted) return false;
            break;
          case 'overdue':
            if (!reminder.isOverdue) return false;
            break;
          case 'today':
            if (!reminder.isToday) return false;
            break;
          case 'upcoming':
            if (!reminder.isUpcoming) return false;
            break;
        }
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const reminderDate = new Date(reminder.scheduledAt);
        if (filters.dateFrom && reminderDate < new Date(filters.dateFrom)) {
          return false;
        }
        if (filters.dateTo && reminderDate > new Date(filters.dateTo)) {
          return false;
        }
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchableText = [
          reminder.title,
          reminder.description,
          reminder.medicationName,
          reminder.doctorName,
          reminder.clinicName,
          reminder.exerciseType
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredReminders = filterReminders(reminders);

  // Group reminders by status for better organization
  const groupedReminders = {
    overdue: filteredReminders.filter(r => r.isOverdue && !r.isCompleted),
    today: filteredReminders.filter(r => r.isToday && !r.isCompleted && !r.isOverdue),
    upcoming: filteredReminders.filter(r => r.isUpcoming && !r.isCompleted && !r.isOverdue && !r.isToday),
    completed: filteredReminders.filter(r => r.isCompleted),
    other: filteredReminders.filter(r => !r.isOverdue && !r.isToday && !r.isUpcoming && !r.isCompleted)
  };

  const ReminderGroup: React.FC<{
    title: string;
    icon: React.ReactNode;
    reminders: ReminderResponse[];
    color: string;
  }> = ({ title, icon, reminders, color }) => {
    if (reminders.length === 0) return null;

    return (
      <div className="mb-6">
        <div className={`flex items-center space-x-2 mb-3 pb-2 border-b border-gray-200`}>
          <div className={color}>{icon}</div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <span className="text-sm text-gray-500">({reminders.length})</span>
        </div>
        <div className="space-y-3">
          {reminders.map(reminder => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Có lỗi xảy ra</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <ReminderFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      )}

      {filteredReminders.length === 0 ? (
        <EmptyState
          icon={<CalendarDaysIcon className="h-12 w-12 text-gray-400" />}
          title={emptyMessage}
          description={emptyDescription}
        />
      ) : (
        <div>
          <ReminderGroup
            title="Quá hạn"
            icon={<ExclamationTriangleIcon className="h-5 w-5" />}
            reminders={groupedReminders.overdue}
            color="text-red-600"
          />
          
          <ReminderGroup
            title="Hôm nay"
            icon={<CalendarDaysIcon className="h-5 w-5" />}
            reminders={groupedReminders.today}
            color="text-orange-600"
          />
          
          <ReminderGroup
            title="Sắp tới"
            icon={<ClockIcon className="h-5 w-5" />}
            reminders={groupedReminders.upcoming}
            color="text-blue-600"
          />
          
          <ReminderGroup
            title="Khác"
            icon={<CalendarDaysIcon className="h-5 w-5" />}
            reminders={groupedReminders.other}
            color="text-gray-600"
          />
          
          <ReminderGroup
            title="Đã hoàn thành"
            icon={<CheckCircleIcon className="h-5 w-5" />}
            reminders={groupedReminders.completed}
            color="text-green-600"
          />
        </div>
      )}
    </div>
  );
};
