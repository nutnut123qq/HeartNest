using CareNest.Domain.Entities;
using CareNest.Domain.Interfaces;
using CareNest.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CareNest.Infrastructure.Repositories;

public class ProviderReviewRepository : IProviderReviewRepository
{
    private readonly CareNestDbContext _context;

    public ProviderReviewRepository(CareNestDbContext context)
    {
        _context = context;
    }

    public async Task<ProviderReview?> GetByIdAsync(Guid id)
    {
        return await _context.ProviderReviews
            .Include(r => r.User)
            .Include(r => r.Provider)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<ProviderReview>> GetByProviderAsync(Guid providerId, int page = 1, int pageSize = 10)
    {
        return await _context.ProviderReviews
            .Include(r => r.User)
            .Where(r => r.ProviderId == providerId)
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<ProviderReview>> GetByUserAsync(Guid userId, int page = 1, int pageSize = 10)
    {
        return await _context.ProviderReviews
            .Include(r => r.Provider)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<ProviderReview?> GetUserReviewForProviderAsync(Guid userId, Guid providerId)
    {
        return await _context.ProviderReviews
            .Include(r => r.User)
            .Include(r => r.Provider)
            .FirstOrDefaultAsync(r => r.UserId == userId && r.ProviderId == providerId);
    }

    public async Task<ProviderReview> CreateAsync(ProviderReview review)
    {
        _context.ProviderReviews.Add(review);
        await _context.SaveChangesAsync();
        return review;
    }

    public async Task<ProviderReview> UpdateAsync(ProviderReview review)
    {
        review.UpdatedAt = DateTime.UtcNow;
        _context.ProviderReviews.Update(review);
        await _context.SaveChangesAsync();
        return review;
    }

    public async Task DeleteAsync(Guid id)
    {
        var review = await GetByIdAsync(id);
        if (review != null)
        {
            _context.ProviderReviews.Remove(review);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.ProviderReviews
            .AnyAsync(r => r.Id == id);
    }

    public async Task<bool> UserHasReviewedProviderAsync(Guid userId, Guid providerId)
    {
        return await _context.ProviderReviews
            .AnyAsync(r => r.UserId == userId && r.ProviderId == providerId);
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _context.ProviderReviews.CountAsync();
    }

    public async Task<int> GetCountByProviderAsync(Guid providerId)
    {
        return await _context.ProviderReviews
            .CountAsync(r => r.ProviderId == providerId);
    }

    public async Task<decimal> GetAverageRatingByProviderAsync(Guid providerId)
    {
        var reviews = await _context.ProviderReviews
            .Where(r => r.ProviderId == providerId)
            .ToListAsync();

        return reviews.Any() ? (decimal)reviews.Average(r => r.Rating) : 0;
    }

    public async Task<Dictionary<int, int>> GetRatingDistributionAsync(Guid providerId)
    {
        var reviews = await _context.ProviderReviews
            .Where(r => r.ProviderId == providerId)
            .ToListAsync();

        var distribution = new Dictionary<int, int>();
        for (int i = 1; i <= 5; i++)
        {
            distribution[i] = reviews.Count(r => r.Rating == i);
        }

        return distribution;
    }
}
