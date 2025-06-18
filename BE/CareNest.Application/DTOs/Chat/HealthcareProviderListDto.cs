using CareNest.Domain.Enums;

namespace CareNest.Application.DTOs.Chat;

public class HealthcareProviderListDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public ProviderSpecialization Specialization { get; set; }
    public string SpecializationName { get; set; } = string.Empty;
    public string? SubSpecialty { get; set; }
    public int YearsOfExperience { get; set; }
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public string? ProfileImage { get; set; }
    public bool IsActive { get; set; }
    public bool IsVerified { get; set; }
    public bool AcceptsNewPatients { get; set; }
    public string? PrimaryFacilityName { get; set; }
    
    // Indicates if user already has conversation with this provider
    public bool HasExistingConversation { get; set; }
    public Guid? ExistingConversationId { get; set; }
}
