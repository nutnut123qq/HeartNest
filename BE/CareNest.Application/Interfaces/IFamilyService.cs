using CareNest.Application.Common;
using CareNest.Application.DTOs.Family;
using CareNest.Domain.Enums;

namespace CareNest.Application.Interfaces;

public interface IFamilyService
{
    // Family management
    Task<ApiResponse<FamilyDto>> GetFamilyByUserAsync(Guid userId);
    Task<ApiResponse<FamilyDto>> GetFamilyByIdAsync(Guid familyId, Guid userId);
    Task<ApiResponse<FamilyDto>> CreateFamilyAsync(CreateFamilyDto createFamilyDto, Guid userId);
    Task<ApiResponse<FamilyDto>> UpdateFamilyAsync(Guid familyId, UpdateFamilyDto updateFamilyDto, Guid userId);
    Task<ApiResponse<bool>> DeleteFamilyAsync(Guid familyId, Guid userId);

    // Family member management
    Task<ApiResponse<IEnumerable<FamilyMemberDto>>> GetFamilyMembersAsync(Guid userId);
    Task<ApiResponse<FamilyMemberDto>> UpdateMemberRoleAsync(Guid memberId, UpdateFamilyMemberRoleDto updateDto, Guid userId);
    Task<ApiResponse<bool>> RemoveMemberAsync(Guid memberId, Guid userId);
    Task<ApiResponse<bool>> LeaveFamilyAsync(Guid userId);

    // Invitation management
    Task<ApiResponse<IEnumerable<InvitationDto>>> GetFamilyInvitationsAsync(Guid userId);
    Task<ApiResponse<IEnumerable<InvitationDto>>> GetUserInvitationsAsync(Guid userId);
    Task<ApiResponse<InvitationDto>> CreateInvitationAsync(CreateInvitationDto createInvitationDto, Guid userId);
    Task<ApiResponse<bool>> AcceptInvitationAsync(Guid invitationId, Guid userId);
    Task<ApiResponse<bool>> DeclineInvitationAsync(Guid invitationId, Guid userId);
    Task<ApiResponse<bool>> CancelInvitationAsync(Guid invitationId, Guid userId);

    // Utility methods
    Task<ApiResponse<bool>> CheckUserFamilyPermissionAsync(Guid userId, FamilyRole requiredRole);
}
