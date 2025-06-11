using CareNest.Domain.Enums;

namespace CareNest.Application.DTOs.Healthcare;

public class HealthcareFacilityDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public HealthcareFacilityType Type { get; set; }
    public string TypeDisplay { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Website { get; set; }
    
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    
    public List<string> OperatingHours { get; set; } = new();
    public List<string> Services { get; set; } = new();
    public List<string> Images { get; set; } = new();
    
    public bool IsActive { get; set; }
    public bool IsVerified { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation properties
    public List<HealthcareProviderSummaryDto> Providers { get; set; } = new();
    public List<FacilityReviewDto> RecentReviews { get; set; } = new();
    
    // Calculated properties
    public double? DistanceKm { get; set; }
}

public class HealthcareFacilitySummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public HealthcareFacilityType Type { get; set; }
    public string TypeDisplay { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public decimal AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public bool IsVerified { get; set; }
    public double? DistanceKm { get; set; }
}

public class CreateHealthcareFacilityDto
{
    public string Name { get; set; } = string.Empty;
    public HealthcareFacilityType Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Website { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public List<string> OperatingHours { get; set; } = new();
    public List<string> Services { get; set; } = new();
    public List<string> Images { get; set; } = new();
}

public class UpdateHealthcareFacilityDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Website { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public List<string> OperatingHours { get; set; } = new();
    public List<string> Services { get; set; } = new();
    public List<string> Images { get; set; } = new();
}

public class HealthcareFacilitySearchDto
{
    public string? SearchTerm { get; set; }
    public HealthcareFacilityType? Type { get; set; }
    public double? MinRating { get; set; }
    public bool? IsVerified { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public double? RadiusKm { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
