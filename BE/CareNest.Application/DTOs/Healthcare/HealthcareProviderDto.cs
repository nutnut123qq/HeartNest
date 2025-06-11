using CareNest.Domain.Enums;

namespace CareNest.Application.DTOs.Healthcare;

public class HealthcareProviderDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    
    public ProviderSpecialization Specialization { get; set; }
    public string SpecializationDisplay { get; set; } = string.Empty;
    public string? SubSpecialty { get; set; }
    
    public string LicenseNumber { get; set; } = string.Empty;
    public int YearsOfExperience { get; set; }
    public List<string> Qualifications { get; set; } = new();
    public string Biography { get; set; } = string.Empty;
    
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    
    public Dictionary<string, decimal> ConsultationFees { get; set; } = new();
    public Dictionary<string, List<string>> Availability { get; set; } = new();
    public List<string> Languages { get; set; } = new();
    
    public string? ProfileImage { get; set; }
    
    public bool IsActive { get; set; }
    public bool IsVerified { get; set; }
    public bool AcceptsNewPatients { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation properties
    public HealthcareFacilitySummaryDto? PrimaryFacility { get; set; }
    public List<HealthcareFacilitySummaryDto> Facilities { get; set; } = new();
    public List<ProviderReviewDto> RecentReviews { get; set; } = new();
}

public class HealthcareProviderSummaryDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public ProviderSpecialization Specialization { get; set; }
    public string SpecializationDisplay { get; set; } = string.Empty;
    public string? SubSpecialty { get; set; }
    public int YearsOfExperience { get; set; }
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public bool IsVerified { get; set; }
    public bool AcceptsNewPatients { get; set; }
    public string? ProfileImage { get; set; }
}

public class CreateHealthcareProviderDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public ProviderSpecialization Specialization { get; set; }
    public string? SubSpecialty { get; set; }
    public string LicenseNumber { get; set; } = string.Empty;
    public int YearsOfExperience { get; set; }
    public List<string> Qualifications { get; set; } = new();
    public string Biography { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public Dictionary<string, decimal> ConsultationFees { get; set; } = new();
    public Dictionary<string, List<string>> Availability { get; set; } = new();
    public List<string> Languages { get; set; } = new();
    public string? ProfileImage { get; set; }
    public Guid? PrimaryFacilityId { get; set; }
}

public class UpdateHealthcareProviderDto
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? SubSpecialty { get; set; }
    public int YearsOfExperience { get; set; }
    public List<string> Qualifications { get; set; } = new();
    public string Biography { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public Dictionary<string, decimal> ConsultationFees { get; set; } = new();
    public Dictionary<string, List<string>> Availability { get; set; } = new();
    public List<string> Languages { get; set; } = new();
    public string? ProfileImage { get; set; }
    public bool AcceptsNewPatients { get; set; }
}

public class HealthcareProviderSearchDto
{
    public string? SearchTerm { get; set; }
    public ProviderSpecialization? Specialization { get; set; }
    public double? MinRating { get; set; }
    public bool? AcceptsNewPatients { get; set; }
    public bool? IsVerified { get; set; }
    public Guid? FacilityId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
