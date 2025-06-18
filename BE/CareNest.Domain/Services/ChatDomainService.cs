using CareNest.Domain.Entities;
using CareNest.Domain.Interfaces;

namespace CareNest.Domain.Services;

public class ChatService : IChatService
{
    private readonly IConversationRepository _conversationRepository;
    private readonly IMessageRepository _messageRepository;

    public ChatService(
        IConversationRepository conversationRepository,
        IMessageRepository messageRepository)
    {
        _conversationRepository = conversationRepository;
        _messageRepository = messageRepository;
    }

    public async Task<Conversation> CreateOrGetConversationAsync(Guid userId, Guid healthcareProviderId)
    {
        // Check if conversation already exists
        var existingConversation = await _conversationRepository.GetByUserAndProviderAsync(userId, healthcareProviderId);
        if (existingConversation != null)
        {
            return existingConversation;
        }

        // Create new conversation
        var conversation = new Conversation
        {
            UserId = userId,
            HealthcareProviderId = healthcareProviderId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        return await _conversationRepository.CreateAsync(conversation);
    }

    public async Task<Conversation?> GetConversationAsync(Guid conversationId, Guid currentUserId)
    {
        var conversation = await _conversationRepository.GetByIdAsync(conversationId);

        // Check if user has access to this conversation
        if (conversation == null ||
            (conversation.UserId != currentUserId && conversation.HealthcareProviderId != currentUserId))
        {
            return null;
        }

        return conversation;
    }

    public async Task<List<Conversation>> GetUserConversationsAsync(Guid userId)
    {
        return await _conversationRepository.GetUserConversationsAsync(userId);
    }

    public async Task<Message> SendMessageAsync(Guid conversationId, Guid senderId, string content, MessageType type = MessageType.Text)
    {
        // Verify user can send message to this conversation
        var conversation = await _conversationRepository.GetByIdAsync(conversationId);
        if (conversation == null ||
            (conversation.UserId != senderId && conversation.HealthcareProviderId != senderId))
        {
            throw new UnauthorizedAccessException("User cannot send message to this conversation");
        }

        var message = new Message
        {
            ConversationId = conversationId,
            SenderId = senderId,
            Content = content,
            Type = type,
            CreatedAt = DateTime.UtcNow
        };

        var createdMessage = await _messageRepository.CreateAsync(message);

        // Update conversation last activity
        conversation.LastActivityAt = DateTime.UtcNow;
        await _conversationRepository.UpdateAsync(conversation);

        return createdMessage;
    }

    public async Task<List<Message>> GetConversationMessagesAsync(Guid conversationId, Guid currentUserId, int page = 1, int pageSize = 50)
    {
        // Verify user has access to this conversation
        var conversation = await _conversationRepository.GetByIdAsync(conversationId);

        Console.WriteLine($"GetConversationMessagesAsync Debug:");
        Console.WriteLine($"  ConversationId: {conversationId}");
        Console.WriteLine($"  CurrentUserId: {currentUserId}");
        Console.WriteLine($"  Conversation found: {conversation != null}");

        if (conversation != null)
        {
            Console.WriteLine($"  Conversation.UserId: {conversation.UserId}");
            Console.WriteLine($"  Conversation.HealthcareProviderId: {conversation.HealthcareProviderId}");
            Console.WriteLine($"  User is UserId: {conversation.UserId == currentUserId}");
            Console.WriteLine($"  User is HealthcareProviderId: {conversation.HealthcareProviderId == currentUserId}");
        }

        if (conversation == null ||
            (conversation.UserId != currentUserId && conversation.HealthcareProviderId != currentUserId))
        {
            Console.WriteLine($"  Access denied - throwing UnauthorizedAccessException");
            throw new UnauthorizedAccessException("User cannot access this conversation");
        }

        Console.WriteLine($"  Access granted - fetching messages");
        return await _messageRepository.GetConversationMessagesAsync(conversationId, page, pageSize);
    }

    public async Task<bool> MarkMessagesAsReadAsync(Guid conversationId, Guid userId)
    {
        // Verify user has access to this conversation
        var conversation = await _conversationRepository.GetByIdAsync(conversationId);
        if (conversation == null ||
            (conversation.UserId != userId && conversation.HealthcareProviderId != userId))
        {
            return false;
        }

        await _messageRepository.MarkConversationAsReadAsync(conversationId, userId);
        return true;
    }
}
