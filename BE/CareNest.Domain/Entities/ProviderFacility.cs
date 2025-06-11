namespace CareNest.Domain.Entities;

/// <summary>
/// Junction table for many-to-many relationship between Providers and Facilities
/// </summary>
public class ProviderFacility
{
    public Guid ProviderId { get; set; }
    public Guid FacilityId { get; set; }
    
    // Additional properties for the relationship
    public string? RoomNumber { get; set; }
    public string? Department { get; set; }
    public bool IsPrimary { get; set; } = false;
    
    public DateTime StartDate { get; set; } = DateTime.UtcNow;
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Navigation properties
    public virtual HealthcareProvider Provider { get; set; } = null!;
    public virtual HealthcareFacility Facility { get; set; } = null!;
}
