using CareNest.Application.DTOs.Healthcare;

namespace CareNest.Application.DTOs.Chat;

public class ConversationDto
{
    public string Id { get; set; } = string.Empty; // Frontend expects string
    public string Type { get; set; } = "consultation"; // Add type field
    public string? Title { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public Guid HealthcareProviderId { get; set; }
    public string HealthcareProviderName { get; set; } = string.Empty;
    public string HealthcareProviderSpecialization { get; set; } = string.Empty;
    public string? HealthcareProviderImage { get; set; }
    public DateTime? LastActivityAt { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? ConsultationStatus { get; set; } = "pending";

    public List<MessageDto> Messages { get; set; } = new();
    public MessageDto? LastMessage { get; set; }
    public int UnreadCount { get; set; }
    public List<ParticipantDto> Participants { get; set; } = new();
}

public class ConversationSummaryDto
{
    public string Id { get; set; } = string.Empty; // Frontend expects string
    public string Type { get; set; } = "consultation"; // Add type field
    public string? Title { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public Guid HealthcareProviderId { get; set; }
    public string HealthcareProviderName { get; set; } = string.Empty;
    public string HealthcareProviderSpecialization { get; set; } = string.Empty;
    public string? HealthcareProviderImage { get; set; }
    public DateTime? LastActivityAt { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? ConsultationStatus { get; set; } = "pending";

    public MessageDto? LastMessage { get; set; }
    public int UnreadCount { get; set; }
    public List<ParticipantDto> Participants { get; set; } = new();
}

public class CreateConversationDto
{
    public Guid HealthcareProviderId { get; set; }
}

public class UserDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Avatar { get; set; }
}

public class ParticipantDto
{
    public Guid Id { get; set; }
    public UserDto User { get; set; } = new();
    public string Role { get; set; } = string.Empty;
    public DateTime JoinedAt { get; set; }
    public bool IsActive { get; set; }
}
