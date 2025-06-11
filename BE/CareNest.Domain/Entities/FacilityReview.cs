namespace CareNest.Domain.Entities;

public class FacilityReview
{
    public Guid Id { get; set; }
    public Guid FacilityId { get; set; }
    public Guid UserId { get; set; }
    
    public int Rating { get; set; } // 1-5 stars
    public string Title { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    
    // Review categories
    public int? CleanlinessRating { get; set; }
    public int? StaffRating { get; set; }
    public int? WaitTimeRating { get; set; }
    public int? FacilitiesRating { get; set; }
    
    public bool IsVerified { get; set; } = false;
    public bool IsAnonymous { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual HealthcareFacility Facility { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}
