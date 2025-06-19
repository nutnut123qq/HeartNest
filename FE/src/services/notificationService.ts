import { api } from '@/lib/api';
import type { Notification } from '@/store/notificationStore';

export interface NotificationResponse {
  success: boolean;
  data: any;
  message: string;
}

export interface CreateNotificationRequest {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
}

class NotificationService {
  private baseUrl = '/api/notification';

  /**
   * Lấy danh sách notifications
   */
  async getNotifications(limit: number = 20): Promise<Notification[]> {
    try {
      const response = await api.get(`${this.baseUrl}?limit=${limit}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Lấy số lượng notifications chưa đọc
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get(`${this.baseUrl}/unread-count`);
      return response.data.data || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  /**
   * Đánh dấu notification đã đọc
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const response = await api.post(`${this.baseUrl}/${notificationId}/mark-read`);
      return response.data.success;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  /**
   * Đánh dấu tất cả notifications đã đọc
   */
  async markAllAsRead(): Promise<boolean> {
    try {
      const response = await api.post(`${this.baseUrl}/mark-all-read`);
      return response.data.success;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  /**
   * Gửi test notification (for development)
   */
  async sendTestNotification(request: CreateNotificationRequest): Promise<boolean> {
    try {
      const response = await api.post(`${this.baseUrl}/test`, request);
      return response.data.success;
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();
