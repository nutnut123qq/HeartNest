using CareNest.Application.Common;
using CareNest.Application.DTOs.Family;
using CareNest.Application.Interfaces;
using CareNest.Domain.Entities;
using CareNest.Domain.Enums;
using CareNest.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace CareNest.Application.Services;

public class FamilyService : IFamilyService
{
    private readonly IFamilyRepository _familyRepository;
    private readonly IFamilyMemberRepository _familyMemberRepository;
    private readonly IInvitationRepository _invitationRepository;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<FamilyService> _logger;

    public FamilyService(
        IFamilyRepository familyRepository,
        IFamilyMemberRepository familyMemberRepository,
        IInvitationRepository invitationRepository,
        IUserRepository userRepository,
        ILogger<FamilyService> logger)
    {
        _familyRepository = familyRepository;
        _familyMemberRepository = familyMemberRepository;
        _invitationRepository = invitationRepository;
        _userRepository = userRepository;
        _logger = logger;
    }

    public async Task<ApiResponse<FamilyDto>> GetFamilyByUserAsync(Guid userId)
    {
        try
        {
            var family = await _familyRepository.GetByUserIdAsync(userId);
            if (family == null)
            {
                return ApiResponse<FamilyDto>.ErrorResult("Bạn chưa tham gia gia đình nào");
            }

            var familyDto = await MapToFamilyDtoAsync(family);
            return ApiResponse<FamilyDto>.SuccessResult(familyDto, "Lấy thông tin gia đình thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting family for user {UserId}", userId);
            return ApiResponse<FamilyDto>.ErrorResult("Có lỗi xảy ra khi lấy thông tin gia đình");
        }
    }

    public async Task<ApiResponse<FamilyDto>> GetFamilyByIdAsync(Guid familyId, Guid userId)
    {
        try
        {
            // Check if user is member of the family
            if (!await _familyRepository.IsUserMemberAsync(familyId, userId))
            {
                return ApiResponse<FamilyDto>.ErrorResult("Bạn không có quyền truy cập gia đình này");
            }

            var family = await _familyRepository.GetWithMembersAsync(familyId);
            if (family == null)
            {
                return ApiResponse<FamilyDto>.ErrorResult("Không tìm thấy gia đình");
            }

            var familyDto = await MapToFamilyDtoAsync(family);
            return ApiResponse<FamilyDto>.SuccessResult(familyDto, "Lấy thông tin gia đình thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting family {FamilyId} for user {UserId}", familyId, userId);
            return ApiResponse<FamilyDto>.ErrorResult("Có lỗi xảy ra khi lấy thông tin gia đình");
        }
    }

