namespace CareNest.Application.DTOs.Healthcare;

public class FacilityReviewDto
{
    public Guid Id { get; set; }
    public Guid FacilityId { get; set; }
    public Guid UserId { get; set; }
    
    public int Rating { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    
    public int? CleanlinessRating { get; set; }
    public int? StaffRating { get; set; }
    public int? WaitTimeRating { get; set; }
    public int? FacilitiesRating { get; set; }
    
    public bool IsVerified { get; set; }
    public bool IsAnonymous { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // User info (if not anonymous)
    public string? UserName { get; set; }
    public string? UserAvatar { get; set; }
    
    // Facility info
    public string? FacilityName { get; set; }
}

public class ProviderReviewDto
{
    public Guid Id { get; set; }
    public Guid ProviderId { get; set; }
    public Guid UserId { get; set; }
    
    public int Rating { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    
    public int? CommunicationRating { get; set; }
    public int? ProfessionalismRating { get; set; }
    public int? TreatmentEffectivenessRating { get; set; }
    public int? WaitTimeRating { get; set; }
    
    public DateTime? VisitDate { get; set; }
    public string? TreatmentType { get; set; }
    public bool WouldRecommend { get; set; }
    
    public bool IsVerified { get; set; }
    public bool IsAnonymous { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // User info (if not anonymous)
    public string? UserName { get; set; }
    public string? UserAvatar { get; set; }
    
    // Provider info
    public string? ProviderName { get; set; }
}

public class CreateFacilityReviewDto
{
    public Guid FacilityId { get; set; }
    public int Rating { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public int? CleanlinessRating { get; set; }
    public int? StaffRating { get; set; }
    public int? WaitTimeRating { get; set; }
    public int? FacilitiesRating { get; set; }
    public bool IsAnonymous { get; set; } = false;
}

public class CreateProviderReviewDto
{
    public Guid ProviderId { get; set; }
    public int Rating { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public int? CommunicationRating { get; set; }
    public int? ProfessionalismRating { get; set; }
    public int? TreatmentEffectivenessRating { get; set; }
    public int? WaitTimeRating { get; set; }
    public DateTime? VisitDate { get; set; }
    public string? TreatmentType { get; set; }
    public bool WouldRecommend { get; set; } = true;
    public bool IsAnonymous { get; set; } = false;
}

public class UpdateFacilityReviewDto
{
    public int Rating { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public int? CleanlinessRating { get; set; }
    public int? StaffRating { get; set; }
    public int? WaitTimeRating { get; set; }
    public int? FacilitiesRating { get; set; }
}

public class UpdateProviderReviewDto
{
    public int Rating { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public int? CommunicationRating { get; set; }
    public int? ProfessionalismRating { get; set; }
    public int? TreatmentEffectivenessRating { get; set; }
    public int? WaitTimeRating { get; set; }
    public DateTime? VisitDate { get; set; }
    public string? TreatmentType { get; set; }
    public bool WouldRecommend { get; set; }
}

public class ReviewStatsDto
{
    public decimal AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public Dictionary<int, int> RatingDistribution { get; set; } = new();
    public Dictionary<string, decimal> CategoryAverages { get; set; } = new();
}
