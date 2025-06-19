import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  createdAt: string;
  isRead: boolean;
  timeAgo: string;
}

interface NotificationState {
  // Data
  notifications: Notification[];
  unreadCount: number;
  
  // UI State
  loading: boolean;
  error: string | null;
  
  // Actions
  addNotification: (notification: Notification) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  setNotifications: (notifications: Notification[]) => void;
  setUnreadCount: (count: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Quick actions for reminder notifications
  completeReminder: (reminderId: string) => void;
  snoozeReminder: (reminderId: string, minutes: number) => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,
      loading: false,
      error: null,

      // Add new notification
      addNotification: (notification: Notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }));
      },

      // Mark notification as read
      markAsRead: (notificationId: string) => {
        set((state) => {
          const notifications = state.notifications.map(n => 
            n.id === notificationId ? { ...n, isRead: true } : n
          );
          const wasUnread = state.notifications.find(n => n.id === notificationId && !n.isRead);
          return {
            notifications,
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
          };
        });
      },

      // Mark all notifications as read
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true })),
          unreadCount: 0
        }));
      },

      // Set notifications list
      setNotifications: (notifications: Notification[]) => {
        set({ notifications });
      },

      // Set unread count
      setUnreadCount: (count: number) => {
        set({ unreadCount: count });
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ loading });
      },

      // Set error state
      setError: (error: string | null) => {
        set({ error });
      },

      // Complete reminder (quick action)
      completeReminder: (reminderId: string) => {
        // This will be implemented to call reminder API
        console.log('Complete reminder:', reminderId);
      },

      // Snooze reminder (quick action)
      snoozeReminder: (reminderId: string, minutes: number) => {
        // This will be implemented to call reminder API
        console.log('Snooze reminder:', reminderId, 'for', minutes, 'minutes');
      },
    }),
    {
      name: 'notification-store',
    }
  )
);
