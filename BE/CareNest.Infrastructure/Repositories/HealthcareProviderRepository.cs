using CareNest.Domain.Entities;
using CareNest.Domain.Enums;
using CareNest.Domain.Interfaces;
using CareNest.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CareNest.Infrastructure.Repositories;

public class HealthcareProviderRepository : IHealthcareProviderRepository
{
    private readonly CareNestDbContext _context;

    public HealthcareProviderRepository(CareNestDbContext context)
    {
        _context = context;
    }

    public async Task<HealthcareProvider?> GetByIdAsync(Guid id)
    {
        return await _context.HealthcareProviders
            .Include(p => p.PrimaryFacility)
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
    }

    public async Task<HealthcareProvider?> GetByIdWithFacilitiesAsync(Guid id)
    {
        return await _context.HealthcareProviders
            .Include(p => p.PrimaryFacility)
            .Include(p => p.ProviderFacilities)
                .ThenInclude(pf => pf.Facility)
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
    }

    public async Task<HealthcareProvider?> GetByIdWithReviewsAsync(Guid id)
    {
        return await _context.HealthcareProviders
            .Include(p => p.PrimaryFacility)
            .Include(p => p.Reviews.OrderByDescending(r => r.CreatedAt).Take(10))
                .ThenInclude(r => r.User)
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
    }

