using CareNest.Application.Common;
using CareNest.Application.DTOs.Reminder;
using CareNest.Application.Interfaces;
using CareNest.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CareNest.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReminderController : ControllerBase
{
    private readonly IReminderApplicationService _reminderService;

    public ReminderController(IReminderApplicationService reminderService)
    {
        _reminderService = reminderService;
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user ID");
        }
        return userId;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ReminderResponse>>>> GetReminders()
    {
        try
        {
            var userId = GetCurrentUserId();
            var reminders = await _reminderService.GetByUserIdAsync(userId);
            return Ok(ApiResponse<IEnumerable<ReminderResponse>>.SuccessResult(reminders, "Lấy danh sách nhắc nhở thành công"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<IEnumerable<ReminderResponse>>.ErrorResult(ex.Message));
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<ReminderResponse>>> GetReminder(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var reminder = await _reminderService.GetByIdAsync(id, userId);
            return Ok(ApiResponse<ReminderResponse>.SuccessResult(reminder, "Lấy thông tin nhắc nhở thành công"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<ReminderResponse>.ErrorResult(ex.Message));
        }
    }

    [HttpGet("upcoming")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ReminderResponse>>>> GetUpcomingReminders([FromQuery] int hours = 24)
    {
        try
        {
            var userId = GetCurrentUserId();
            var reminders = await _reminderService.GetUpcomingAsync(userId, hours);
            return Ok(ApiResponse<IEnumerable<ReminderResponse>>.SuccessResult(reminders, "Lấy nhắc nhở sắp tới thành công"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<IEnumerable<ReminderResponse>>.ErrorResult(ex.Message));
        }
    }

    [HttpGet("overdue")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ReminderResponse>>>> GetOverdueReminders()
    {
        try
        {
            var userId = GetCurrentUserId();
            var reminders = await _reminderService.GetOverdueAsync(userId);
            return Ok(ApiResponse<IEnumerable<ReminderResponse>>.SuccessResult(reminders, "Lấy nhắc nhở quá hạn thành công"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<IEnumerable<ReminderResponse>>.ErrorResult(ex.Message));
        }
    }

    [HttpGet("today")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ReminderResponse>>>> GetTodayReminders()
    {
        try
        {
            var userId = GetCurrentUserId();
            var reminders = await _reminderService.GetTodayAsync(userId);
            return Ok(ApiResponse<IEnumerable<ReminderResponse>>.SuccessResult(reminders, "Lấy nhắc nhở hôm nay thành công"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<IEnumerable<ReminderResponse>>.ErrorResult(ex.Message));
        }
    }

    [HttpGet("active")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ReminderResponse>>>> GetActiveReminders()
    {
        try
        {
            var userId = GetCurrentUserId();
            var reminders = await _reminderService.GetActiveAsync(userId);
            return Ok(ApiResponse<IEnumerable<ReminderResponse>>.SuccessResult(reminders, "Lấy nhắc nhở đang hoạt động thành công"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<IEnumerable<ReminderResponse>>.ErrorResult(ex.Message));
        }
    }

    [HttpGet("completed")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ReminderResponse>>>> GetCompletedReminders()
    {
        try
        {
            var userId = GetCurrentUserId();
            var reminders = await _reminderService.GetCompletedAsync(userId);
            return Ok(ApiResponse<IEnumerable<ReminderResponse>>.SuccessResult(reminders, "Lấy nhắc nhở đã hoàn thành thành công"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<IEnumerable<ReminderResponse>>.ErrorResult(ex.Message));
        }
    }

    [HttpGet("search")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ReminderResponse>>>> SearchReminders([FromQuery] string searchTerm)
    {
        try
        {
            var userId = GetCurrentUserId();
            var reminders = await _reminderService.SearchAsync(userId, searchTerm);
            return Ok(ApiResponse<IEnumerable<ReminderResponse>>.SuccessResult(reminders, "Tìm kiếm nhắc nhở thành công"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<IEnumerable<ReminderResponse>>.ErrorResult(ex.Message));
        }
    }

    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<ReminderStatsResponse>>> GetReminderStats()
    {
        try
        {
            var userId = GetCurrentUserId();
            var stats = await _reminderService.GetStatsAsync(userId);
            return Ok(ApiResponse<ReminderStatsResponse>.SuccessResult(stats, "Lấy thống kê nhắc nhở thành công"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<ReminderStatsResponse>.ErrorResult(ex.Message));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<ReminderResponse>>> CreateReminder([FromBody] CreateReminderRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            var reminder = await _reminderService.CreateAsync(request, userId);
            return CreatedAtAction(nameof(GetReminder), new { id = reminder.Id }, 
                ApiResponse<ReminderResponse>.SuccessResult(reminder, "Tạo nhắc nhở thành công"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<ReminderResponse>.ErrorResult(ex.Message));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<ReminderResponse>.ErrorResult(ex.Message));
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<ReminderResponse>>> UpdateReminder(Guid id, [FromBody] UpdateReminderRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            var reminder = await _reminderService.UpdateAsync(id, request, userId);
            return Ok(ApiResponse<ReminderResponse>.SuccessResult(reminder, "Cập nhật nhắc nhở thành công"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<ReminderResponse>.ErrorResult(ex.Message));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<ReminderResponse>.ErrorResult(ex.Message));
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteReminder(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            await _reminderService.DeleteAsync(id, userId);
            return Ok(ApiResponse<object>.SuccessResult(null, "Xóa nhắc nhở thành công"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResult(ex.Message));
        }
    }

    [HttpPost("{id}/complete")]
    public async Task<ActionResult<ApiResponse<ReminderResponse>>> MarkAsCompleted(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var reminder = await _reminderService.MarkAsCompletedAsync(id, userId);
            return Ok(ApiResponse<ReminderResponse>.SuccessResult(reminder, "Đánh dấu hoàn thành nhắc nhở thành công"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<ReminderResponse>.ErrorResult(ex.Message));
        }
    }

    [HttpPost("{id}/incomplete")]
    public async Task<ActionResult<ApiResponse<ReminderResponse>>> MarkAsIncomplete(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var reminder = await _reminderService.MarkAsIncompleteAsync(id, userId);
            return Ok(ApiResponse<ReminderResponse>.SuccessResult(reminder, "Đánh dấu chưa hoàn thành nhắc nhở thành công"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<ReminderResponse>.ErrorResult(ex.Message));
        }
    }
}
