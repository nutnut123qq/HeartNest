using CareNest.Application.Common;
using CareNest.Application.DTOs.Chat;
using CareNest.Application.Interfaces;
using CareNest.Domain.Entities;
using CareNest.Domain.Enums;
using CareNest.Domain.Interfaces;

namespace CareNest.Application.Services;

public class ChatApplicationService : IChatApplicationService
{
    private readonly IChatService _chatService;
    private readonly IHealthcareProviderRepository _healthcareProviderRepository;
    private readonly IUserRepository _userRepository;

    public ChatApplicationService(
        IChatService chatService,
        IHealthcareProviderRepository healthcareProviderRepository,
        IUserRepository userRepository)
    {
        _chatService = chatService;
        _healthcareProviderRepository = healthcareProviderRepository;
        _userRepository = userRepository;
    }

    public async Task<ApiResponse<List<HealthcareProviderListDto>>> GetAvailableHealthcareProvidersAsync(Guid userId)
    {
        try
        {
            // Lấy cả HealthcareProviders và Users có role Nurse
            var providers = await _healthcareProviderRepository.GetAllAsync();
            var nurseUsers = await _userRepository.GetUsersByRoleAsync(Domain.Enums.UserRole.Nurse);

            // Cho phép test mà không cần user
            var userConversations = userId != Guid.Empty ? await _chatService.GetUserConversationsAsync(userId) : new List<Conversation>();
            var existingProviderIds = userConversations.Select(c => c.HealthcareProviderId).ToHashSet();

            var providerDtos = new List<HealthcareProviderListDto>();

            // Thêm HealthcareProviders thực sự
            providerDtos.AddRange(providers.Select(p => new HealthcareProviderListDto
            {
                Id = p.Id,
                FirstName = p.FirstName,
                LastName = p.LastName,
                FullName = $"{p.FirstName} {p.LastName}",
                Title = p.Title ?? "",
                Specialization = p.Specialization,
                SpecializationName = p.Specialization.ToString(),
                SubSpecialty = p.SubSpecialty,
                YearsOfExperience = p.YearsOfExperience,
                AverageRating = p.AverageRating,
                ReviewCount = p.ReviewCount,
                ProfileImage = p.ProfileImage,
                IsActive = p.IsActive,
                IsVerified = p.IsVerified,
                AcceptsNewPatients = p.AcceptsNewPatients,
                PrimaryFacilityName = "", // Simplified - no facility name in current model
                HasExistingConversation = existingProviderIds.Contains(p.Id),
                ExistingConversationId = userConversations.FirstOrDefault(c => c.HealthcareProviderId == p.Id)?.Id
            }));

            // Thêm Users có role Nurse (tạm thời để test)
            providerDtos.AddRange(nurseUsers.Select(n => new HealthcareProviderListDto
            {
                Id = n.Id,
                FirstName = n.FirstName,
                LastName = n.LastName,
                FullName = $"{n.FirstName} {n.LastName}",
                Title = "Y tá",
                Specialization = Domain.Enums.ProviderSpecialization.GeneralPractice,
                SpecializationName = "Chăm sóc tổng quát",
                SubSpecialty = "Y tá",
                YearsOfExperience = 5, // Giá trị mặc định
                AverageRating = 4.5m,
                ReviewCount = 10,
                ProfileImage = null,
                IsActive = n.IsActive,
                IsVerified = true,
                AcceptsNewPatients = true,
                PrimaryFacilityName = "",
                HasExistingConversation = existingProviderIds.Contains(n.Id),
                ExistingConversationId = userConversations.FirstOrDefault(c => c.HealthcareProviderId == n.Id)?.Id
            }));

            return ApiResponse<List<HealthcareProviderListDto>>.SuccessResult(providerDtos);
        }
        catch (Exception ex)
        {
            return ApiResponse<List<HealthcareProviderListDto>>.ErrorResult($"Error getting healthcare providers: {ex.Message}");
        }
    }

