using CareNest.Application.Common;
using CareNest.Domain.Enums;
using CareNest.Domain.Interfaces;
using CareNest.WebAPI.Attributes;
using Microsoft.AspNetCore.Mvc;

namespace CareNest.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[RoleAuthorize(UserRole.Admin)]
public class AdminController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IReminderRepository _reminderRepository;

    public AdminController(IUserRepository userRepository, IReminderRepository reminderRepository)
    {
        _userRepository = userRepository;
        _reminderRepository = reminderRepository;
    }

    /// <summary>
    /// Get admin dashboard statistics
    /// </summary>
    [HttpGet("dashboard/stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        try
        {
            var totalUsers = await _userRepository.GetTotalUsersAsync();
            var totalNurses = await _userRepository.GetUsersByRoleCountAsync(UserRole.Nurse);
            var totalReminders = await _reminderRepository.GetTotalRemindersAsync();
            var activeReminders = await _reminderRepository.GetActiveRemindersCountAsync();

            var stats = new
            {
                TotalUsers = totalUsers,
                TotalNurses = totalNurses,
                TotalReminders = totalReminders,
                ActiveReminders = activeReminders,
                InactiveReminders = totalReminders - activeReminders
            };

            return Ok(ApiResponse<object>.SuccessResult(stats, "Lấy thống kê thành công"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResult("Có lỗi xảy ra khi lấy thống kê"));
        }
    }

    /// <summary>
    /// Get all users with pagination
    /// </summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var users = await _userRepository.GetUsersWithPaginationAsync(page, pageSize);
            return Ok(ApiResponse<object>.SuccessResult(users, "Lấy danh sách người dùng thành công"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResult("Có lỗi xảy ra khi lấy danh sách người dùng"));
        }
    }

    /// <summary>
    /// Get users by role
    /// </summary>
    [HttpGet("users/role/{role}")]
    public async Task<IActionResult> GetUsersByRole(UserRole role)
    {
        try
        {
            var users = await _userRepository.GetUsersByRoleAsync(role);
            return Ok(ApiResponse<object>.SuccessResult(users, $"Lấy danh sách {role} thành công"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResult($"Có lỗi xảy ra khi lấy danh sách {role}"));
        }
    }
}
