export enum ReminderType {
  Medication = 1,
  Appointment = 2,
  Exercise = 3,
  Checkup = 4,
  Custom = 5
}

export enum ReminderFrequency {
  Once = 1,
  Daily = 2,
  Weekly = 3,
  Monthly = 4,
  Custom = 5
}

export enum ReminderPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}

export enum NotificationChannel {
  Web = 1,
  Email = 2,
  SMS = 3,
  Push = 4
}

export interface CreateReminderRequest {
  title: string;
  description?: string;
  type: ReminderType;
  scheduledAt: string; // ISO date string
  frequency: ReminderFrequency;
  frequencyInterval?: number;
  priority: ReminderPriority;
  assignedToUserId?: string;
  enableNotification: boolean;
  notificationMinutesBefore: number;
  notificationChannels: NotificationChannel[];
  recurrenceEndDate?: string;
  maxOccurrences?: number;
  recurrenceDays?: number[]; // DayOfWeek enum values
  // Medication specific
  medicationName?: string;
  dosage?: string;
  instructions?: string;
  // Appointment specific
  doctorName?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  // Exercise specific
  exerciseType?: string;
  durationMinutes?: number;
  // Custom fields
  customFieldsJson?: string;
}

export interface UpdateReminderRequest extends CreateReminderRequest {
  isActive: boolean;
}

export interface ReminderResponse {
  id: string;
  title: string;
  description?: string;
  type: ReminderType;
  typeDisplay: string;
  scheduledAt: string;
  frequency: ReminderFrequency;
  frequencyDisplay: string;
  frequencyInterval?: number;
  isCompleted: boolean;
  completedAt?: string;
  isActive: boolean;
  priority: ReminderPriority;
  priorityDisplay: string;
  userId: string;
  userName: string;
  assignedToUserId?: string;
  assignedToUserName?: string;
  enableNotification: boolean;
  notificationMinutesBefore: number;
  notificationChannels: NotificationChannel[];
  recurrenceEndDate?: string;
  maxOccurrences?: number;
  recurrenceDays?: number[];
  // Medication specific
  medicationName?: string;
  dosage?: string;
  instructions?: string;
  // Appointment specific
  doctorName?: string;
  clinicName?: string;
  clinicAddress?: string;
  clinicPhone?: string;
  // Exercise specific
  exerciseType?: string;
  durationMinutes?: number;
  // Custom fields
  customFieldsJson?: string;
  // Timestamps
  createdAt: string;
  updatedAt?: string;
  // Computed properties
  isOverdue: boolean;
  isUpcoming: boolean;
  isToday: boolean;
  timeUntilDueDisplay: string;
}

export interface ReminderStatsResponse {
  totalReminders: number;
  completedReminders: number;
  overdueReminders: number;
  todayReminders: number;
  upcomingReminders: number;
  completionRate: number;
}

export interface ReminderFilters {
  type?: ReminderType;
  priority?: ReminderPriority;
  status?: 'active' | 'completed' | 'overdue' | 'today' | 'upcoming';
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

// Helper types for UI
export interface ReminderTypeOption {
  value: ReminderType;
  label: string;
  icon: string;
  color: string;
}

export interface ReminderFrequencyOption {
  value: ReminderFrequency;
  label: string;
  description: string;
}

export interface ReminderPriorityOption {
  value: ReminderPriority;
  label: string;
  color: string;
  bgColor: string;
}

// Constants for UI
export const REMINDER_TYPE_OPTIONS: ReminderTypeOption[] = [
  {
    value: ReminderType.Medication,
    label: 'Thuốc',
    icon: '💊',
    color: 'text-blue-600'
  },
  {
    value: ReminderType.Appointment,
    label: 'Lịch khám',
    icon: '🏥',
    color: 'text-green-600'
  },
  {
    value: ReminderType.Exercise,
    label: 'Tập thể dục',
    icon: '🏃‍♂️',
    color: 'text-orange-600'
  },
  {
    value: ReminderType.Checkup,
    label: 'Kiểm tra sức khỏe',
    icon: '🩺',
    color: 'text-purple-600'
  },
  {
    value: ReminderType.Custom,
    label: 'Tùy chỉnh',
    icon: '📝',
    color: 'text-gray-600'
  }
];

export const REMINDER_FREQUENCY_OPTIONS: ReminderFrequencyOption[] = [
  {
    value: ReminderFrequency.Once,
    label: 'Một lần',
    description: 'Chỉ nhắc nhở một lần'
  },
  {
    value: ReminderFrequency.Daily,
    label: 'Hàng ngày',
    description: 'Lặp lại mỗi ngày'
  },
  {
    value: ReminderFrequency.Weekly,
    label: 'Hàng tuần',
    description: 'Lặp lại mỗi tuần'
  },
  {
    value: ReminderFrequency.Monthly,
    label: 'Hàng tháng',
    description: 'Lặp lại mỗi tháng'
  },
  {
    value: ReminderFrequency.Custom,
    label: 'Tùy chỉnh',
    description: 'Tần suất tùy chỉnh'
  }
];

export const REMINDER_PRIORITY_OPTIONS: ReminderPriorityOption[] = [
  {
    value: ReminderPriority.Low,
    label: 'Thấp',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
  {
    value: ReminderPriority.Medium,
    label: 'Trung bình',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    value: ReminderPriority.High,
    label: 'Cao',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100'
  },
  {
    value: ReminderPriority.Critical,
    label: 'Khẩn cấp',
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  }
];

export const NOTIFICATION_CHANNEL_OPTIONS = [
  {
    value: NotificationChannel.Web,
    label: 'Thông báo web',
    icon: '🌐'
  },
  {
    value: NotificationChannel.Email,
    label: 'Email',
    icon: '📧'
  },
  {
    value: NotificationChannel.SMS,
    label: 'SMS',
    icon: '📱'
  },
  {
    value: NotificationChannel.Push,
    label: 'Push notification',
    icon: '🔔'
  }
];

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Chủ nhật', short: 'CN' },
  { value: 1, label: 'Thứ hai', short: 'T2' },
  { value: 2, label: 'Thứ ba', short: 'T3' },
  { value: 3, label: 'Thứ tư', short: 'T4' },
  { value: 4, label: 'Thứ năm', short: 'T5' },
  { value: 5, label: 'Thứ sáu', short: 'T6' },
  { value: 6, label: 'Thứ bảy', short: 'T7' }
];
