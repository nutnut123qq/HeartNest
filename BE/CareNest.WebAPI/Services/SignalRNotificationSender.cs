using CareNest.Domain.Interfaces;
using CareNest.WebAPI.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace CareNest.WebAPI.Services;

public class SignalRNotificationSender : ISignalRNotificationSender
{
    private readonly IHubContext<ChatHub> _hubContext;

    public SignalRNotificationSender(IHubContext<ChatHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendNotificationAsync(string userId, object notification)
    {
        // Send to both User and Group to ensure delivery
        await _hubContext.Clients.User(userId)
            .SendAsync("ReceiveNotification", notification);

        await _hubContext.Clients.Group($"User_{userId}")
            .SendAsync("ReceiveNotification", notification);

        Console.WriteLine($"📤 Sent notification to user {userId}: {notification}");
    }

    public async Task SendNotificationReadAsync(string userId, Guid notificationId)
    {
        await _hubContext.Clients.User(userId)
            .SendAsync("NotificationRead", notificationId);
    }

    public async Task SendAllNotificationsReadAsync(string userId)
    {
        await _hubContext.Clients.User(userId)
            .SendAsync("AllNotificationsRead");
    }
}