    public async Task<ApiResponse<ConversationDto>> CreateOrGetConversationAsync(Guid userId, Guid healthcareProviderId)
    {
        try
        {
            var conversation = await _chatService.CreateOrGetConversationAsync(userId, healthcareProviderId);
            var conversationDto = await MapToConversationDto(conversation);

            return ApiResponse<ConversationDto>.SuccessResult(conversationDto);
        }
        catch (Exception ex)
        {
            return ApiResponse<ConversationDto>.ErrorResult($"Error creating conversation: {ex.Message}");
        }
    }

    public async Task<ApiResponse<ConversationDto>> GetConversationAsync(Guid conversationId, Guid currentUserId)
    {
        try
        {
            Console.WriteLine($"GetConversationAsync called with conversationId: {conversationId}, currentUserId: {currentUserId}");

            var conversation = await _chatService.GetConversationAsync(conversationId, currentUserId);
            Console.WriteLine($"Conversation found: {conversation != null}");

            if (conversation == null)
            {
                Console.WriteLine("Conversation not found or access denied");
                return ApiResponse<ConversationDto>.ErrorResult("Conversation not found or access denied");
            }

            Console.WriteLine($"Mapping conversation to DTO...");
            var conversationDto = await MapToConversationDto(conversation);
            Console.WriteLine($"Conversation DTO created successfully");

            return ApiResponse<ConversationDto>.SuccessResult(conversationDto);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetConversationAsync: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return ApiResponse<ConversationDto>.ErrorResult($"Error getting conversation: {ex.Message}");
        }
    }

    public async Task<ApiResponse<List<ConversationSummaryDto>>> GetUserConversationsAsync(Guid userId)
    {
        try
        {
            Console.WriteLine($"GetUserConversationsAsync called for userId: {userId}");
            var conversations = await _chatService.GetUserConversationsAsync(userId);
            Console.WriteLine($"Found {conversations.Count} conversations for user {userId}");

            foreach (var conv in conversations)
            {
                Console.WriteLine($"  Conversation {conv.Id}: UserId={conv.UserId}, HealthcareProviderId={conv.HealthcareProviderId}");
            }

            var conversationDtos = new List<ConversationSummaryDto>();

            foreach (var conversation in conversations)
            {
                var dto = await MapToConversationSummaryDto(conversation, userId);
                conversationDtos.Add(dto);
            }

            return ApiResponse<List<ConversationSummaryDto>>.SuccessResult(conversationDtos);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting user conversations: {ex.Message}");
            return ApiResponse<List<ConversationSummaryDto>>.ErrorResult($"Error getting user conversations: {ex.Message}");
        }
    }

    public async Task<ApiResponse<MessageDto>> SendMessageAsync(CreateMessageDto dto, Guid senderId)
    {
        try
        {
            var message = await _chatService.SendMessageAsync(dto.ConversationId, senderId, dto.Content, dto.Type);
            var messageDto = await MapToMessageDto(message);

            return ApiResponse<MessageDto>.SuccessResult(messageDto);
        }
        catch (Exception ex)
        {
            return ApiResponse<MessageDto>.ErrorResult($"Error sending message: {ex.Message}");
        }
    }

