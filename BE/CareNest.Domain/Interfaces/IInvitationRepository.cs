using CareNest.Domain.Entities;
using CareNest.Domain.Enums;

namespace CareNest.Domain.Interfaces;

public interface IInvitationRepository
{
    Task<Invitation?> GetByIdAsync(Guid id);
    Task<IEnumerable<Invitation>> GetByFamilyIdAsync(Guid familyId);
    Task<IEnumerable<Invitation>> GetByEmailAsync(string email);
    Task<IEnumerable<Invitation>> GetPendingByEmailAsync(string email);
    Task<Invitation?> GetPendingByFamilyAndEmailAsync(Guid familyId, string email);
    Task<Invitation> CreateAsync(Invitation invitation);
    Task<Invitation> UpdateAsync(Invitation invitation);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<int> GetPendingCountByFamilyAsync(Guid familyId);
    Task ExpireOldInvitationsAsync();
}
