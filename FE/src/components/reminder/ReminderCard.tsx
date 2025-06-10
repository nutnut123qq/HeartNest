import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIconSolid
} from '@/components/ui/Icons';
import type { ReminderResponse } from '@/types/reminder';
import { REMINDER_TYPE_OPTIONS, REMINDER_PRIORITY_OPTIONS } from '@/types/reminder';
import { useReminderStore } from '@/store/reminderStore';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface ReminderCardProps {
  reminder: ReminderResponse;
  onEdit?: (reminder: ReminderResponse) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onEdit,
  onDelete,
  compact = false
}) => {
  const { markAsCompleted, markAsIncomplete } = useReminderStore();

  const typeOption = REMINDER_TYPE_OPTIONS.find(opt => opt.value === reminder.type);
  const priorityOption = REMINDER_PRIORITY_OPTIONS.find(opt => opt.value === reminder.priority);

  const handleToggleComplete = async () => {
    try {
      if (reminder.isCompleted) {
        await markAsIncomplete(reminder.id);
      } else {
        await markAsCompleted(reminder.id);
      }
    } catch (error) {
      console.error('Failed to toggle reminder completion:', error);
    }
  };

  const getStatusColor = () => {
    if (reminder.isCompleted) return 'text-green-600 bg-green-50 border-green-200';
    if (reminder.isOverdue) return 'text-red-600 bg-red-50 border-red-200';
    if (reminder.isToday) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (reminder.isUpcoming) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusIcon = () => {
    if (reminder.isCompleted) return <CheckCircleIconSolid className="h-5 w-5 text-green-600" />;
    if (reminder.isOverdue) return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />;
    return <ClockIcon className="h-5 w-5 text-gray-600" />;
  };

  return (
    <div className={`bg-white rounded-lg border-2 ${getStatusColor()} p-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Completion Toggle */}
          <button
            onClick={handleToggleComplete}
            className="mt-1 flex-shrink-0"
          >
            {reminder.isCompleted ? (
              <CheckCircleIconSolid className="h-6 w-6 text-green-600" />
            ) : (
              <CheckCircleIcon className="h-6 w-6 text-gray-400 hover:text-green-600" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">{typeOption?.icon}</span>
              <h3 className={`font-semibold ${reminder.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {reminder.title}
              </h3>
              {priorityOption && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityOption.bgColor} ${priorityOption.color}`}>
                  {priorityOption.label}
                </span>
              )}
            </div>

            {reminder.description && !compact && (
              <p className="text-gray-600 text-sm mb-2">{reminder.description}</p>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                {getStatusIcon()}
                <span>{format(new Date(reminder.scheduledAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
              </div>
              <span className="text-xs">{reminder.timeUntilDueDisplay}</span>
            </div>

            {/* Type-specific info */}
            {!compact && (
              <div className="mt-2 space-y-1">
                {reminder.medicationName && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Thuốc:</span> {reminder.medicationName}
                    {reminder.dosage && <span> - {reminder.dosage}</span>}
                  </div>
                )}
                {reminder.doctorName && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Bác sĩ:</span> {reminder.doctorName}
                    {reminder.clinicName && <span> - {reminder.clinicName}</span>}
                  </div>
                )}
                {reminder.exerciseType && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Bài tập:</span> {reminder.exerciseType}
                    {reminder.durationMinutes && <span> - {reminder.durationMinutes} phút</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100">
              <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onEdit?.(reminder)}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 w-full text-left`}
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span>Chỉnh sửa</span>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => onDelete?.(reminder.id)}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } flex items-center space-x-2 px-4 py-2 text-sm text-red-700 w-full text-left`}
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Xóa</span>
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};
