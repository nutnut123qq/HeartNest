using CareNest.Domain.Entities;
using CareNest.Domain.Interfaces;
using CareNest.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CareNest.Infrastructure.Repositories;

public class FacilityReviewRepository : IFacilityReviewRepository
{
    private readonly CareNestDbContext _context;

    public FacilityReviewRepository(CareNestDbContext context)
    {
        _context = context;
    }

    public async Task<FacilityReview?> GetByIdAsync(Guid id)
    {
        return await _context.FacilityReviews
            .Include(r => r.User)
            .Include(r => r.Facility)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<FacilityReview>> GetByFacilityAsync(Guid facilityId, int page = 1, int pageSize = 10)
    {
        return await _context.FacilityReviews
            .Include(r => r.User)
            .Where(r => r.FacilityId == facilityId)
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<FacilityReview>> GetByUserAsync(Guid userId, int page = 1, int pageSize = 10)
    {
        return await _context.FacilityReviews
            .Include(r => r.Facility)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<FacilityReview?> GetUserReviewForFacilityAsync(Guid userId, Guid facilityId)
    {
        return await _context.FacilityReviews
            .Include(r => r.User)
            .Include(r => r.Facility)
            .FirstOrDefaultAsync(r => r.UserId == userId && r.FacilityId == facilityId);
    }

    public async Task<FacilityReview> CreateAsync(FacilityReview review)
    {
        _context.FacilityReviews.Add(review);
        await _context.SaveChangesAsync();
        return review;
    }

    public async Task<FacilityReview> UpdateAsync(FacilityReview review)
    {
        review.UpdatedAt = DateTime.UtcNow;
        _context.FacilityReviews.Update(review);
        await _context.SaveChangesAsync();
        return review;
    }

    public async Task DeleteAsync(Guid id)
    {
        var review = await GetByIdAsync(id);
        if (review != null)
        {
            _context.FacilityReviews.Remove(review);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.FacilityReviews
            .AnyAsync(r => r.Id == id);
    }

    public async Task<bool> UserHasReviewedFacilityAsync(Guid userId, Guid facilityId)
    {
        return await _context.FacilityReviews
            .AnyAsync(r => r.UserId == userId && r.FacilityId == facilityId);
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _context.FacilityReviews.CountAsync();
    }

    public async Task<int> GetCountByFacilityAsync(Guid facilityId)
    {
        return await _context.FacilityReviews
            .CountAsync(r => r.FacilityId == facilityId);
    }

    public async Task<decimal> GetAverageRatingByFacilityAsync(Guid facilityId)
    {
        var reviews = await _context.FacilityReviews
            .Where(r => r.FacilityId == facilityId)
            .ToListAsync();

        return reviews.Any() ? (decimal)reviews.Average(r => r.Rating) : 0;
    }

    public async Task<Dictionary<int, int>> GetRatingDistributionAsync(Guid facilityId)
    {
        var reviews = await _context.FacilityReviews
            .Where(r => r.FacilityId == facilityId)
            .ToListAsync();

        var distribution = new Dictionary<int, int>();
        for (int i = 1; i <= 5; i++)
        {
            distribution[i] = reviews.Count(r => r.Rating == i);
        }

        return distribution;
    }
}
