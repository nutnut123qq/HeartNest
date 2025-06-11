using CareNest.Domain.Enums;

namespace CareNest.Domain.Entities;

public class HealthcareFacility
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public HealthcareFacilityType Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Website { get; set; }
    
    // Location coordinates
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    
    // Rating and reviews
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    
    // Operating hours (JSON string)
    public string OperatingHours { get; set; } = string.Empty;
    
    // Services offered (JSON array)
    public string Services { get; set; } = string.Empty;
    
    // Images (JSON array of URLs)
    public string Images { get; set; } = string.Empty;
    
    public bool IsActive { get; set; } = true;
    public bool IsVerified { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual ICollection<HealthcareProvider> Providers { get; set; } = new List<HealthcareProvider>();
    public virtual ICollection<FacilityReview> Reviews { get; set; } = new List<FacilityReview>();
}
