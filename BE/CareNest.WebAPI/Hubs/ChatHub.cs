using CareNest.Application.DTOs.Chat;
using CareNest.Application.Interfaces;
using CareNest.Domain.Interfaces;
using CareNest.WebAPI.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace CareNest.WebAPI.Hubs;

// [Authorize] // Temporarily disabled for testing
public class ChatHub : Hub
{
    private readonly IChatApplicationService _chatApplicationService;
    private readonly INotificationService _notificationService;

    public ChatHub(
        IChatApplicationService chatApplicationService,
        INotificationService notificationService)
    {
        _chatApplicationService = chatApplicationService;
        _notificationService = notificationService;
    }

    public override async Task OnConnectedAsync()
    {
        // For now, just log connection without user identification
        Console.WriteLine($"SignalR client connected: {Context.ConnectionId}");

        // Auto-join user to their personal notification group if authenticated
        var userId = Context.User?.GetUserId();
        if (userId.HasValue)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId.Value}");
            Console.WriteLine($"User {userId.Value} auto-joined notification group");
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // For now, just log disconnection
        Console.WriteLine($"SignalR client disconnected: {Context.ConnectionId}");
        if (exception != null)
        {
            Console.WriteLine($"Disconnect reason: {exception.Message}");
        }
        await base.OnDisconnectedAsync(exception);
    }

    // Add method to join user group manually
    public async Task JoinUserGroup(string userId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
        Console.WriteLine($"User {userId} joined group");
    }

    public async Task JoinConversation(string conversationId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"Conversation_{conversationId}");
    }

    public async Task LeaveConversation(string conversationId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Conversation_{conversationId}");
    }

    public async Task SendMessage(CreateMessageDto messageDto)
    {
        try
        {
            // For now, disable user authentication and use test user
            await Clients.Caller.SendAsync("Error", "SendMessage temporarily disabled - use REST API instead");
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", $"Failed to send message: {ex.Message}");
        }
    }

    public async Task MarkAsRead(string conversationId)
    {
        try
        {
            var userId = Context.User?.GetUserId();
            if (!userId.HasValue)
            {
                await Clients.Caller.SendAsync("Error", "User not authenticated");
                return;
            }

            var result = await _chatApplicationService.MarkMessagesAsReadAsync(Guid.Parse(conversationId), userId.Value);

            if (result.IsSuccess)
            {
                // Notify conversation participants that messages were read
                await Clients.Group($"Conversation_{conversationId}")
                    .SendAsync("MessagesMarkedAsRead", new { ConversationId = conversationId, UserId = userId.Value });
            }
            else
            {
                await Clients.Caller.SendAsync("Error", result.Message);
            }
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", $"Failed to mark as read: {ex.Message}");
        }
    }

    public async Task StartTyping(string conversationId)
    {
        var userId = Context.User?.GetUserId();
        if (userId.HasValue)
        {
            await Clients.OthersInGroup($"Conversation_{conversationId}")
                .SendAsync("UserTyping", new { ConversationId = conversationId, UserId = userId.Value });
        }
    }

    public async Task StopTyping(string conversationId)
    {
        var userId = Context.User?.GetUserId();
        if (userId.HasValue)
        {
            await Clients.OthersInGroup($"Conversation_{conversationId}")
                .SendAsync("UserStoppedTyping", new { ConversationId = conversationId, UserId = userId.Value });
        }
    }

    // ===== NOTIFICATION METHODS =====

    /// <summary>
    /// Join user notification group
    /// </summary>
    public async Task JoinNotificationGroup()
    {
        var userId = Context.User?.GetUserId();
        if (userId.HasValue)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId.Value}");
            Console.WriteLine($"User {userId.Value} joined notification group");
        }
    }

    /// <summary>
    /// Mark notification as read
    /// </summary>
    public async Task MarkNotificationAsRead(string notificationId)
    {
        try
        {
            var userId = Context.User?.GetUserId();
            if (!userId.HasValue)
            {
                await Clients.Caller.SendAsync("Error", "User not authenticated");
                return;
            }

            await _notificationService.MarkNotificationAsReadAsync(userId.Value, Guid.Parse(notificationId));

            // Confirm to caller
            await Clients.Caller.SendAsync("NotificationMarkedAsRead", notificationId);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", $"Failed to mark notification as read: {ex.Message}");
        }
    }

    /// <summary>
    /// Mark all notifications as read
    /// </summary>
    public async Task MarkAllNotificationsAsRead()
    {
        try
        {
            var userId = Context.User?.GetUserId();
            if (!userId.HasValue)
            {
                await Clients.Caller.SendAsync("Error", "User not authenticated");
                return;
            }

            await _notificationService.MarkAllNotificationsAsReadAsync(userId.Value);

            // Confirm to caller
            await Clients.Caller.SendAsync("AllNotificationsMarkedAsRead");
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", $"Failed to mark all notifications as read: {ex.Message}");
        }
    }

    /// <summary>
    /// Get unread notification count
    /// </summary>
    public async Task GetUnreadNotificationCount()
    {
        try
        {
            var userId = Context.User?.GetUserId();
            if (!userId.HasValue)
            {
                await Clients.Caller.SendAsync("Error", "User not authenticated");
                return;
            }

            var count = await _notificationService.GetUnreadCountAsync(userId.Value);
            await Clients.Caller.SendAsync("UnreadNotificationCount", count);
        }
        catch (Exception ex)
        {
            await Clients.Caller.SendAsync("Error", $"Failed to get unread count: {ex.Message}");
        }
    }
}
