using CareNest.Domain.Entities;
using CareNest.Domain.Enums;

namespace CareNest.Domain.Interfaces;

public interface IHealthcareProviderRepository
{
    Task<HealthcareProvider?> GetByIdAsync(Guid id);
    Task<HealthcareProvider?> GetByIdWithFacilitiesAsync(Guid id);
    Task<HealthcareProvider?> GetByIdWithReviewsAsync(Guid id);
    Task<IEnumerable<HealthcareProvider>> GetAllAsync();
    Task<IEnumerable<HealthcareProvider>> GetActiveAsync();
    Task<IEnumerable<HealthcareProvider>> GetBySpecializationAsync(ProviderSpecialization specialization);
    Task<IEnumerable<HealthcareProvider>> GetByFacilityAsync(Guid facilityId);
    Task<IEnumerable<HealthcareProvider>> SearchAsync(string searchTerm);
    Task<IEnumerable<HealthcareProvider>> GetWithFiltersAsync(
        ProviderSpecialization? specialization = null,
        double? minRating = null,
        bool? acceptsNewPatients = null,
        bool? isVerified = null,
        Guid? facilityId = null,
        int page = 1,
        int pageSize = 20);
    
    Task<HealthcareProvider> CreateAsync(HealthcareProvider provider);
    Task<HealthcareProvider> UpdateAsync(HealthcareProvider provider);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<bool> ExistsByLicenseAsync(string licenseNumber);
    
    // Facility relationships
    Task AddToFacilityAsync(Guid providerId, Guid facilityId, bool isPrimary = false);
    Task RemoveFromFacilityAsync(Guid providerId, Guid facilityId);
    Task<IEnumerable<HealthcareFacility>> GetProviderFacilitiesAsync(Guid providerId);
    
    // Statistics
    Task<int> GetTotalCountAsync();
    Task<int> GetCountBySpecializationAsync(ProviderSpecialization specialization);
    Task<decimal> GetAverageRatingAsync();
    
    // Reviews
    Task<IEnumerable<ProviderReview>> GetReviewsAsync(Guid providerId, int page = 1, int pageSize = 10);
    Task<decimal> CalculateAverageRatingAsync(Guid providerId);
    Task UpdateRatingAsync(Guid providerId);
}
