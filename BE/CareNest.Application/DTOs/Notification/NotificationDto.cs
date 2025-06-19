namespace CareNest.Application.DTOs.Notification;

public class NotificationDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
    public string TimeAgo { get; set; } = string.Empty;
}

public class CreateNotificationRequest
{
    public Guid UserId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; }
}

public class NotificationStatsDto
{
    public int UnreadCount { get; set; }
    public int TotalCount { get; set; }
}
