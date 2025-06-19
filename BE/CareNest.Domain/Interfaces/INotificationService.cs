using CareNest.Domain.Entities;

namespace CareNest.Domain.Interfaces;

public interface INotificationService
{
    /// <summary>
    /// Gửi thông báo nhắc nhở qua web
    /// </summary>
    Task SendReminderNotificationAsync(Guid userId, Reminder reminder);

    /// <summary>
    /// Gửi thông báo tùy chỉnh
    /// </summary>
    Task SendCustomNotificationAsync(Guid userId, string title, string message, object? data = null);

    /// <summary>
    /// Đánh dấu thông báo đã đọc
    /// </summary>
    Task MarkNotificationAsReadAsync(Guid userId, Guid notificationId);

    /// <summary>
    /// Đánh dấu tất cả thông báo đã đọc
    /// </summary>
    Task MarkAllNotificationsAsReadAsync(Guid userId);

    /// <summary>
    /// Lấy số lượng thông báo chưa đọc
    /// </summary>
    Task<int> GetUnreadCountAsync(Guid userId);
}
