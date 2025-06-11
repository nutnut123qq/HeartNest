using CareNest.Domain.Entities;
using CareNest.Domain.Enums;

namespace CareNest.Domain.Interfaces;

public interface IFamilyMemberRepository
{
    Task<FamilyMember?> GetByIdAsync(Guid id);
    Task<FamilyMember?> GetByFamilyAndUserAsync(Guid familyId, Guid userId);
    Task<IEnumerable<FamilyMember>> GetByFamilyIdAsync(Guid familyId);
    Task<IEnumerable<FamilyMember>> GetByUserIdAsync(Guid userId);
    Task<FamilyMember> CreateAsync(FamilyMember familyMember);
    Task<FamilyMember> UpdateAsync(FamilyMember familyMember);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
    Task<int> GetMemberCountByFamilyAsync(Guid familyId);
    Task<int> GetAdminCountByFamilyAsync(Guid familyId);
    Task<bool> IsLastAdminAsync(Guid familyId, Guid userId);
}
