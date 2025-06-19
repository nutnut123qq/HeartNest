using CareNest.Application.Interfaces;
using CareNest.Domain.Entities;
using CareNest.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace CareNest.Application.Jobs;

public class ReminderNotificationJob
{
    private readonly IReminderApplicationService _reminderService;
    private readonly INotificationService _notificationService;
    private readonly ILogger<ReminderNotificationJob> _logger;
    private readonly IUserRepository _userRepository;

    public ReminderNotificationJob(
        IReminderApplicationService reminderService,
        INotificationService notificationService,
        ILogger<ReminderNotificationJob> logger,
        IUserRepository userRepository)
    {
        _reminderService = reminderService;
        _notificationService = notificationService;
        _logger = logger;
        _userRepository = userRepository;
    }

    /// <summary>
    /// Job chạy định kỳ để kiểm tra và gửi thông báo nhắc nhở
    /// </summary>
    public async Task CheckAndSendRemindersAsync()
    {
        try
        {
            _logger.LogInformation("Starting reminder notification check...");

            // Lấy tất cả reminders sắp đến trong 15 phút tới
            var now = DateTime.UtcNow;
            _logger.LogInformation($"Current UTC time: {now}");
            var checkTime = now.AddMinutes(15);

            // Tạm thời dùng method có sẵn để lấy upcoming reminders
            // Trong thực tế nên tạo method riêng để lấy reminders cần notification
            var allUsers = await GetAllActiveUsersAsync();
            _logger.LogInformation($"Found {allUsers.Count} active users to check");

            foreach (var userId in allUsers)
            {
                try
                {
                    var upcomingReminders = await _reminderService.GetUpcomingAsync(userId, 1); // 1 hour window

                    foreach (var reminder in upcomingReminders)
                    {
                        // Kiểm tra xem reminder có cần gửi notification không
                        if (ShouldSendNotification(reminder, now))
                        {
                            var reminderEntity = ConvertToReminderEntity(reminder);
                            await _notificationService.SendReminderNotificationAsync(userId, reminderEntity);
                            _logger.LogInformation($"Sent notification for reminder {reminder.Id} to user {userId}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error processing reminders for user {userId}");
                }
            }

            _logger.LogInformation("Completed reminder notification check");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in CheckAndSendRemindersAsync");
        }
    }

    /// <summary>
    /// Kiểm tra xem có nên gửi notification cho reminder này không
    /// </summary>
    private bool ShouldSendNotification(DTOs.Reminder.ReminderResponse reminder, DateTime now)
    {
        // Chỉ gửi notification nếu:
        // 1. Reminder chưa hoàn thành
        // 2. Notification được bật
        // 3. Có channel Web
        // 4. Đã đến thời gian gửi notification (scheduledAt - notificationMinutesBefore)

        if (reminder.IsCompleted || !reminder.EnableNotification)
            return false;

        if (!reminder.NotificationChannels.Contains(NotificationChannel.Web))
            return false;

        var scheduledTime = reminder.ScheduledAt;
        var notificationTime = scheduledTime.AddMinutes(-reminder.NotificationMinutesBefore);

        // Gửi notification nếu đã đến thời gian và chưa quá 5 phút
        return now >= notificationTime && now <= notificationTime.AddMinutes(5);
    }

    /// <summary>
    /// Convert ReminderResponse DTO to Reminder entity for notification
    /// </summary>
    private Reminder ConvertToReminderEntity(DTOs.Reminder.ReminderResponse reminderDto)
    {
        return new Reminder
        {
            Id = reminderDto.Id,
            Title = reminderDto.Title,
            Description = reminderDto.Description,
            Type = reminderDto.Type,
            MedicationName = reminderDto.MedicationName,
            Dosage = reminderDto.Dosage,
            ScheduledAt = reminderDto.ScheduledAt,
            IsCompleted = reminderDto.IsCompleted,
            EnableNotification = reminderDto.EnableNotification,
            NotificationChannels = reminderDto.NotificationChannels,
            NotificationMinutesBefore = reminderDto.NotificationMinutesBefore,
            UserId = reminderDto.UserId
        };
    }

    /// <summary>
    /// Lấy danh sách tất cả user đang hoạt động có reminders
    /// </summary>
    private async Task<List<Guid>> GetAllActiveUsersAsync()
    {
        try
        {
            // Lấy tất cả user active
            var users = await _userRepository.GetAllActiveAsync();
            var userIds = users.Select(u => u.Id).ToList();

            _logger.LogInformation($"Found {userIds.Count} active users");
            return userIds;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting active users");
            return new List<Guid>();
        }
    }

    /// <summary>
    /// Job để kiểm tra reminders đã quá hạn
    /// </summary>
    public async Task CheckOverdueRemindersAsync()
    {
        try
        {
            _logger.LogInformation("Checking for overdue reminders...");

            var allUsers = await GetAllActiveUsersAsync();

            foreach (var userId in allUsers)
            {
                try
                {
                    var overdueReminders = await _reminderService.GetOverdueAsync(userId);

                    foreach (var reminder in overdueReminders)
                    {
                        // Gửi notification cho reminders quá hạn
                        await _notificationService.SendCustomNotificationAsync(
                            userId,
                            "⚠️ Nhắc nhở quá hạn",
                            $"Bạn đã bỏ lỡ: {reminder.Title}",
                            reminder);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error checking overdue reminders for user {userId}");
                }
            }

            _logger.LogInformation("Completed overdue reminders check");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in CheckOverdueRemindersAsync");
        }
    }
}
