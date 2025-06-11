namespace CareNest.Domain.Entities;

public class ProviderReview
{
    public Guid Id { get; set; }
    public Guid ProviderId { get; set; }
    public Guid UserId { get; set; }
    
    public int Rating { get; set; } // 1-5 stars
    public string Title { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    
    // Review categories
    public int? CommunicationRating { get; set; }
    public int? ProfessionalismRating { get; set; }
    public int? TreatmentEffectivenessRating { get; set; }
    public int? WaitTimeRating { get; set; }
    
    // Visit details
    public DateTime? VisitDate { get; set; }
    public string? TreatmentType { get; set; }
    public bool WouldRecommend { get; set; } = true;
    
    public bool IsVerified { get; set; } = false;
    public bool IsAnonymous { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual HealthcareProvider Provider { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}
