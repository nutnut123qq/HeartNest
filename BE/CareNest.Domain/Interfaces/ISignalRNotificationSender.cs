namespace CareNest.Domain.Interfaces;

public interface ISignalRNotificationSender
{
    /// <summary>
    /// Gửi notification qua SignalR
    /// </summary>
    Task SendNotificationAsync(string userId, object notification);
    
    /// <summary>
    /// Gửi notification read confirmation
    /// </summary>
    Task SendNotificationReadAsync(string userId, Guid notificationId);
    
    /// <summary>
    /// Gửi all notifications read confirmation
    /// </summary>
    Task SendAllNotificationsReadAsync(string userId);
}
