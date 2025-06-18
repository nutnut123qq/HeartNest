using CareNest.Domain.Entities;

namespace CareNest.Domain.Interfaces;

public interface IChatService
{
    // Conversation management
    Task<Conversation> CreateOrGetConversationAsync(Guid userId, Guid healthcareProviderId);
    Task<Conversation?> GetConversationAsync(Guid conversationId, Guid currentUserId);
    Task<List<Conversation>> GetUserConversationsAsync(Guid userId);

    // Message management
    Task<Message> SendMessageAsync(Guid conversationId, Guid senderId, string content, MessageType type = MessageType.Text);
    Task<List<Message>> GetConversationMessagesAsync(Guid conversationId, Guid currentUserId, int page = 1, int pageSize = 50);

    // Read status
    Task<bool> MarkMessagesAsReadAsync(Guid conversationId, Guid userId);
}
