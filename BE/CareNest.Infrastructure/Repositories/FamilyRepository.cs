using CareNest.Domain.Entities;
using CareNest.Domain.Interfaces;
using CareNest.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CareNest.Infrastructure.Repositories;

public class FamilyRepository : IFamilyRepository
{
    private readonly CareNestDbContext _context;

    public FamilyRepository(CareNestDbContext context)
    {
        _context = context;
    }

    public async Task<Family?> GetByIdAsync(Guid id)
    {
        return await _context.Families
            .Include(f => f.Creator)
            .FirstOrDefaultAsync(f => f.Id == id && f.IsActive);
    }

    public async Task<Family?> GetByUserIdAsync(Guid userId)
    {
        return await _context.Families
            .Include(f => f.Creator)
            .Include(f => f.Members)
                .ThenInclude(m => m.User)
            .FirstOrDefaultAsync(f => f.Members.Any(m => m.UserId == userId && m.IsActive) && f.IsActive);
    }

    public async Task<Family?> GetWithMembersAsync(Guid familyId)
    {
        return await _context.Families
            .Include(f => f.Creator)
            .Include(f => f.Members)
                .ThenInclude(m => m.User)
            .Include(f => f.Invitations)
            .FirstOrDefaultAsync(f => f.Id == familyId && f.IsActive);
    }

    public async Task<IEnumerable<Family>> GetAllAsync()
    {
        return await _context.Families
            .Include(f => f.Creator)
            .Include(f => f.Members)
            .Where(f => f.IsActive)
            .ToListAsync();
    }

    public async Task<Family> CreateAsync(Family family)
    {
        _context.Families.Add(family);
        await _context.SaveChangesAsync();
        return family;
    }

    public async Task<Family> UpdateAsync(Family family)
    {
        _context.Families.Update(family);
        await _context.SaveChangesAsync();
        return family;
    }

    public async Task DeleteAsync(Guid id)
    {
        var family = await _context.Families.FindAsync(id);
        if (family != null)
        {
            family.IsDeleted = true;
            family.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Families.AnyAsync(f => f.Id == id && f.IsActive);
    }

    public async Task<bool> IsUserMemberAsync(Guid familyId, Guid userId)
    {
        return await _context.FamilyMembers
            .AnyAsync(m => m.FamilyId == familyId && m.UserId == userId && m.IsActive);
    }

    public async Task<bool> IsUserAdminAsync(Guid familyId, Guid userId)
    {
        return await _context.FamilyMembers
            .AnyAsync(m => m.FamilyId == familyId && m.UserId == userId && m.Role == Domain.Enums.FamilyRole.Admin && m.IsActive);
    }
}
