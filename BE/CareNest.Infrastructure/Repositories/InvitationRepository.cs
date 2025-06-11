using CareNest.Domain.Entities;
using CareNest.Domain.Enums;
using CareNest.Domain.Interfaces;
using CareNest.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CareNest.Infrastructure.Repositories;

public class InvitationRepository : IInvitationRepository
{
    private readonly CareNestDbContext _context;

    public InvitationRepository(CareNestDbContext context)
    {
        _context = context;
    }

    public async Task<Invitation?> GetByIdAsync(Guid id)
    {
        return await _context.Invitations
            .Include(i => i.Family)
            .Include(i => i.InvitedByUser)
            .FirstOrDefaultAsync(i => i.Id == id);
    }

    public async Task<IEnumerable<Invitation>> GetByFamilyIdAsync(Guid familyId)
    {
        return await _context.Invitations
            .Include(i => i.Family)
            .Include(i => i.InvitedByUser)
            .Where(i => i.FamilyId == familyId)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Invitation>> GetByEmailAsync(string email)
    {
        return await _context.Invitations
            .Include(i => i.Family)
            .Include(i => i.InvitedByUser)
            .Where(i => i.Email.ToLower() == email.ToLower())
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Invitation>> GetPendingByEmailAsync(string email)
    {
        return await _context.Invitations
            .Include(i => i.Family)
            .Include(i => i.InvitedByUser)
            .Where(i => i.Email.ToLower() == email.ToLower() && 
                       i.Status == InvitationStatus.Pending &&
                       i.ExpiresAt > DateTime.UtcNow)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
    }

    public async Task<Invitation?> GetPendingByFamilyAndEmailAsync(Guid familyId, string email)
    {
        return await _context.Invitations
            .FirstOrDefaultAsync(i => i.FamilyId == familyId && 
                                    i.Email.ToLower() == email.ToLower() &&
                                    i.Status == InvitationStatus.Pending &&
                                    i.ExpiresAt > DateTime.UtcNow);
    }

    public async Task<Invitation> CreateAsync(Invitation invitation)
    {
        _context.Invitations.Add(invitation);
        await _context.SaveChangesAsync();
        return invitation;
    }

    public async Task<Invitation> UpdateAsync(Invitation invitation)
    {
        _context.Invitations.Update(invitation);
        await _context.SaveChangesAsync();
        return invitation;
    }

    public async Task DeleteAsync(Guid id)
    {
        var invitation = await _context.Invitations.FindAsync(id);
        if (invitation != null)
        {
            invitation.IsDeleted = true;
            invitation.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Invitations.AnyAsync(i => i.Id == id);
    }

    public async Task<int> GetPendingCountByFamilyAsync(Guid familyId)
    {
        return await _context.Invitations
            .CountAsync(i => i.FamilyId == familyId && 
                           i.Status == InvitationStatus.Pending &&
                           i.ExpiresAt > DateTime.UtcNow);
    }

    public async Task ExpireOldInvitationsAsync()
    {
        var expiredInvitations = await _context.Invitations
            .Where(i => i.Status == InvitationStatus.Pending && i.ExpiresAt <= DateTime.UtcNow)
            .ToListAsync();

        foreach (var invitation in expiredInvitations)
        {
            invitation.Status = InvitationStatus.Expired;
            invitation.UpdatedAt = DateTime.UtcNow;
        }

        if (expiredInvitations.Any())
        {
            await _context.SaveChangesAsync();
        }
    }
}
