import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { 
  REMINDER_TYPE_OPTIONS, 
  REMINDER_FREQUENCY_OPTIONS, 
  REMINDER_PRIORITY_OPTIONS,
  NOTIFICATION_CHANNEL_OPTIONS,
  DAYS_OF_WEEK,
  ReminderType,
  ReminderFrequency,
  ReminderPriority,
  NotificationChannel
} from '@/types/reminder';
import type { CreateReminderRequest, UpdateReminderRequest, ReminderResponse } from '@/types/reminder';

const reminderSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề không được vượt quá 200 ký tự'),
  description: z.string().max(1000, 'Mô tả không được vượt quá 1000 ký tự').optional(),
  type: z.nativeEnum(ReminderType),
  scheduledAt: z.string().min(1, 'Thời gian nhắc nhở là bắt buộc'),
  frequency: z.nativeEnum(ReminderFrequency),
  frequencyInterval: z.number().min(1).nullable().optional(),
  priority: z.nativeEnum(ReminderPriority),
  enableNotification: z.boolean(),
  notificationMinutesBefore: z.number().min(0).max(1440),
  notificationChannels: z.array(z.nativeEnum(NotificationChannel)),
  recurrenceEndDate: z.string().optional(),
  maxOccurrences: z.number().min(1).nullable().optional(),
  recurrenceDays: z.array(z.number()).optional(),
  // Type-specific fields
  medicationName: z.string().optional(),
  dosage: z.string().optional(),
  instructions: z.string().optional(),
  doctorName: z.string().optional(),
  clinicName: z.string().optional(),
  clinicAddress: z.string().optional(),
  clinicPhone: z.string().optional(),
  exerciseType: z.string().optional(),
  durationMinutes: z.number().min(1).nullable().optional(),
});

type ReminderFormData = z.infer<typeof reminderSchema>;

interface ReminderFormProps {
  reminder?: ReminderResponse;
  onSubmit: (data: CreateReminderRequest | UpdateReminderRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ReminderForm: React.FC<ReminderFormProps> = ({
  reminder,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const isEditing = !!reminder;
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ReminderFormData>({
    resolver: zodResolver(reminderSchema),
    defaultValues: reminder ? {
      title: reminder.title,
      description: reminder.description || '',
      type: reminder.type,
      scheduledAt: format(new Date(reminder.scheduledAt), "yyyy-MM-dd'T'HH:mm"),
      frequency: reminder.frequency,
      frequencyInterval: reminder.frequencyInterval || undefined,
      priority: reminder.priority,
      enableNotification: reminder.enableNotification,
      notificationMinutesBefore: reminder.notificationMinutesBefore,
      notificationChannels: reminder.notificationChannels,
      recurrenceEndDate: reminder.recurrenceEndDate ? format(new Date(reminder.recurrenceEndDate), 'yyyy-MM-dd') : '',
      maxOccurrences: reminder.maxOccurrences || undefined,
      recurrenceDays: reminder.recurrenceDays,
      medicationName: reminder.medicationName || '',
      dosage: reminder.dosage || '',
      instructions: reminder.instructions || '',
      doctorName: reminder.doctorName || '',
      clinicName: reminder.clinicName || '',
      clinicAddress: reminder.clinicAddress || '',
      clinicPhone: reminder.clinicPhone || '',
      exerciseType: reminder.exerciseType || '',
      durationMinutes: reminder.durationMinutes || undefined,
    } : {
      title: '',
      description: '',
      type: ReminderType.Custom,
      scheduledAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      frequency: ReminderFrequency.Once,
      priority: ReminderPriority.Medium,
      enableNotification: true,
      notificationMinutesBefore: 15,
      notificationChannels: [NotificationChannel.Web],
      recurrenceDays: [],
    }
  });

  const watchedType = watch('type');
  const watchedFrequency = watch('frequency');
  const watchedNotificationChannels = watch('notificationChannels');

  const handleFormSubmit = async (data: ReminderFormData) => {
    try {
      // Clean up null values and convert to proper types
      const cleanedData = {
        ...data,
        frequencyInterval: data.frequencyInterval || undefined,
        maxOccurrences: data.maxOccurrences || undefined,
        durationMinutes: data.durationMinutes || undefined,
        scheduledAt: new Date(data.scheduledAt).toISOString(),
        recurrenceEndDate: data.recurrenceEndDate ? new Date(data.recurrenceEndDate).toISOString() : undefined,
        ...(isEditing && { isActive: true })
      };

      await onSubmit(cleanedData as CreateReminderRequest | UpdateReminderRequest);
    } catch (error) {
      console.error('Error in handleFormSubmit:', error);
    }
  };

  const handleNotificationChannelChange = (channel: NotificationChannel, checked: boolean) => {
    const currentChannels = watchedNotificationChannels || [];
    if (checked) {
      setValue('notificationChannels', [...currentChannels, channel]);
    } else {
      setValue('notificationChannels', currentChannels.filter(c => c !== channel));
    }
  };

  const renderTypeSpecificFields = () => {
    switch (watchedType) {
      case ReminderType.Medication:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên thuốc *
              </label>
              <input
                {...register('medicationName')}
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nhập tên thuốc"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Liều lượng
              </label>
              <input
                {...register('dosage')}
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="VD: 1 viên, 5ml"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hướng dẫn sử dụng
              </label>
              <textarea
                {...register('instructions')}
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Hướng dẫn cách sử dụng thuốc"
              />
            </div>
          </div>
        );

      case ReminderType.Appointment:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên bác sĩ
              </label>
              <input
                {...register('doctorName')}
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nhập tên bác sĩ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên phòng khám/bệnh viện
              </label>
              <input
                {...register('clinicName')}
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Nhập tên phòng khám"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              <input
                {...register('clinicAddress')}
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Địa chỉ phòng khám"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                {...register('clinicPhone')}
                type="tel"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Số điện thoại phòng khám"
              />
            </div>
          </div>
        );

      case ReminderType.Exercise:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại bài tập
              </label>
              <input
                {...register('exerciseType')}
                type="text"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="VD: Chạy bộ, Yoga, Gym"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian (phút)
              </label>
              <input
                {...register('durationMinutes', { valueAsNumber: true })}
                type="number"
                min="1"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="30"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề *
          </label>
          <input
            {...register('title')}
            type="text"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Nhập tiêu đề nhắc nhở"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Mô tả chi tiết về nhắc nhở"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại nhắc nhở *
            </label>
            <select
              {...register('type', { valueAsNumber: true })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {REMINDER_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Độ ưu tiên *
            </label>
            <select
              {...register('priority', { valueAsNumber: true })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {REMINDER_PRIORITY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thời gian nhắc nhở *
          </label>
          <input
            {...register('scheduledAt')}
            type="datetime-local"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
          {errors.scheduledAt && (
            <p className="mt-1 text-sm text-red-600">{errors.scheduledAt.message}</p>
          )}
        </div>
      </div>

      {/* Type-specific fields */}
      {renderTypeSpecificFields()}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Tạo nhắc nhở')}
        </button>
      </div>
    </form>
  );
};