    public async Task<ApiResponse<FamilyDto>> CreateFamilyAsync(CreateFamilyDto createFamilyDto, Guid userId)
    {
        try
        {
            // Check if user already has a family
            var existingFamily = await _familyRepository.GetByUserIdAsync(userId);
            if (existingFamily != null)
            {
                return ApiResponse<FamilyDto>.ErrorResult("Bạn đã tham gia một gia đình khác");
            }

            // Create family
            var family = new Family
            {
                Id = Guid.NewGuid(),
                Name = createFamilyDto.Name.Trim(),
                Description = createFamilyDto.Description?.Trim(),
                CreatedBy = userId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            var createdFamily = await _familyRepository.CreateAsync(family);

            // Add creator as admin member
            var familyMember = new FamilyMember
            {
                Id = Guid.NewGuid(),
                FamilyId = createdFamily.Id,
                UserId = userId,
                Role = FamilyRole.Admin,
                JoinedAt = DateTime.UtcNow,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _familyMemberRepository.CreateAsync(familyMember);

            var familyDto = await MapToFamilyDtoAsync(createdFamily);
            return ApiResponse<FamilyDto>.SuccessResult(familyDto, "Tạo gia đình thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating family for user {UserId}", userId);
            return ApiResponse<FamilyDto>.ErrorResult("Có lỗi xảy ra khi tạo gia đình");
        }
    }

    public async Task<ApiResponse<FamilyDto>> UpdateFamilyAsync(Guid familyId, UpdateFamilyDto updateFamilyDto, Guid userId)
    {
        try
        {
            // Check if user is admin of the family
            if (!await _familyRepository.IsUserAdminAsync(familyId, userId))
            {
                return ApiResponse<FamilyDto>.ErrorResult("Bạn không có quyền chỉnh sửa gia đình này");
            }

            var family = await _familyRepository.GetByIdAsync(familyId);
            if (family == null)
            {
                return ApiResponse<FamilyDto>.ErrorResult("Không tìm thấy gia đình");
            }

            family.Name = updateFamilyDto.Name.Trim();
            family.Description = updateFamilyDto.Description?.Trim();
            family.UpdatedAt = DateTime.UtcNow;

            var updatedFamily = await _familyRepository.UpdateAsync(family);
            var familyDto = await MapToFamilyDtoAsync(updatedFamily);

            return ApiResponse<FamilyDto>.SuccessResult(familyDto, "Cập nhật gia đình thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating family {FamilyId} for user {UserId}", familyId, userId);
            return ApiResponse<FamilyDto>.ErrorResult("Có lỗi xảy ra khi cập nhật gia đình");
        }
    }

    public async Task<ApiResponse<bool>> DeleteFamilyAsync(Guid familyId, Guid userId)
    {
        try
        {
            var family = await _familyRepository.GetByIdAsync(familyId);
            if (family == null)
            {
                return ApiResponse<bool>.ErrorResult("Không tìm thấy gia đình");
            }

            // Only creator can delete family
            if (family.CreatedBy != userId)
            {
                return ApiResponse<bool>.ErrorResult("Chỉ người tạo gia đình mới có thể xóa gia đình");
            }

            await _familyRepository.DeleteAsync(familyId);
            return ApiResponse<bool>.SuccessResult(true, "Xóa gia đình thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting family {FamilyId} for user {UserId}", familyId, userId);
            return ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi xóa gia đình");
        }
    }

    private async Task<FamilyDto> MapToFamilyDtoAsync(Family family)
    {
        var members = await _familyMemberRepository.GetByFamilyIdAsync(family.Id);
        
        return new FamilyDto
        {
            Id = family.Id,
            Name = family.Name,
            Description = family.Description,
            CreatedBy = family.CreatedBy,
            CreatedAt = family.CreatedAt,
            UpdatedAt = family.UpdatedAt,
            IsActive = family.IsActive,
            MemberCount = members.Count(),
            Members = members.Select(MapToFamilyMemberDto).ToList()
        };
    }

    private FamilyMemberDto MapToFamilyMemberDto(FamilyMember member)
    {
        return new FamilyMemberDto
        {
            Id = member.Id,
            FamilyId = member.FamilyId,
            UserId = member.UserId,
            Role = member.Role,
            JoinedAt = member.JoinedAt,
            IsActive = member.IsActive,
            Nickname = member.Nickname,
            User = new UserDto
            {
                Id = member.User.Id,
                FirstName = member.User.FirstName,
                LastName = member.User.LastName,
                Email = member.User.Email.Value,
                PhoneNumber = member.User.PhoneNumber,
                DateOfBirth = member.User.DateOfBirth,
                Gender = member.User.Gender,
                FullName = member.User.FullName
            }
        };
    }

    public async Task<ApiResponse<IEnumerable<FamilyMemberDto>>> GetFamilyMembersAsync(Guid userId)
    {
        try
        {
            var family = await _familyRepository.GetByUserIdAsync(userId);
            if (family == null)
            {
                return ApiResponse<IEnumerable<FamilyMemberDto>>.ErrorResult("Bạn chưa tham gia gia đình nào");
            }

            var members = await _familyMemberRepository.GetByFamilyIdAsync(family.Id);
            var memberDtos = members.Select(MapToFamilyMemberDto).ToList();

            return ApiResponse<IEnumerable<FamilyMemberDto>>.SuccessResult(memberDtos, "Lấy danh sách thành viên thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting family members for user {UserId}", userId);
            return ApiResponse<IEnumerable<FamilyMemberDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách thành viên");
        }
    }

    public async Task<ApiResponse<FamilyMemberDto>> UpdateMemberRoleAsync(Guid memberId, UpdateFamilyMemberRoleDto updateDto, Guid userId)
    {
        try
        {
            var member = await _familyMemberRepository.GetByIdAsync(memberId);
            if (member == null)
            {
                return ApiResponse<FamilyMemberDto>.ErrorResult("Không tìm thấy thành viên");
            }

            // Check if user is admin of the family
            if (!await _familyRepository.IsUserAdminAsync(member.FamilyId, userId))
            {
                return ApiResponse<FamilyMemberDto>.ErrorResult("Bạn không có quyền thay đổi vai trò thành viên");
            }

            // Cannot change own role
            if (member.UserId == userId)
            {
                return ApiResponse<FamilyMemberDto>.ErrorResult("Bạn không thể thay đổi vai trò của chính mình");
            }

            // Check if this is the last admin and trying to demote
            if (member.Role == FamilyRole.Admin && updateDto.Role != FamilyRole.Admin)
            {
                if (await _familyMemberRepository.IsLastAdminAsync(member.FamilyId, member.UserId))
                {
                    return ApiResponse<FamilyMemberDto>.ErrorResult("Không thể thay đổi vai trò của quản trị viên cuối cùng");
                }
            }

            member.Role = updateDto.Role;
            member.UpdatedAt = DateTime.UtcNow;

            var updatedMember = await _familyMemberRepository.UpdateAsync(member);
            var memberDto = MapToFamilyMemberDto(updatedMember);

            return ApiResponse<FamilyMemberDto>.SuccessResult(memberDto, "Cập nhật vai trò thành viên thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating member role {MemberId} for user {UserId}", memberId, userId);
            return ApiResponse<FamilyMemberDto>.ErrorResult("Có lỗi xảy ra khi cập nhật vai trò thành viên");
        }
    }

    public async Task<ApiResponse<bool>> RemoveMemberAsync(Guid memberId, Guid userId)
    {
        try
        {
            var member = await _familyMemberRepository.GetByIdAsync(memberId);
            if (member == null)
            {
                return ApiResponse<bool>.ErrorResult("Không tìm thấy thành viên");
            }

            // Check if user is admin of the family
            if (!await _familyRepository.IsUserAdminAsync(member.FamilyId, userId))
            {
                return ApiResponse<bool>.ErrorResult("Bạn không có quyền xóa thành viên");
            }

            // Cannot remove self
            if (member.UserId == userId)
            {
                return ApiResponse<bool>.ErrorResult("Bạn không thể xóa chính mình khỏi gia đình");
            }

            // Check if this is the last admin
            if (member.Role == FamilyRole.Admin && await _familyMemberRepository.IsLastAdminAsync(member.FamilyId, member.UserId))
            {
                return ApiResponse<bool>.ErrorResult("Không thể xóa quản trị viên cuối cùng");
            }

            await _familyMemberRepository.DeleteAsync(memberId);
            return ApiResponse<bool>.SuccessResult(true, "Xóa thành viên thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing member {MemberId} for user {UserId}", memberId, userId);
            return ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi xóa thành viên");
        }
    }

    public async Task<ApiResponse<bool>> LeaveFamilyAsync(Guid userId)
    {
        try
        {
            var family = await _familyRepository.GetByUserIdAsync(userId);
            if (family == null)
            {
                return ApiResponse<bool>.ErrorResult("Bạn chưa tham gia gia đình nào");
            }

            var member = await _familyMemberRepository.GetByFamilyAndUserAsync(family.Id, userId);
            if (member == null)
            {
                return ApiResponse<bool>.ErrorResult("Không tìm thấy thông tin thành viên");
            }

            // Check if this is the last admin
            if (member.Role == FamilyRole.Admin && await _familyMemberRepository.IsLastAdminAsync(family.Id, userId))
            {
                return ApiResponse<bool>.ErrorResult("Bạn là quản trị viên cuối cùng, không thể rời khỏi gia đình");
            }

            await _familyMemberRepository.DeleteAsync(member.Id);
            return ApiResponse<bool>.SuccessResult(true, "Rời khỏi gia đình thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error leaving family for user {UserId}", userId);
            return ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi rời khỏi gia đình");
        }
    }

    public async Task<ApiResponse<IEnumerable<InvitationDto>>> GetFamilyInvitationsAsync(Guid userId)
    {
        try
        {
            var family = await _familyRepository.GetByUserIdAsync(userId);
            if (family == null)
            {
                return ApiResponse<IEnumerable<InvitationDto>>.ErrorResult("Bạn chưa tham gia gia đình nào");
            }

            var invitations = await _invitationRepository.GetByFamilyIdAsync(family.Id);
            var invitationDtos = invitations.Select(MapToInvitationDto).ToList();

            return ApiResponse<IEnumerable<InvitationDto>>.SuccessResult(invitationDtos, "Lấy danh sách lời mời thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting family invitations for user {UserId}", userId);
            return ApiResponse<IEnumerable<InvitationDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách lời mời");
        }
    }

    public async Task<ApiResponse<IEnumerable<InvitationDto>>> GetUserInvitationsAsync(Guid userId)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return ApiResponse<IEnumerable<InvitationDto>>.ErrorResult("Không tìm thấy người dùng");
            }

            var invitations = await _invitationRepository.GetByEmailAsync(user.Email.Value);
            var invitationDtos = invitations.Select(MapToInvitationDto).ToList();

            return ApiResponse<IEnumerable<InvitationDto>>.SuccessResult(invitationDtos, "Lấy danh sách lời mời thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user invitations for user {UserId}", userId);
            return ApiResponse<IEnumerable<InvitationDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách lời mời");
        }
    }

    public async Task<ApiResponse<InvitationDto>> CreateInvitationAsync(CreateInvitationDto createInvitationDto, Guid userId)
    {
        try
        {
            var family = await _familyRepository.GetByUserIdAsync(userId);
            if (family == null)
            {
                return ApiResponse<InvitationDto>.ErrorResult("Bạn chưa tham gia gia đình nào");
            }

            // Check if user is admin
            if (!await _familyRepository.IsUserAdminAsync(family.Id, userId))
            {
                return ApiResponse<InvitationDto>.ErrorResult("Chỉ quản trị viên mới có thể mời thành viên");
            }

            // Check if email is already a member
            var existingUser = await _userRepository.GetByEmailAsync(createInvitationDto.Email);
            if (existingUser != null)
            {
                var existingMember = await _familyMemberRepository.GetByFamilyAndUserAsync(family.Id, existingUser.Id);
                if (existingMember != null)
                {
                    return ApiResponse<InvitationDto>.ErrorResult("Người dùng này đã là thành viên của gia đình");
                }
            }

            // Check if there's already a pending invitation
            var existingInvitation = await _invitationRepository.GetPendingByFamilyAndEmailAsync(family.Id, createInvitationDto.Email);
            if (existingInvitation != null)
            {
                return ApiResponse<InvitationDto>.ErrorResult("Đã có lời mời đang chờ cho email này");
            }

            var invitation = new Invitation
            {
                Id = Guid.NewGuid(),
                FamilyId = family.Id,
                InvitedBy = userId,
                Email = createInvitationDto.Email.Trim().ToLower(),
                Role = createInvitationDto.Role,
                Status = InvitationStatus.Pending,
                ExpiresAt = DateTime.UtcNow.AddDays(7), // 7 days expiry
                Message = createInvitationDto.Message?.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            var createdInvitation = await _invitationRepository.CreateAsync(invitation);
            var invitationDto = MapToInvitationDto(createdInvitation);

            return ApiResponse<InvitationDto>.SuccessResult(invitationDto, "Gửi lời mời thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating invitation for user {UserId}", userId);
            return ApiResponse<InvitationDto>.ErrorResult("Có lỗi xảy ra khi gửi lời mời");
        }
    }

    public async Task<ApiResponse<bool>> AcceptInvitationAsync(Guid invitationId, Guid userId)
    {
        try
        {
            var invitation = await _invitationRepository.GetByIdAsync(invitationId);
            if (invitation == null)
            {
                return ApiResponse<bool>.ErrorResult("Không tìm thấy lời mời");
            }

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null || user.Email.Value.ToLower() != invitation.Email.ToLower())
            {
                return ApiResponse<bool>.ErrorResult("Lời mời không dành cho bạn");
            }

            if (invitation.Status != InvitationStatus.Pending)
            {
                return ApiResponse<bool>.ErrorResult("Lời mời đã được xử lý hoặc đã hết hạn");
            }

            if (invitation.ExpiresAt < DateTime.UtcNow)
            {
                return ApiResponse<bool>.ErrorResult("Lời mời đã hết hạn");
            }

            // Check if user is already in another family
            var existingFamily = await _familyRepository.GetByUserIdAsync(userId);
            if (existingFamily != null)
            {
                return ApiResponse<bool>.ErrorResult("Bạn đã tham gia một gia đình khác");
            }

            // Create family member
            var familyMember = new FamilyMember
            {
                Id = Guid.NewGuid(),
                FamilyId = invitation.FamilyId,
                UserId = userId,
                Role = invitation.Role,
                JoinedAt = DateTime.UtcNow,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            await _familyMemberRepository.CreateAsync(familyMember);

            // Update invitation status
            invitation.Status = InvitationStatus.Accepted;
            invitation.AcceptedAt = DateTime.UtcNow;
            invitation.UpdatedAt = DateTime.UtcNow;
            await _invitationRepository.UpdateAsync(invitation);

            return ApiResponse<bool>.SuccessResult(true, "Chấp nhận lời mời thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error accepting invitation {InvitationId} for user {UserId}", invitationId, userId);
            return ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi chấp nhận lời mời");
        }
    }

    public async Task<ApiResponse<bool>> DeclineInvitationAsync(Guid invitationId, Guid userId)
    {
        try
        {
            var invitation = await _invitationRepository.GetByIdAsync(invitationId);
            if (invitation == null)
            {
                return ApiResponse<bool>.ErrorResult("Không tìm thấy lời mời");
            }

            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null || user.Email.Value.ToLower() != invitation.Email.ToLower())
            {
                return ApiResponse<bool>.ErrorResult("Lời mời không dành cho bạn");
            }

            if (invitation.Status != InvitationStatus.Pending)
            {
                return ApiResponse<bool>.ErrorResult("Lời mời đã được xử lý");
            }

            invitation.Status = InvitationStatus.Declined;
            invitation.DeclinedAt = DateTime.UtcNow;
            invitation.UpdatedAt = DateTime.UtcNow;
            await _invitationRepository.UpdateAsync(invitation);

            return ApiResponse<bool>.SuccessResult(true, "Từ chối lời mời thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error declining invitation {InvitationId} for user {UserId}", invitationId, userId);
            return ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi từ chối lời mời");
        }
    }

    public async Task<ApiResponse<bool>> CancelInvitationAsync(Guid invitationId, Guid userId)
    {
        try
        {
            var invitation = await _invitationRepository.GetByIdAsync(invitationId);
            if (invitation == null)
            {
                return ApiResponse<bool>.ErrorResult("Không tìm thấy lời mời");
            }

            // Check if user is admin of the family or the one who sent the invitation
            if (invitation.InvitedBy != userId && !await _familyRepository.IsUserAdminAsync(invitation.FamilyId, userId))
            {
                return ApiResponse<bool>.ErrorResult("Bạn không có quyền hủy lời mời này");
            }

            if (invitation.Status != InvitationStatus.Pending)
            {
                return ApiResponse<bool>.ErrorResult("Chỉ có thể hủy lời mời đang chờ");
            }

            await _invitationRepository.DeleteAsync(invitationId);
            return ApiResponse<bool>.SuccessResult(true, "Hủy lời mời thành công");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error canceling invitation {InvitationId} for user {UserId}", invitationId, userId);
            return ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi hủy lời mời");
        }
    }

    public async Task<ApiResponse<bool>> CheckUserFamilyPermissionAsync(Guid userId, FamilyRole requiredRole)
    {
        try
        {
            var family = await _familyRepository.GetByUserIdAsync(userId);
            if (family == null)
            {
                return ApiResponse<bool>.ErrorResult("Bạn chưa tham gia gia đình nào");
            }

            var member = await _familyMemberRepository.GetByFamilyAndUserAsync(family.Id, userId);
            if (member == null)
            {
                return ApiResponse<bool>.ErrorResult("Không tìm thấy thông tin thành viên");
            }

            bool hasPermission = requiredRole switch
            {
                FamilyRole.Admin => member.Role == FamilyRole.Admin,
                FamilyRole.Member => member.Role == FamilyRole.Admin || member.Role == FamilyRole.Member,
                FamilyRole.Child => true, // All roles can access child-level permissions
                _ => false
            };

            return ApiResponse<bool>.SuccessResult(hasPermission, hasPermission ? "Có quyền truy cập" : "Không có quyền truy cập");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking family permission for user {UserId}", userId);
            return ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi kiểm tra quyền");
        }
    }

    private InvitationDto MapToInvitationDto(Invitation invitation)
    {
        return new InvitationDto
        {
            Id = invitation.Id,
            FamilyId = invitation.FamilyId,
            InvitedBy = invitation.InvitedBy,
            Email = invitation.Email,
            Role = invitation.Role,
            Status = invitation.Status,
            CreatedAt = invitation.CreatedAt,
            ExpiresAt = invitation.ExpiresAt,
            AcceptedAt = invitation.AcceptedAt,
            DeclinedAt = invitation.DeclinedAt,
            Message = invitation.Message,
            FamilyName = invitation.Family?.Name ?? "",
            InvitedByName = invitation.InvitedByUser?.FullName ?? ""
        };
    }
}
