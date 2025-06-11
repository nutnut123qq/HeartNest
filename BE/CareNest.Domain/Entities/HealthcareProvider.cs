using CareNest.Domain.Enums;

namespace CareNest.Domain.Entities;

public class HealthcareProvider
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}";
    public string Title { get; set; } = string.Empty; // Dr., Prof., etc.
    
    public ProviderSpecialization Specialization { get; set; }
    public string? SubSpecialty { get; set; }
    
    // Professional info
    public string LicenseNumber { get; set; } = string.Empty;
    public int YearsOfExperience { get; set; }
    public string Qualifications { get; set; } = string.Empty; // JSON array
    public string Biography { get; set; } = string.Empty;
    
    // Contact info
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    
    // Rating and reviews
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    
    // Consultation fees (JSON object with different types)
    public string ConsultationFees { get; set; } = string.Empty;
    
    // Availability (JSON object)
    public string Availability { get; set; } = string.Empty;
    
    // Languages spoken (JSON array)
    public string Languages { get; set; } = string.Empty;
    
    public string? ProfileImage { get; set; }
    
    public bool IsActive { get; set; } = true;
    public bool IsVerified { get; set; } = false;
    public bool AcceptsNewPatients { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    // Foreign keys
    public Guid? PrimaryFacilityId { get; set; }
    
    // Navigation properties
    public virtual HealthcareFacility? PrimaryFacility { get; set; }
    public virtual ICollection<ProviderFacility> ProviderFacilities { get; set; } = new List<ProviderFacility>();
    public virtual ICollection<ProviderReview> Reviews { get; set; } = new List<ProviderReview>();
}
