using CareNest.Domain.Entities;

namespace CareNest.Domain.Interfaces;

public interface IMessageRepository
{
    Task<Message?> GetByIdAsync(Guid id);
    Task<IEnumerable<Message>> GetByConversationIdAsync(Guid conversationId, int pageSize = 50, int page = 1);
    Task<IEnumerable<Message>> GetUnreadMessagesAsync(Guid conversationId, Guid userId);
    
    Task<Message> CreateAsync(Message message);
    Task<Message> UpdateAsync(Message message);
    Task DeleteAsync(Guid id);
    Task SoftDeleteAsync(Guid id);
    
    Task<bool> ExistsAsync(Guid id);
    Task<int> GetUnreadCountAsync(Guid conversationId, Guid userId);
    Task<Message?> GetLastMessageAsync(Guid conversationId);
    
    // Read status
    Task MarkConversationAsReadAsync(Guid conversationId, Guid userId);

    // New simplified method
    Task<List<Message>> GetConversationMessagesAsync(Guid conversationId, int page = 1, int pageSize = 50);
}
