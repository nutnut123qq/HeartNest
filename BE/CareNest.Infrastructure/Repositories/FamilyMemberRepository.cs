using CareNest.Domain.Entities;
using CareNest.Domain.Enums;
using CareNest.Domain.Interfaces;
using CareNest.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CareNest.Infrastructure.Repositories;

public class FamilyMemberRepository : IFamilyMemberRepository
{
    private readonly CareNestDbContext _context;

    public FamilyMemberRepository(CareNestDbContext context)
    {
        _context = context;
    }

    public async Task<FamilyMember?> GetByIdAsync(Guid id)
    {
        return await _context.FamilyMembers
            .Include(m => m.User)
            .Include(m => m.Family)
            .FirstOrDefaultAsync(m => m.Id == id && m.IsActive);
    }

    public async Task<FamilyMember?> GetByFamilyAndUserAsync(Guid familyId, Guid userId)
    {
        return await _context.FamilyMembers
            .Include(m => m.User)
            .Include(m => m.Family)
            .FirstOrDefaultAsync(m => m.FamilyId == familyId && m.UserId == userId && m.IsActive);
    }

    public async Task<IEnumerable<FamilyMember>> GetByFamilyIdAsync(Guid familyId)
    {
        return await _context.FamilyMembers
            .Include(m => m.User)
            .Where(m => m.FamilyId == familyId && m.IsActive)
            .OrderBy(m => m.Role)
            .ThenBy(m => m.JoinedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<FamilyMember>> GetByUserIdAsync(Guid userId)
    {
        return await _context.FamilyMembers
            .Include(m => m.Family)
            .Include(m => m.User)
            .Where(m => m.UserId == userId && m.IsActive)
            .ToListAsync();
    }

    public async Task<FamilyMember> CreateAsync(FamilyMember familyMember)
    {
        _context.FamilyMembers.Add(familyMember);
        await _context.SaveChangesAsync();
        return familyMember;
    }

    public async Task<FamilyMember> UpdateAsync(FamilyMember familyMember)
    {
        _context.FamilyMembers.Update(familyMember);
        await _context.SaveChangesAsync();
        return familyMember;
    }

    public async Task DeleteAsync(Guid id)
    {
        var member = await _context.FamilyMembers.FindAsync(id);
        if (member != null)
        {
            member.IsDeleted = true;
            member.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.FamilyMembers.AnyAsync(m => m.Id == id && m.IsActive);
    }

    public async Task<int> GetMemberCountByFamilyAsync(Guid familyId)
    {
        return await _context.FamilyMembers
            .CountAsync(m => m.FamilyId == familyId && m.IsActive);
    }

    public async Task<int> GetAdminCountByFamilyAsync(Guid familyId)
    {
        return await _context.FamilyMembers
            .CountAsync(m => m.FamilyId == familyId && m.Role == FamilyRole.Admin && m.IsActive);
    }

    public async Task<bool> IsLastAdminAsync(Guid familyId, Guid userId)
    {
        var adminCount = await GetAdminCountByFamilyAsync(familyId);
        if (adminCount <= 1)
        {
            var member = await GetByFamilyAndUserAsync(familyId, userId);
            return member?.Role == FamilyRole.Admin;
        }
        return false;
    }
}