    public async Task<IEnumerable<HealthcareProvider>> GetAllAsync()
    {
        return await _context.HealthcareProviders
            .Include(p => p.PrimaryFacility)
            .Where(p => p.IsActive)
            .OrderBy(p => p.LastName)
            .ThenBy(p => p.FirstName)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthcareProvider>> GetActiveAsync()
    {
        return await _context.HealthcareProviders
            .Include(p => p.PrimaryFacility)
            .Where(p => p.IsActive)
            .OrderByDescending(p => p.AverageRating)
            .ThenBy(p => p.LastName)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthcareProvider>> GetBySpecializationAsync(ProviderSpecialization specialization)
    {
        return await _context.HealthcareProviders
            .Include(p => p.PrimaryFacility)
            .Where(p => p.Specialization == specialization && p.IsActive)
            .OrderByDescending(p => p.AverageRating)
            .ThenBy(p => p.LastName)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthcareProvider>> GetByFacilityAsync(Guid facilityId)
    {
        return await _context.HealthcareProviders
            .Include(p => p.PrimaryFacility)
            .Where(p => p.IsActive && 
                       (p.PrimaryFacilityId == facilityId || 
                        p.ProviderFacilities.Any(pf => pf.FacilityId == facilityId && pf.IsActive)))
            .OrderByDescending(p => p.AverageRating)
            .ThenBy(p => p.LastName)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthcareProvider>> SearchAsync(string searchTerm)
    {
        var term = searchTerm.ToLower();
        return await _context.HealthcareProviders
            .Include(p => p.PrimaryFacility)
            .Where(p => p.IsActive && 
                       (p.FirstName.ToLower().Contains(term) ||
                        p.LastName.ToLower().Contains(term) ||
                        p.Biography.ToLower().Contains(term) ||
                        p.SubSpecialty != null && p.SubSpecialty.ToLower().Contains(term)))
            .OrderByDescending(p => p.AverageRating)
            .ThenBy(p => p.LastName)
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthcareProvider>> GetWithFiltersAsync(
        ProviderSpecialization? specialization = null,
        double? minRating = null,
        bool? acceptsNewPatients = null,
        bool? isVerified = null,
        Guid? facilityId = null,
        int page = 1,
        int pageSize = 20)
    {
        var query = _context.HealthcareProviders
            .Include(p => p.PrimaryFacility)
            .Where(p => p.IsActive);

        if (specialization.HasValue)
            query = query.Where(p => p.Specialization == specialization.Value);

        if (minRating.HasValue)
            query = query.Where(p => p.AverageRating >= (decimal)minRating.Value);

        if (acceptsNewPatients.HasValue)
            query = query.Where(p => p.AcceptsNewPatients == acceptsNewPatients.Value);

        if (isVerified.HasValue)
            query = query.Where(p => p.IsVerified == isVerified.Value);

        if (facilityId.HasValue)
            query = query.Where(p => p.PrimaryFacilityId == facilityId.Value ||
                                    p.ProviderFacilities.Any(pf => pf.FacilityId == facilityId.Value && pf.IsActive));

        return await query
            .OrderByDescending(p => p.AverageRating)
            .ThenBy(p => p.LastName)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<HealthcareProvider> CreateAsync(HealthcareProvider provider)
    {
        _context.HealthcareProviders.Add(provider);
        await _context.SaveChangesAsync();
        return provider;
    }

    public async Task<HealthcareProvider> UpdateAsync(HealthcareProvider provider)
    {
        provider.UpdatedAt = DateTime.UtcNow;
        _context.HealthcareProviders.Update(provider);
        await _context.SaveChangesAsync();
        return provider;
    }

    public async Task DeleteAsync(Guid id)
    {
        var provider = await GetByIdAsync(id);
        if (provider != null)
        {
            provider.IsActive = false;
            provider.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.HealthcareProviders
            .AnyAsync(p => p.Id == id && p.IsActive);
    }

    public async Task<bool> ExistsByLicenseAsync(string licenseNumber)
    {
        return await _context.HealthcareProviders
            .AnyAsync(p => p.LicenseNumber == licenseNumber && p.IsActive);
    }

    public async Task AddToFacilityAsync(Guid providerId, Guid facilityId, bool isPrimary = false)
    {
        var existing = await _context.ProviderFacilities
            .FirstOrDefaultAsync(pf => pf.ProviderId == providerId && pf.FacilityId == facilityId);

        if (existing == null)
        {
            var providerFacility = new ProviderFacility
            {
                ProviderId = providerId,
                FacilityId = facilityId,
                IsPrimary = isPrimary,
                IsActive = true
            };

            _context.ProviderFacilities.Add(providerFacility);

            if (isPrimary)
            {
                var provider = await GetByIdAsync(providerId);
                if (provider != null)
                {
                    provider.PrimaryFacilityId = facilityId;
                    provider.UpdatedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();
        }
    }

    public async Task RemoveFromFacilityAsync(Guid providerId, Guid facilityId)
    {
        var providerFacility = await _context.ProviderFacilities
            .FirstOrDefaultAsync(pf => pf.ProviderId == providerId && pf.FacilityId == facilityId);

        if (providerFacility != null)
        {
            providerFacility.IsActive = false;
            providerFacility.EndDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<HealthcareFacility>> GetProviderFacilitiesAsync(Guid providerId)
    {
        return await _context.ProviderFacilities
            .Include(pf => pf.Facility)
            .Where(pf => pf.ProviderId == providerId && pf.IsActive)
            .Select(pf => pf.Facility)
            .ToListAsync();
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _context.HealthcareProviders
            .CountAsync(p => p.IsActive);
    }

    public async Task<int> GetCountBySpecializationAsync(ProviderSpecialization specialization)
    {
        return await _context.HealthcareProviders
            .CountAsync(p => p.Specialization == specialization && p.IsActive);
    }

    public async Task<decimal> GetAverageRatingAsync()
    {
        var providers = await _context.HealthcareProviders
            .Where(p => p.IsActive && p.ReviewCount > 0)
            .ToListAsync();

        return providers.Any() ? (decimal)providers.Average(p => (double)p.AverageRating) : 0;
    }

    public async Task<IEnumerable<ProviderReview>> GetReviewsAsync(Guid providerId, int page = 1, int pageSize = 10)
    {
        return await _context.ProviderReviews
            .Include(r => r.User)
            .Where(r => r.ProviderId == providerId)
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<decimal> CalculateAverageRatingAsync(Guid providerId)
    {
        var reviews = await _context.ProviderReviews
            .Where(r => r.ProviderId == providerId)
            .ToListAsync();

        return reviews.Any() ? (decimal)reviews.Average(r => r.Rating) : 0;
    }

    public async Task UpdateRatingAsync(Guid providerId)
    {
        var provider = await GetByIdAsync(providerId);
        if (provider != null)
        {
            var reviews = await _context.ProviderReviews
                .Where(r => r.ProviderId == providerId)
                .ToListAsync();

            provider.ReviewCount = reviews.Count;
            provider.AverageRating = reviews.Any() ? (decimal)reviews.Average(r => r.Rating) : 0;
            provider.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
    }
}
