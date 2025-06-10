import { api } from '@/lib/api';
import type { 
  CreateReminderRequest, 
  UpdateReminderRequest, 
  ReminderResponse, 
  ReminderStatsResponse,
  ReminderType 
} from '@/types/reminder';
import type { ApiResponse } from '@/types';

export const reminderService = {
  // Get all reminders
  async getReminders(): Promise<ReminderResponse[]> {
    const response = await api.get<ApiResponse<ReminderResponse[]>>('/api/reminder');
    return response.data.data || [];
  },

  // Get reminder by ID
  async getReminderById(id: string): Promise<ReminderResponse> {
    const response = await api.get<ApiResponse<ReminderResponse>>(`/api/reminder/${id}`);
    if (!response.data.data) {
      throw new Error('Reminder not found');
    }
    return response.data.data;
  },

  // Get upcoming reminders
  async getUpcomingReminders(hours: number = 24): Promise<ReminderResponse[]> {
    const response = await api.get<ApiResponse<ReminderResponse[]>>(`/api/reminder/upcoming?hours=${hours}`);
    return response.data.data || [];
  },

  // Get overdue reminders
  async getOverdueReminders(): Promise<ReminderResponse[]> {
    const response = await api.get<ApiResponse<ReminderResponse[]>>('/api/reminder/overdue');
    return response.data.data || [];
  },

  // Get today's reminders
  async getTodayReminders(): Promise<ReminderResponse[]> {
    const response = await api.get<ApiResponse<ReminderResponse[]>>('/api/reminder/today');
    return response.data.data || [];
  },

  // Get active reminders
  async getActiveReminders(): Promise<ReminderResponse[]> {
    const response = await api.get<ApiResponse<ReminderResponse[]>>('/api/reminder/active');
    return response.data.data || [];
  },

  // Get completed reminders
  async getCompletedReminders(): Promise<ReminderResponse[]> {
    const response = await api.get<ApiResponse<ReminderResponse[]>>('/api/reminder/completed');
    return response.data.data || [];
  },

  // Get reminders by type
  async getRemindersByType(type: ReminderType): Promise<ReminderResponse[]> {
    const response = await api.get<ApiResponse<ReminderResponse[]>>(`/api/reminder/type/${type}`);
    return response.data.data || [];
  },

  // Search reminders
  async searchReminders(searchTerm: string): Promise<ReminderResponse[]> {
    const response = await api.get<ApiResponse<ReminderResponse[]>>(`/api/reminder/search?searchTerm=${encodeURIComponent(searchTerm)}`);
    return response.data.data || [];
  },

  // Get reminder statistics
  async getReminderStats(): Promise<ReminderStatsResponse> {
    const response = await api.get<ApiResponse<ReminderStatsResponse>>('/api/reminder/stats');
    if (!response.data.data) {
      throw new Error('Failed to get reminder stats');
    }
    return response.data.data;
  },

  // Create reminder
  async createReminder(data: CreateReminderRequest): Promise<ReminderResponse> {
    const response = await api.post<ApiResponse<ReminderResponse>>('/api/reminder', data);
    if (!response.data.data) {
      throw new Error('Failed to create reminder');
    }
    return response.data.data;
  },

  // Update reminder
  async updateReminder(id: string, data: UpdateReminderRequest): Promise<ReminderResponse> {
    const response = await api.put<ApiResponse<ReminderResponse>>(`/api/reminder/${id}`, data);
    if (!response.data.data) {
      throw new Error('Failed to update reminder');
    }
    return response.data.data;
  },

  // Delete reminder
  async deleteReminder(id: string): Promise<void> {
    await api.delete(`/api/reminder/${id}`);
  },

  // Mark reminder as completed
  async markAsCompleted(id: string): Promise<ReminderResponse> {
    const response = await api.post<ApiResponse<ReminderResponse>>(`/api/reminder/${id}/complete`);
    if (!response.data.data) {
      throw new Error('Failed to mark reminder as completed');
    }
    return response.data.data;
  },

  // Mark reminder as incomplete
  async markAsIncomplete(id: string): Promise<ReminderResponse> {
    const response = await api.post<ApiResponse<ReminderResponse>>(`/api/reminder/${id}/incomplete`);
    if (!response.data.data) {
      throw new Error('Failed to mark reminder as incomplete');
    }
    return response.data.data;
  }
};
