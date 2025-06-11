using CareNest.Domain.Entities;

namespace CareNest.Domain.Interfaces;

public interface IProviderReviewRepository
{
    Task<ProviderReview?> GetByIdAsync(Guid id);
    Task<IEnumerable<ProviderReview>> GetByProviderAsync(Guid providerId, int page = 1, int pageSize = 10);
    Task<IEnumerable<ProviderReview>> GetByUserAsync(Guid userId, int page = 1, int pageSize = 10);
    Task<ProviderReview?> GetUserReviewForProviderAsync(Guid userId, Guid providerId);
    
    Task<ProviderReview> CreateAsync(ProviderReview review);
    Task<ProviderReview> UpdateAsync(ProviderReview review);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<bool> UserHasReviewedProviderAsync(Guid userId, Guid providerId);
    
    // Statistics
    Task<int> GetTotalCountAsync();
    Task<int> GetCountByProviderAsync(Guid providerId);
    Task<decimal> GetAverageRatingByProviderAsync(Guid providerId);
    Task<Dictionary<int, int>> GetRatingDistributionAsync(Guid providerId);
}
