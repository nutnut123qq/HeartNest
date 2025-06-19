using CareNest.Application.DTOs.Notification;
using CareNest.Application.DTOs.Reminder;
using CareNest.Domain.Entities;
using CareNest.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

namespace CareNest.Application.Services;

public class NotificationService : INotificationService
{
    private readonly ISignalRNotificationSender _signalRSender;
    private readonly ILogger<NotificationService> _logger;

    // In-memory storage cho demo - trong production nên dùng database
    private static readonly ConcurrentDictionary<Guid, List<NotificationDto>> _userNotifications = new();
    private static readonly ConcurrentDictionary<Guid, int> _unreadCounts = new();

    public NotificationService(
        ISignalRNotificationSender signalRSender,
        ILogger<NotificationService> logger)
    {
        _signalRSender = signalRSender;
        _logger = logger;
    }

    public async Task SendReminderNotificationAsync(Guid userId, Reminder reminder)
    {
        try
        {
            var notification = new NotificationDto
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Type = "reminder",
                Title = GetReminderTitle(reminder),
                Message = GetReminderMessage(reminder),
                Data = reminder,
                CreatedAt = DateTime.UtcNow,
                IsRead = false,
                TimeAgo = GetTimeUntilReminder(reminder)
            };

            // Lưu notification vào memory
            AddNotificationToUser(userId, notification);

            // Gửi qua SignalR
            await _signalRSender.SendNotificationAsync(userId.ToString(), notification);

            _logger.LogInformation($"Sent reminder notification to user {userId}: {notification.Title}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending reminder notification to user {userId}");
        }
    }

    public async Task SendCustomNotificationAsync(Guid userId, string title, string message, object? data = null)
    {
        try
        {
            var notification = new NotificationDto
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Type = "custom",
                Title = title,
                Message = message,
                Data = data,
                CreatedAt = DateTime.UtcNow,
                IsRead = false,
                TimeAgo = "Bây giờ"
            };

            // Lưu notification vào memory
            AddNotificationToUser(userId, notification);

            // Gửi qua SignalR
            await _signalRSender.SendNotificationAsync(userId.ToString(), notification);

            _logger.LogInformation($"Sent custom notification to user {userId}: {title}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error sending custom notification to user {userId}");
        }
    }

    public async Task MarkNotificationAsReadAsync(Guid userId, Guid notificationId)
    {
        try
        {
            if (_userNotifications.TryGetValue(userId, out var notifications))
            {
                var notification = notifications.FirstOrDefault(n => n.Id == notificationId);
                if (notification != null && !notification.IsRead)
                {
                    notification.IsRead = true;

                    // Update unread count
                    _unreadCounts.AddOrUpdate(userId, 0, (key, count) => Math.Max(0, count - 1));

                    // Notify client về update
                    await _signalRSender.SendNotificationReadAsync(userId.ToString(), notificationId);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error marking notification as read for user {userId}");
        }
    }

    public async Task MarkAllNotificationsAsReadAsync(Guid userId)
    {
        try
        {
            if (_userNotifications.TryGetValue(userId, out var notifications))
            {
                foreach (var notification in notifications.Where(n => !n.IsRead))
                {
                    notification.IsRead = true;
                }

                // Reset unread count
                _unreadCounts.AddOrUpdate(userId, 0, (key, count) => 0);

                // Notify client về update
                await _signalRSender.SendAllNotificationsReadAsync(userId.ToString());
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error marking all notifications as read for user {userId}");
        }
    }

    public async Task<int> GetUnreadCountAsync(Guid userId)
    {
        return _unreadCounts.GetValueOrDefault(userId, 0);
    }

    private void AddNotificationToUser(Guid userId, NotificationDto notification)
    {
        _userNotifications.AddOrUpdate(userId,
            new List<NotificationDto> { notification },
            (key, existing) =>
            {
                existing.Insert(0, notification); // Add to beginning
                // Keep only last 50 notifications
                if (existing.Count > 50)
                {
                    existing.RemoveRange(50, existing.Count - 50);
                }
                return existing;
            });

        // Update unread count
        _unreadCounts.AddOrUpdate(userId, 1, (key, count) => count + 1);
    }

    private string GetReminderTitle(Reminder reminder)
    {
        return reminder.Type switch
        {
            ReminderType.Medication => $"💊 {reminder.Title}",
            ReminderType.Appointment => $"🏥 {reminder.Title}",
            ReminderType.Exercise => $"🏃 {reminder.Title}",
            ReminderType.Checkup => $"🩺 {reminder.Title}",
            _ => $"🔔 {reminder.Title}"
        };
    }

    private string GetReminderMessage(Reminder reminder)
    {
        if (reminder.Type == ReminderType.Medication && !string.IsNullOrEmpty(reminder.MedicationName))
        {
            var message = $"Đã đến giờ uống {reminder.MedicationName}";
            if (!string.IsNullOrEmpty(reminder.Dosage))
            {
                message += $" - {reminder.Dosage}";
            }
            return message;
        }

        return reminder.Description ?? "Đã đến thời gian thực hiện";
    }

    private string GetTimeUntilReminder(Reminder reminder)
    {
        var now = DateTime.UtcNow;
        var scheduledTime = reminder.ScheduledAt;
        var timeUntil = scheduledTime - now;

        // Nếu đã quá giờ
        if (timeUntil.TotalMinutes <= 0)
        {
            var overdue = now - scheduledTime;
            if (overdue.TotalMinutes < 60)
                return $"Quá {(int)overdue.TotalMinutes} phút";
            if (overdue.TotalHours < 24)
                return $"Quá {(int)overdue.TotalHours} giờ";
            return $"Quá {(int)overdue.TotalDays} ngày";
        }

        // Nếu chưa đến giờ
        if (timeUntil.TotalDays >= 1)
            return $"Còn {(int)timeUntil.TotalDays} ngày";
        if (timeUntil.TotalHours >= 1)
            return $"Còn {(int)timeUntil.TotalHours} giờ";
        if (timeUntil.TotalMinutes >= 1)
            return $"Còn {(int)timeUntil.TotalMinutes} phút";

        return "Bây giờ";
    }

    // Method để lấy notifications cho user (sẽ dùng trong API)
    public List<NotificationDto> GetUserNotifications(Guid userId, int limit = 20)
    {
        if (_userNotifications.TryGetValue(userId, out var notifications))
        {
            return notifications.Take(limit).ToList();
        }
        return new List<NotificationDto>();
    }
}
