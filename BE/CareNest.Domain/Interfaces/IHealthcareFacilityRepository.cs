using CareNest.Domain.Entities;
using CareNest.Domain.Enums;

namespace CareNest.Domain.Interfaces;

public interface IHealthcareFacilityRepository
{
    Task<HealthcareFacility?> GetByIdAsync(Guid id);
    Task<HealthcareFacility?> GetByIdWithProvidersAsync(Guid id);
    Task<HealthcareFacility?> GetByIdWithReviewsAsync(Guid id);
    Task<IEnumerable<HealthcareFacility>> GetAllAsync();
    Task<IEnumerable<HealthcareFacility>> GetActiveAsync();
    Task<IEnumerable<HealthcareFacility>> GetByTypeAsync(HealthcareFacilityType type);
    Task<IEnumerable<HealthcareFacility>> SearchAsync(string searchTerm);
    Task<IEnumerable<HealthcareFacility>> GetNearbyAsync(double latitude, double longitude, double radiusKm);
    Task<IEnumerable<HealthcareFacility>> GetWithFiltersAsync(
        HealthcareFacilityType? type = null,
        double? minRating = null,
        bool? isVerified = null,
        double? latitude = null,
        double? longitude = null,
        double? radiusKm = null,
        int page = 1,
        int pageSize = 20);
    
    Task<HealthcareFacility> CreateAsync(HealthcareFacility facility);
    Task<HealthcareFacility> UpdateAsync(HealthcareFacility facility);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    
    // Statistics
    Task<int> GetTotalCountAsync();
    Task<int> GetCountByTypeAsync(HealthcareFacilityType type);
    Task<decimal> GetAverageRatingAsync();
    
    // Reviews
    Task<IEnumerable<FacilityReview>> GetReviewsAsync(Guid facilityId, int page = 1, int pageSize = 10);
    Task<decimal> CalculateAverageRatingAsync(Guid facilityId);
    Task UpdateRatingAsync(Guid facilityId);
}
