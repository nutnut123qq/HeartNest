using CareNest.Application.Common;
using CareNest.Application.DTOs.Family;
using CareNest.Application.Interfaces;
using CareNest.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CareNest.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FamilyController : ControllerBase
{
    private readonly IFamilyService _familyService;
    private readonly ILogger<FamilyController> _logger;

    public FamilyController(IFamilyService familyService, ILogger<FamilyController> logger)
    {
        _familyService = familyService;
        _logger = logger;
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user ID in token");
        }
        return userId;
    }

    /// <summary>
    /// Lấy thông tin gia đình của người dùng hiện tại
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<FamilyDto>>> GetMyFamily()
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _familyService.GetFamilyByUserAsync(userId);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting family for user");
            return StatusCode(500, ApiResponse<FamilyDto>.ErrorResult("Có lỗi xảy ra khi lấy thông tin gia đình"));
        }
    }

    /// <summary>
    /// Lấy thông tin gia đình theo ID
    /// </summary>
    [HttpGet("{familyId}")]
    public async Task<ActionResult<ApiResponse<FamilyDto>>> GetFamily(Guid familyId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _familyService.GetFamilyByIdAsync(familyId, userId);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting family {FamilyId}", familyId);
            return StatusCode(500, ApiResponse<FamilyDto>.ErrorResult("Có lỗi xảy ra khi lấy thông tin gia đình"));
        }
    }

    /// <summary>
    /// Tạo gia đình mới
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<FamilyDto>>> CreateFamily([FromBody] CreateFamilyDto createFamilyDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _familyService.CreateFamilyAsync(createFamilyDto, userId);
            
            if (result.Success)
            {
                return CreatedAtAction(nameof(GetFamily), new { familyId = result.Data.Id }, result);
            }
            
            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating family");
            return StatusCode(500, ApiResponse<FamilyDto>.ErrorResult("Có lỗi xảy ra khi tạo gia đình"));
        }
    }

    /// <summary>
    /// Cập nhật thông tin gia đình
    /// </summary>
    [HttpPut("{familyId}")]
    public async Task<ActionResult<ApiResponse<FamilyDto>>> UpdateFamily(Guid familyId, [FromBody] UpdateFamilyDto updateFamilyDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _familyService.UpdateFamilyAsync(familyId, updateFamilyDto, userId);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating family {FamilyId}", familyId);
            return StatusCode(500, ApiResponse<FamilyDto>.ErrorResult("Có lỗi xảy ra khi cập nhật gia đình"));
        }
    }

    /// <summary>
    /// Xóa gia đình
    /// </summary>
    [HttpDelete("{familyId}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteFamily(Guid familyId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _familyService.DeleteFamilyAsync(familyId, userId);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting family {FamilyId}", familyId);
            return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi xóa gia đình"));
        }
    }

    /// <summary>
    /// Lấy danh sách thành viên gia đình
    /// </summary>
    [HttpGet("members")]
    public async Task<ActionResult<ApiResponse<IEnumerable<FamilyMemberDto>>>> GetFamilyMembers()
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _familyService.GetFamilyMembersAsync(userId);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting family members");
            return StatusCode(500, ApiResponse<IEnumerable<FamilyMemberDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách thành viên"));
        }
    }

    /// <summary>
    /// Cập nhật vai trò thành viên
    /// </summary>
    [HttpPut("members/{memberId}")]
    public async Task<ActionResult<ApiResponse<FamilyMemberDto>>> UpdateMemberRole(Guid memberId, [FromBody] UpdateFamilyMemberRoleDto updateDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _familyService.UpdateMemberRoleAsync(memberId, updateDto, userId);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating member role {MemberId}", memberId);
            return StatusCode(500, ApiResponse<FamilyMemberDto>.ErrorResult("Có lỗi xảy ra khi cập nhật vai trò thành viên"));
        }
    }

    /// <summary>
    /// Xóa thành viên khỏi gia đình
    /// </summary>
    [HttpDelete("members/{memberId}")]
    public async Task<ActionResult<ApiResponse<bool>>> RemoveMember(Guid memberId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _familyService.RemoveMemberAsync(memberId, userId);
            
            if (result.Success)
            {
                return Ok(result);
            }
            
            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing member {MemberId}", memberId);
            return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi xóa thành viên"));
        }
    }

    /// <summary>
    /// Rời khỏi gia đình
    /// </summary>
    [HttpPost("leave")]
    public async Task<ActionResult<ApiResponse<bool>>> LeaveFamily()
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _familyService.LeaveFamilyAsync(userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error leaving family");
            return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi rời khỏi gia đình"));
        }
    }

    /// <summary>
    /// Lấy danh sách lời mời của gia đình
    /// </summary>
    [HttpGet("invitations")]
    public async Task<ActionResult<ApiResponse<IEnumerable<InvitationDto>>>> GetFamilyInvitations()
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _familyService.GetFamilyInvitationsAsync(userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting family invitations");
            return StatusCode(500, ApiResponse<IEnumerable<InvitationDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách lời mời"));
        }
    }

    /// <summary>
    /// Lấy danh sách lời mời của người dùng
    /// </summary>
    [HttpGet("my-invitations")]
    public async Task<ActionResult<ApiResponse<IEnumerable<InvitationDto>>>> GetMyInvitations()
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _familyService.GetUserInvitationsAsync(userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user invitations");
            return StatusCode(500, ApiResponse<IEnumerable<InvitationDto>>.ErrorResult("Có lỗi xảy ra khi lấy danh sách lời mời"));
        }
    }

    /// <summary>
    /// Gửi lời mời tham gia gia đình
    /// </summary>
    [HttpPost("invite")]
    public async Task<ActionResult<ApiResponse<InvitationDto>>> CreateInvitation([FromBody] CreateInvitationDto createInvitationDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _familyService.CreateInvitationAsync(createInvitationDto, userId);

            if (result.Success)
            {
                return CreatedAtAction(nameof(GetFamilyInvitations), result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating invitation");
            return StatusCode(500, ApiResponse<InvitationDto>.ErrorResult("Có lỗi xảy ra khi gửi lời mời"));
        }
    }

    /// <summary>
    /// Chấp nhận lời mời tham gia gia đình
    /// </summary>
    [HttpPost("invitations/{invitationId}/accept")]
    public async Task<ActionResult<ApiResponse<bool>>> AcceptInvitation(Guid invitationId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _familyService.AcceptInvitationAsync(invitationId, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error accepting invitation {InvitationId}", invitationId);
            return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi chấp nhận lời mời"));
        }
    }

    /// <summary>
    /// Từ chối lời mời tham gia gia đình
    /// </summary>
    [HttpPost("invitations/{invitationId}/decline")]
    public async Task<ActionResult<ApiResponse<bool>>> DeclineInvitation(Guid invitationId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _familyService.DeclineInvitationAsync(invitationId, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error declining invitation {InvitationId}", invitationId);
            return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi từ chối lời mời"));
        }
    }

    /// <summary>
    /// Hủy lời mời đã gửi
    /// </summary>
    [HttpDelete("invitations/{invitationId}")]
    public async Task<ActionResult<ApiResponse<bool>>> CancelInvitation(Guid invitationId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var result = await _familyService.CancelInvitationAsync(invitationId, userId);

            if (result.Success)
            {
                return Ok(result);
            }

            return BadRequest(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error canceling invitation {InvitationId}", invitationId);
            return StatusCode(500, ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi hủy lời mời"));
        }
    }
}
