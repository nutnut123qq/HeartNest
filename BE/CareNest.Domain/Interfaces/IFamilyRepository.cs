using CareNest.Domain.Entities;

namespace CareNest.Domain.Interfaces;

public interface IFamilyRepository
{
    Task<Family?> GetByIdAsync(Guid id);
    Task<Family?> GetByUserIdAsync(Guid userId);
    Task<Family?> GetWithMembersAsync(Guid familyId);
    Task<IEnumerable<Family>> GetAllAsync();
    Task<Family> CreateAsync(Family family);
    Task<Family> UpdateAsync(Family family);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<bool> IsUserMemberAsync(Guid familyId, Guid userId);
    Task<bool> IsUserAdminAsync(Guid familyId, Guid userId);
}
