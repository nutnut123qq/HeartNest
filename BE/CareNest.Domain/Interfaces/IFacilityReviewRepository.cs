using CareNest.Domain.Entities;

namespace CareNest.Domain.Interfaces;

public interface IFacilityReviewRepository
{
    Task<FacilityReview?> GetByIdAsync(Guid id);
    Task<IEnumerable<FacilityReview>> GetByFacilityAsync(Guid facilityId, int page = 1, int pageSize = 10);
    Task<IEnumerable<FacilityReview>> GetByUserAsync(Guid userId, int page = 1, int pageSize = 10);
    Task<FacilityReview?> GetUserReviewForFacilityAsync(Guid userId, Guid facilityId);
    
    Task<FacilityReview> CreateAsync(FacilityReview review);
    Task<FacilityReview> UpdateAsync(FacilityReview review);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<bool> UserHasReviewedFacilityAsync(Guid userId, Guid facilityId);
    
    // Statistics
    Task<int> GetTotalCountAsync();
    Task<int> GetCountByFacilityAsync(Guid facilityId);
    Task<decimal> GetAverageRatingByFacilityAsync(Guid facilityId);
    Task<Dictionary<int, int>> GetRatingDistributionAsync(Guid facilityId);
}
