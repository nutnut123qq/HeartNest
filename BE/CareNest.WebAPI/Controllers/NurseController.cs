using CareNest.Application.Common;
using CareNest.Domain.Enums;
using CareNest.Domain.Interfaces;
using CareNest.WebAPI.Attributes;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CareNest.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[RoleAuthorize(UserRole.Nurse)]
public class NurseController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IReminderRepository _reminderRepository;

    public NurseController(IUserRepository userRepository, IReminderRepository reminderRepository)
    {
        _userRepository = userRepository;
        _reminderRepository = reminderRepository;
    }

    /// <summary>
    /// Get nurse dashboard statistics
    /// </summary>
    [HttpGet("dashboard/stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        try
        {
            var nurseId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "");
            
            var assignedReminders = await _reminderRepository.GetRemindersByAssignedUserAsync(nurseId);
            var completedReminders = assignedReminders.Count(r => r.IsCompleted);
            var pendingReminders = assignedReminders.Count(r => !r.IsCompleted);
            var todayReminders = assignedReminders.Count(r => r.ScheduledAt.Date == DateTime.Today);

            var stats = new
            {
                TotalAssignedReminders = assignedReminders.Count(),
                CompletedReminders = completedReminders,
                PendingReminders = pendingReminders,
                TodayReminders = todayReminders
            };

            return Ok(ApiResponse<object>.SuccessResult(stats, "Lấy thống kê thành công"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResult("Có lỗi xảy ra khi lấy thống kê"));
        }
    }

    /// <summary>
    /// Get assigned reminders for nurse
    /// </summary>
    [HttpGet("reminders")]
    public async Task<IActionResult> GetAssignedReminders()
    {
        try
        {
            var nurseId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "");
            var reminders = await _reminderRepository.GetRemindersByAssignedUserAsync(nurseId);
            
            return Ok(ApiResponse<object>.SuccessResult(reminders, "Lấy danh sách nhắc nhở thành công"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResult("Có lỗi xảy ra khi lấy danh sách nhắc nhở"));
        }
    }

    /// <summary>
    /// Get patients assigned to nurse
    /// </summary>
    [HttpGet("patients")]
    public async Task<IActionResult> GetAssignedPatients()
    {
        try
        {
            var nurseId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "");
            
            // Get unique users who have reminders assigned to this nurse
            var reminders = await _reminderRepository.GetRemindersByAssignedUserAsync(nurseId);
            var patientIds = reminders.Select(r => r.UserId).Distinct();
            
            var patients = new List<object>();
            foreach (var patientId in patientIds)
            {
                var patient = await _userRepository.GetByIdAsync(patientId);
                if (patient != null)
                {
                    patients.Add(new
                    {
                        Id = patient.Id,
                        FullName = patient.FullName,
                        Email = patient.Email.Value,
                        PhoneNumber = patient.PhoneNumber,
                        RemindersCount = reminders.Count(r => r.UserId == patientId)
                    });
                }
            }

            return Ok(ApiResponse<object>.SuccessResult(patients, "Lấy danh sách bệnh nhân thành công"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.ErrorResult("Có lỗi xảy ra khi lấy danh sách bệnh nhân"));
        }
    }
}
