using CareNest.Domain.Entities;

namespace CareNest.Domain.Interfaces;

public interface IConversationRepository
{
    Task<Conversation?> GetByIdAsync(Guid id);
    Task<Conversation?> GetByIdWithMessagesAsync(Guid id, int pageSize = 50, int page = 1);
    Task<IEnumerable<Conversation>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Conversation>> GetByHealthcareProviderIdAsync(Guid providerId);
    Task<Conversation?> GetDirectConversationAsync(Guid userId1, Guid userId2);
    Task<Conversation?> GetConsultationConversationAsync(Guid patientId, Guid providerId);

    // New simplified methods
    Task<Conversation?> GetByUserAndProviderAsync(Guid userId, Guid healthcareProviderId);
    Task<List<Conversation>> GetUserConversationsAsync(Guid userId);
    
    Task<Conversation> CreateAsync(Conversation conversation);
    Task<Conversation> UpdateAsync(Conversation conversation);
    Task DeleteAsync(Guid id);
    
    Task<bool> ExistsAsync(Guid id);
    Task<bool> IsUserParticipantAsync(Guid conversationId, Guid userId);
    
    // Statistics
    Task<int> GetUnreadCountForUserAsync(Guid userId);
    Task<int> GetActiveConsultationsCountAsync(Guid providerId);
    Task<IEnumerable<Conversation>> GetRecentConversationsAsync(Guid userId, int count = 10);
}
