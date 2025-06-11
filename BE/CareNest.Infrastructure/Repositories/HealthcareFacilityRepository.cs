using CareNest.Domain.Entities;
using CareNest.Domain.Enums;
using CareNest.Domain.Interfaces;
using CareNest.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CareNest.Infrastructure.Repositories;

public class HealthcareFacilityRepository : IHealthcareFacilityRepository
{
    private readonly CareNestDbContext _context;

    public HealthcareFacilityRepository(CareNestDbContext context)
    {
        _context = context;
    }

    public async Task<HealthcareFacility?> GetByIdAsync(Guid id)
    {
        return await _context.HealthcareFacilities
            .FirstOrDefaultAsync(f => f.Id == id && f.IsActive);
    }

    public async Task<HealthcareFacility?> GetByIdWithProvidersAsync(Guid id)
    {
        return await _context.HealthcareFacilities
            .Include(f => f.Providers.Where(p => p.IsActive))
            .FirstOrDefaultAsync(f => f.Id == id && f.IsActive);
    }

    public async Task<HealthcareFacility?> GetByIdWithReviewsAsync(Guid id)
    {
        return await _context.HealthcareFacilities
            .Include(f => f.Reviews.OrderByDescending(r => r.CreatedAt).Take(10))
            .ThenInclude(r => r.User)
            .FirstOrDefaultAsync(f => f.Id == id && f.IsActive);
    }

    public async Task<IEnumerable<HealthcareFacility>> GetAllAsync()
    {
        return await _context.HealthcareFacilities
            .Where(f => f.IsActive)
            .OrderBy(f => f.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthcareFacility>> GetActiveAsync()
    {
        return await _context.HealthcareFacilities
            .Where(f => f.IsActive)
            .OrderByDescending(f => f.AverageRating)
            .ThenBy(f => f.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthcareFacility>> GetByTypeAsync(HealthcareFacilityType type)
    {
        return await _context.HealthcareFacilities
            .Where(f => f.Type == type && f.IsActive)
            .OrderByDescending(f => f.AverageRating)
            .ThenBy(f => f.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthcareFacility>> SearchAsync(string searchTerm)
    {
        var term = searchTerm.ToLower();
        return await _context.HealthcareFacilities
            .Where(f => f.IsActive && 
                       (f.Name.ToLower().Contains(term) ||
                        f.Description.ToLower().Contains(term) ||
                        f.Address.ToLower().Contains(term)))
            .OrderByDescending(f => f.AverageRating)
            .ThenBy(f => f.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthcareFacility>> GetNearbyAsync(double latitude, double longitude, double radiusKm)
    {
        // Simple distance calculation using Haversine formula approximation
        // For production, consider using spatial data types or PostGIS
        return await _context.HealthcareFacilities
            .Where(f => f.IsActive)
            .ToListAsync()
            .ContinueWith(task =>
            {
                var facilities = task.Result;
                return facilities.Where(f =>
                {
                    var distance = CalculateDistance(latitude, longitude, f.Latitude, f.Longitude);
                    return distance <= radiusKm;
                })
                .OrderBy(f => CalculateDistance(latitude, longitude, f.Latitude, f.Longitude))
                .AsEnumerable();
            });
    }

    public async Task<IEnumerable<HealthcareFacility>> GetWithFiltersAsync(
        HealthcareFacilityType? type = null,
        double? minRating = null,
        bool? isVerified = null,
        double? latitude = null,
        double? longitude = null,
        double? radiusKm = null,
        int page = 1,
        int pageSize = 20)
    {
        var query = _context.HealthcareFacilities.Where(f => f.IsActive);

        if (type.HasValue)
            query = query.Where(f => f.Type == type.Value);

        if (minRating.HasValue)
            query = query.Where(f => f.AverageRating >= (decimal)minRating.Value);

        if (isVerified.HasValue)
            query = query.Where(f => f.IsVerified == isVerified.Value);

        var facilities = await query
            .OrderByDescending(f => f.AverageRating)
            .ThenBy(f => f.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Apply location filter if specified
        if (latitude.HasValue && longitude.HasValue && radiusKm.HasValue)
        {
            facilities = facilities.Where(f =>
            {
                var distance = CalculateDistance(latitude.Value, longitude.Value, f.Latitude, f.Longitude);
                return distance <= radiusKm.Value;
            }).ToList();
        }

        return facilities;
    }

    public async Task<HealthcareFacility> CreateAsync(HealthcareFacility facility)
    {
        _context.HealthcareFacilities.Add(facility);
        await _context.SaveChangesAsync();
        return facility;
    }

    public async Task<HealthcareFacility> UpdateAsync(HealthcareFacility facility)
    {
        facility.UpdatedAt = DateTime.UtcNow;
        _context.HealthcareFacilities.Update(facility);
        await _context.SaveChangesAsync();
        return facility;
    }

    public async Task DeleteAsync(Guid id)
    {
        var facility = await GetByIdAsync(id);
        if (facility != null)
        {
            facility.IsActive = false;
            facility.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.HealthcareFacilities
            .AnyAsync(f => f.Id == id && f.IsActive);
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _context.HealthcareFacilities
            .CountAsync(f => f.IsActive);
    }

    public async Task<int> GetCountByTypeAsync(HealthcareFacilityType type)
    {
        return await _context.HealthcareFacilities
            .CountAsync(f => f.Type == type && f.IsActive);
    }

    public async Task<decimal> GetAverageRatingAsync()
    {
        var facilities = await _context.HealthcareFacilities
            .Where(f => f.IsActive && f.ReviewCount > 0)
            .ToListAsync();

        return facilities.Any() ? (decimal)facilities.Average(f => (double)f.AverageRating) : 0;
    }

    public async Task<IEnumerable<FacilityReview>> GetReviewsAsync(Guid facilityId, int page = 1, int pageSize = 10)
    {
        return await _context.FacilityReviews
            .Include(r => r.User)
            .Where(r => r.FacilityId == facilityId)
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<decimal> CalculateAverageRatingAsync(Guid facilityId)
    {
        var reviews = await _context.FacilityReviews
            .Where(r => r.FacilityId == facilityId)
            .ToListAsync();

        return reviews.Any() ? (decimal)reviews.Average(r => r.Rating) : 0;
    }

    public async Task UpdateRatingAsync(Guid facilityId)
    {
        var facility = await GetByIdAsync(facilityId);
        if (facility != null)
        {
            var reviews = await _context.FacilityReviews
                .Where(r => r.FacilityId == facilityId)
                .ToListAsync();

            facility.ReviewCount = reviews.Count;
            facility.AverageRating = reviews.Any() ? (decimal)reviews.Average(r => r.Rating) : 0;
            facility.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
    }

    private static double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
    {
        const double R = 6371; // Earth's radius in kilometers
        var dLat = ToRadians(lat2 - lat1);
        var dLon = ToRadians(lon2 - lon1);
        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return R * c;
    }

    private static double ToRadians(double degrees)
    {
        return degrees * Math.PI / 180;
    }
}