    public async Task<ApiResponse<List<MessageDto>>> GetConversationMessagesAsync(Guid conversationId, Guid currentUserId, int page = 1, int pageSize = 50)
    {
        try
        {
            Console.WriteLine($"GetConversationMessagesAsync called:");
            Console.WriteLine($"  ConversationId: {conversationId}");
            Console.WriteLine($"  CurrentUserId: {currentUserId}");
            Console.WriteLine($"  Page: {page}, PageSize: {pageSize}");

            var messages = await _chatService.GetConversationMessagesAsync(conversationId, currentUserId, page, pageSize);
            Console.WriteLine($"  Messages retrieved: {messages.Count}");

            var messageDtos = new List<MessageDto>();

            foreach (var message in messages)
            {
                var dto = await MapToMessageDto(message);
                messageDtos.Add(dto);
            }

            Console.WriteLine($"  MessageDtos created: {messageDtos.Count}");
            return ApiResponse<List<MessageDto>>.SuccessResult(messageDtos);
        }
        catch (UnauthorizedAccessException ex)
        {
            Console.WriteLine($"  Unauthorized access: {ex.Message}");
            return ApiResponse<List<MessageDto>>.ErrorResult($"Access denied: {ex.Message}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"  Error getting messages: {ex.Message}");
            Console.WriteLine($"  Stack trace: {ex.StackTrace}");
            return ApiResponse<List<MessageDto>>.ErrorResult($"Error getting messages: {ex.Message}");
        }
    }

    public async Task<ApiResponse<bool>> MarkMessagesAsReadAsync(Guid conversationId, Guid userId)
    {
        try
        {
            var result = await _chatService.MarkMessagesAsReadAsync(conversationId, userId);
            return ApiResponse<bool>.SuccessResult(result);
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.ErrorResult($"Error marking messages as read: {ex.Message}");
        }
    }

    private async Task<ConversationDto> MapToConversationDto(Conversation conversation)
    {
        var user = await _userRepository.GetByIdAsync(conversation.UserId);
        var provider = await _healthcareProviderRepository.GetByIdAsync(conversation.HealthcareProviderId);

        return new ConversationDto
        {
            Id = conversation.Id.ToString(),
            Type = "consultation",
            Title = provider != null ? $"Tư vấn với {provider.FirstName} {provider.LastName}" : "Tư vấn y tế",
            UserId = conversation.UserId,
            UserName = user != null ? $"{user.FirstName} {user.LastName}" : "Unknown User",
            HealthcareProviderId = conversation.HealthcareProviderId,
            HealthcareProviderName = provider != null ? $"{provider.FirstName} {provider.LastName}" : "Unknown Provider",
            HealthcareProviderSpecialization = provider?.Specialization.ToString() ?? "",
            HealthcareProviderImage = provider?.ProfileImage,
            LastActivityAt = conversation.LastActivityAt,
            IsActive = conversation.IsActive,
            CreatedAt = conversation.CreatedAt,
            UpdatedAt = conversation.UpdatedAt ?? conversation.CreatedAt,
            ConsultationStatus = "pending",
            Messages = new List<MessageDto>(),
            UnreadCount = 0, // Will be calculated separately if needed
            Participants = new List<ParticipantDto>
            {
                new ParticipantDto
                {
                    Id = Guid.NewGuid(),
                    User = new UserDto
                    {
                        Id = conversation.UserId,
                        FirstName = user?.FirstName ?? "",
                        LastName = user?.LastName ?? "",
                        FullName = user != null ? $"{user.FirstName} {user.LastName}" : "Unknown User",
                        Email = user?.Email?.Value ?? "",
                        Avatar = null
                    },
                    Role = "patient",
                    JoinedAt = conversation.CreatedAt,
                    IsActive = true
                },
                new ParticipantDto
                {
                    Id = Guid.NewGuid(),
                    User = new UserDto
                    {
                        Id = conversation.HealthcareProviderId,
                        FirstName = provider?.FirstName ?? "",
                        LastName = provider?.LastName ?? "",
                        FullName = provider != null ? $"{provider.FirstName} {provider.LastName}" : "Unknown Provider",
                        Email = provider?.Email ?? "",
                        Avatar = provider?.ProfileImage
                    },
                    Role = "healthcare_provider",
                    JoinedAt = conversation.CreatedAt,
                    IsActive = true
                }
            }
        };
    }

    private async Task<ConversationSummaryDto> MapToConversationSummaryDto(Conversation conversation, Guid currentUserId)
    {
        var user = await _userRepository.GetByIdAsync(conversation.UserId);
        var provider = await _healthcareProviderRepository.GetByIdAsync(conversation.HealthcareProviderId);

        // Get last message if any
        MessageDto? lastMessageDto = null;
        Console.WriteLine($"Conversation {conversation.Id} has {conversation.Messages?.Count ?? 0} messages");

        if (conversation.Messages != null && conversation.Messages.Any())
        {
            var lastMessage = conversation.Messages.OrderByDescending(m => m.CreatedAt).FirstOrDefault();
            Console.WriteLine($"Last message: {lastMessage?.Content} at {lastMessage?.CreatedAt}");
            if (lastMessage != null)
            {
                lastMessageDto = await MapToMessageDto(lastMessage);
            }
        }
        else
        {
            Console.WriteLine($"No messages found for conversation {conversation.Id}");
        }

        return new ConversationSummaryDto
        {
            Id = conversation.Id.ToString(),
            Type = "consultation",
            Title = provider != null ? $"Tư vấn với {provider.FirstName} {provider.LastName}" : "Tư vấn y tế",
            UserId = conversation.UserId,
            UserName = user != null ? $"{user.FirstName} {user.LastName}" : "Unknown User",
            HealthcareProviderId = conversation.HealthcareProviderId,
            HealthcareProviderName = provider != null ? $"{provider.FirstName} {provider.LastName}" : "Unknown Provider",
            HealthcareProviderSpecialization = provider?.Specialization.ToString() ?? "",
            HealthcareProviderImage = provider?.ProfileImage,
            LastActivityAt = conversation.LastActivityAt,
            IsActive = conversation.IsActive,
            CreatedAt = conversation.CreatedAt,
            UpdatedAt = conversation.UpdatedAt ?? conversation.CreatedAt,
            ConsultationStatus = "pending",
            LastMessage = lastMessageDto,
            UnreadCount = 0, // Will be calculated separately if needed
            Participants = new List<ParticipantDto>
            {
                new ParticipantDto
                {
                    Id = Guid.NewGuid(),
                    User = new UserDto
                    {
                        Id = conversation.UserId,
                        FirstName = user?.FirstName ?? "",
                        LastName = user?.LastName ?? "",
                        FullName = user != null ? $"{user.FirstName} {user.LastName}" : "Unknown User",
                        Email = user?.Email?.Value ?? "",
                        Avatar = null
                    },
                    Role = "patient",
                    JoinedAt = conversation.CreatedAt,
                    IsActive = true
                },
                new ParticipantDto
                {
                    Id = Guid.NewGuid(),
                    User = new UserDto
                    {
                        Id = conversation.HealthcareProviderId,
                        FirstName = provider?.FirstName ?? "",
                        LastName = provider?.LastName ?? "",
                        FullName = provider != null ? $"{provider.FirstName} {provider.LastName}" : "Unknown Provider",
                        Email = provider?.Email ?? "",
                        Avatar = provider?.ProfileImage
                    },
                    Role = "healthcare_provider",
                    JoinedAt = conversation.CreatedAt,
                    IsActive = true
                }
            }
        };
    }

    private async Task<MessageDto> MapToMessageDto(Message message)
    {
        var sender = await _userRepository.GetByIdAsync(message.SenderId);

        // Map MessageType enum to string
        var typeString = message.Type switch
        {
            Domain.Entities.MessageType.Text => "text",
            Domain.Entities.MessageType.Image => "image",
            Domain.Entities.MessageType.File => "file",
            Domain.Entities.MessageType.Voice => "voice",
            Domain.Entities.MessageType.System => "system",
            Domain.Entities.MessageType.Prescription => "prescription",
            Domain.Entities.MessageType.Appointment => "appointment",
            _ => "text"
        };

        return new MessageDto
        {
            Id = message.Id.ToString(),
            ConversationId = message.ConversationId.ToString(),
            SenderId = message.SenderId,
            SenderName = sender != null ? $"{sender.FirstName} {sender.LastName}" : "Unknown Sender",
            SenderAvatar = null, // Simplified - no avatar in current User model
            Content = message.Content,
            Type = typeString,
            CreatedAt = message.CreatedAt,
            FileName = message.FileName,
            FileUrl = message.FileUrl,
            FileType = message.FileType,
            FileSize = message.FileSize,
            DurationSeconds = message.DurationSeconds,
            IsRead = message.IsRead,
            ReadAt = message.ReadAt
        };
    }
}
