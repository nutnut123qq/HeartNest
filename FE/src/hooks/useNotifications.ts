import { useEffect, useCallback } from 'react';
import { useNotificationStore, type Notification } from '@/store/notificationStore';
import { notificationService } from '@/services/notificationService';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';

// SignalR connection (we'll use the existing signalR service)
import { signalRService } from '@/services/signalRService';

export const useNotifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    addNotification,
    markAsRead,
    markAllAsRead,
    setNotifications,
    setUnreadCount,
    setLoading,
    setError,
    completeReminder,
    snoozeReminder,
  } = useNotificationStore();

  const { isAuthenticated, user } = useAuthStore();

  // Load initial notifications
  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const [notificationsData, unreadCountData] = await Promise.all([
        notificationService.getNotifications(20),
        notificationService.getUnreadCount(),
      ]);

      setNotifications(notificationsData);
      setUnreadCount(unreadCountData);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, setNotifications, setUnreadCount, setLoading, setError]);

  // Mark notification as read
  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      markAsRead(notificationId);

      // Also notify SignalR
      if (signalRService.connection) {
        await signalRService.connection.invoke('MarkNotificationAsRead', notificationId);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Không thể đánh dấu đã đọc');
    }
  }, [markAsRead]);

  // Mark all notifications as read
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      markAllAsRead();

      // Also notify SignalR
      if (signalRService.connection) {
        await signalRService.connection.invoke('MarkAllNotificationsAsRead');
      }

      toast.success('Đã đánh dấu tất cả thông báo đã đọc');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Không thể đánh dấu tất cả đã đọc');
    }
  }, [markAllAsRead]);

  // Setup SignalR listeners
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('SignalR not ready:', { isAuthenticated, hasConnection: !!signalRService.connection });
      return;
    }

    console.log('Setting up notification listeners...');

    // Listen for custom SignalR notification events
    const handleSignalRNotification = (event: CustomEvent) => {
      const notification = event.detail;
      console.log('🔔 Received notification via SignalR custom event:', notification);
      addNotification(notification);

      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id,
        });
      }
    };

    // Listen for direct SignalR connection notifications (fallback)
    const handleReceiveNotification = (notification: Notification) => {
      console.log('🔔 Received notification via direct SignalR:', notification);
      addNotification(notification);

      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id,
        });
      }
    };

    // Listen for notification read confirmations
    const handleNotificationRead = (notificationId: string) => {
      markAsRead(notificationId);
    };

    // Listen for all notifications read confirmation
    const handleAllNotificationsRead = () => {
      markAllAsRead();
    };

    // Listen for unread count updates
    const handleUnreadCountUpdate = (count: number) => {
      setUnreadCount(count);
    };

    // Add custom event listener for SignalR notifications
    window.addEventListener('signalr-notification', handleSignalRNotification as EventListener);

    // Add direct SignalR event listeners if connection exists
    if (signalRService.connection) {
      signalRService.connection.on('ReceiveNotification', handleReceiveNotification);
      signalRService.connection.on('NotificationRead', handleNotificationRead);
      signalRService.connection.on('AllNotificationsRead', handleAllNotificationsRead);
      signalRService.connection.on('UnreadNotificationCount', handleUnreadCountUpdate);

      // Join notification group
      signalRService.connection.invoke('JoinNotificationGroup').catch(console.error);
    }

    // Cleanup
    return () => {
      window.removeEventListener('signalr-notification', handleSignalRNotification as EventListener);
      if (signalRService.connection) {
        signalRService.connection.off('ReceiveNotification', handleReceiveNotification);
        signalRService.connection.off('NotificationRead', handleNotificationRead);
        signalRService.connection.off('AllNotificationsRead', handleAllNotificationsRead);
        signalRService.connection.off('UnreadNotificationCount', handleUnreadCountUpdate);
      }
    };
  }, [isAuthenticated, addNotification, markAsRead, markAllAsRead, setUnreadCount]);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    loadNotifications,
    requestNotificationPermission,
    completeReminder,
    snoozeReminder,
  };
};
