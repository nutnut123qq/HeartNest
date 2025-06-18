using CareNest.Application.DTOs.Chat;
using CareNest.Application.Interfaces;
using CareNest.WebAPI.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace CareNest.WebAPI.Hubs;

// [Authorize] // Temporarily disabled for testing
public class ChatHub : Hub
{
    private readonly IChatApplicationService _chatApplicationService;

    public ChatHub(IChatApplicationService chatApplicationService)
    {
        _chatApplicationService = chatApplicationService;
    }

    public override async Task OnConnectedAsync()
    {
        // For now, just log connection without user identification
        Console.WriteLine($"SignalR client connected: {Context.ConnectionId}");
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
}
