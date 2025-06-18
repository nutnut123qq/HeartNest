using CareNest.Application.Common;
using CareNest.Application.DTOs.Chat;

namespace CareNest.Application.Interfaces;

public interface IChatApplicationService
{
    // Healthcare provider list
    Task<ApiResponse<List<HealthcareProviderListDto>>> GetAvailableHealthcareProvidersAsync(Guid userId);

    // Conversation management
    Task<ApiResponse<ConversationDto>> CreateOrGetConversationAsync(Guid userId, Guid healthcareProviderId);
    Task<ApiResponse<ConversationDto>> GetConversationAsync(Guid conversationId, Guid currentUserId);
    Task<ApiResponse<List<ConversationSummaryDto>>> GetUserConversationsAsync(Guid userId);

    // Message management
    Task<ApiResponse<MessageDto>> SendMessageAsync(CreateMessageDto dto, Guid senderId);
    Task<ApiResponse<List<MessageDto>>> GetConversationMessagesAsync(Guid conversationId, Guid currentUserId, int page = 1, int pageSize = 50);

    // Read status
    Task<ApiResponse<bool>> MarkMessagesAsReadAsync(Guid conversationId, Guid userId);
}
