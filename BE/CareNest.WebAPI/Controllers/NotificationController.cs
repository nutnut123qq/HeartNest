using CareNest.Application.Common;
using CareNest.Application.DTOs.Notification;
using CareNest.Application.Services;
using CareNest.Domain.Interfaces;
using CareNest.WebAPI.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CareNest.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CareNest.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;
    private readonly NotificationService _notificationServiceImpl;
    private readonly ILogger<NotificationController> _logger;
    private readonly CareNestDbContext _context;

    public NotificationController(
        INotificationService notificationService,
        NotificationService notificationServiceImpl,
        ILogger<NotificationController> logger,
        CareNestDbContext context)
    {
        _notificationService = notificationService;
        _notificationServiceImpl = notificationServiceImpl;
        _logger = logger;
        _context = context;
    }

    /// <summary>
    /// Lấy danh sách notifications của user
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<NotificationDto>>>> GetNotifications([FromQuery] int limit = 20)
    {
        try
        {
            var userId = GetCurrentUserId();
            var notifications = _notificationServiceImpl.GetUserNotifications(userId, limit);

            return Ok(ApiResponse<List<NotificationDto>>.SuccessResult(notifications, "Lấy thông báo thành công"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting notifications");
            return BadRequest(ApiResponse<List<NotificationDto>>.ErrorResult("Có lỗi xảy ra khi lấy thông báo"));
        }
    }

    /// <summary>
    /// Lấy số lượng notifications chưa đọc
    /// </summary>
    [HttpGet("unread-count")]
    public async Task<ActionResult<ApiResponse<int>>> GetUnreadCount()
    {
        try
        {
            var userId = GetCurrentUserId();
            var count = await _notificationService.GetUnreadCountAsync(userId);

            return Ok(ApiResponse<int>.SuccessResult(count, "Lấy số thông báo chưa đọc thành công"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting unread count");
            return BadRequest(ApiResponse<int>.ErrorResult("Có lỗi xảy ra khi lấy số thông báo chưa đọc"));
        }
    }

    /// <summary>
    /// Đánh dấu notification đã đọc
    /// </summary>
    [HttpPost("{notificationId}/mark-read")]
    public async Task<ActionResult<ApiResponse<bool>>> MarkAsRead(Guid notificationId)
    {
        try
        {
            var userId = GetCurrentUserId();
            await _notificationService.MarkNotificationAsReadAsync(userId, notificationId);

            return Ok(ApiResponse<bool>.SuccessResult(true, "Đánh dấu đã đọc thành công"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking notification as read");
            return BadRequest(ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi đánh dấu đã đọc"));
        }
    }

    /// <summary>
    /// Đánh dấu tất cả notifications đã đọc
    /// </summary>
    [HttpPost("mark-all-read")]
    public async Task<ActionResult<ApiResponse<bool>>> MarkAllAsRead()
    {
        try
        {
            var userId = GetCurrentUserId();
            await _notificationService.MarkAllNotificationsAsReadAsync(userId);

            return Ok(ApiResponse<bool>.SuccessResult(true, "Đánh dấu tất cả đã đọc thành công"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking all notifications as read");
            return BadRequest(ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi đánh dấu tất cả đã đọc"));
        }
    }

    /// <summary>
    /// Gửi test notification (for admin testing)
    /// </summary>
    [HttpPost("test")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<bool>>> SendTestNotification([FromBody] CreateNotificationRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            await _notificationService.SendCustomNotificationAsync(
                userId,
                request.Title,
                request.Message,
                request.Data);

            return Ok(ApiResponse<bool>.SuccessResult(true, "Gửi test notification thành công"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending test notification");
            return BadRequest(ApiResponse<bool>.ErrorResult("Có lỗi xảy ra khi gửi test notification"));
        }
    }

    /// <summary>
    /// Debug endpoint để kiểm tra user hiện tại (for admin debugging)
    /// </summary>
    [HttpGet("debug/user")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<object>>> DebugCurrentUser()
    {
        try
        {
            var userId = GetCurrentUserId();

            // Get user info from database to verify it exists
            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            var userInfo = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new { u.Id, u.Email, u.FirstName, u.LastName, u.IsDeleted, u.IsActive })
                .FirstOrDefaultAsync();

            return Ok(ApiResponse<object>.SuccessResult(new {
                userId = userId,
                userExists = userExists,
                userInfo = userInfo
            }, "Debug info retrieved"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResult(ex.Message));
        }
    }

    private Guid GetCurrentUserId()
    {
        try
        {
            return User.GetUserId();
        }
        catch (UnauthorizedAccessException)
        {
            throw new UnauthorizedAccessException("User not authenticated");
        }
    }
}
