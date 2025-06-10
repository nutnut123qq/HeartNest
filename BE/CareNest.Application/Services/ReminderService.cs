using CareNest.Application.DTOs.Reminder;
using CareNest.Application.Interfaces;
using CareNest.Domain.Entities;
using CareNest.Domain.Interfaces;

namespace CareNest.Application.Services;

public class ReminderApplicationService : IReminderApplicationService
{
    private readonly IReminderRepository _reminderRepository;
    private readonly IUserRepository _userRepository;

    public ReminderApplicationService(IReminderRepository reminderRepository, IUserRepository userRepository)
    {
        _reminderRepository = reminderRepository;
        _userRepository = userRepository;
    }

    public async Task<ReminderResponse> GetByIdAsync(Guid id, Guid userId)
    {
        var reminder = await _reminderRepository.GetByIdAsync(id);
        if (reminder == null || (reminder.UserId != userId && reminder.AssignedToUserId != userId))
        {
            throw new UnauthorizedAccessException("Không có quyền truy cập nhắc nhở này");
        }

        return MapToResponse(reminder);
    }

    public async Task<IEnumerable<ReminderResponse>> GetByUserIdAsync(Guid userId)
    {
        var reminders = await _reminderRepository.GetByUserIdAsync(userId);
        var assignedReminders = await _reminderRepository.GetAssignedToUserAsync(userId);
        
        var allReminders = reminders.Concat(assignedReminders).Distinct();
        return allReminders.Select(MapToResponse);
    }

    public async Task<IEnumerable<ReminderResponse>> GetUpcomingAsync(Guid userId, int hours = 24)
    {
        var reminders = await _reminderRepository.GetUpcomingAsync(userId, hours);
        return reminders.Select(MapToResponse);
    }

    public async Task<IEnumerable<ReminderResponse>> GetOverdueAsync(Guid userId)
    {
        var reminders = await _reminderRepository.GetOverdueAsync(userId);
        return reminders.Select(MapToResponse);
    }

    public async Task<IEnumerable<ReminderResponse>> GetTodayAsync(Guid userId)
    {
        var reminders = await _reminderRepository.GetTodayAsync(userId);
        return reminders.Select(MapToResponse);
    }

    public async Task<IEnumerable<ReminderResponse>> GetByDateRangeAsync(Guid userId, DateTime startDate, DateTime endDate)
    {
        var reminders = await _reminderRepository.GetByDateRangeAsync(userId, startDate, endDate);
        return reminders.Select(MapToResponse);
    }

    public async Task<IEnumerable<ReminderResponse>> GetByTypeAsync(Guid userId, ReminderType type)
    {
        var reminders = await _reminderRepository.GetByTypeAsync(userId, type);
        return reminders.Select(MapToResponse);
    }

    public async Task<IEnumerable<ReminderResponse>> GetActiveAsync(Guid userId)
    {
        var reminders = await _reminderRepository.GetActiveAsync(userId);
        return reminders.Select(MapToResponse);
    }

    public async Task<IEnumerable<ReminderResponse>> GetCompletedAsync(Guid userId)
    {
        var reminders = await _reminderRepository.GetCompletedAsync(userId);
        return reminders.Select(MapToResponse);
    }

    public async Task<ReminderResponse> CreateAsync(CreateReminderRequest request, Guid userId)
    {
        // Validate assigned user exists if specified
        if (request.AssignedToUserId.HasValue)
        {
            var assignedUser = await _userRepository.GetByIdAsync(request.AssignedToUserId.Value);
            if (assignedUser == null)
            {
                throw new ArgumentException("Người được giao không tồn tại");
            }
        }

        var reminder = new Reminder
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            Type = request.Type,
            ScheduledAt = request.ScheduledAt,
            Frequency = request.Frequency,
            FrequencyInterval = request.FrequencyInterval,
            Priority = request.Priority,
            UserId = userId,
            AssignedToUserId = request.AssignedToUserId,
            EnableNotification = request.EnableNotification,
            NotificationMinutesBefore = request.NotificationMinutesBefore,
            NotificationChannels = request.NotificationChannels,
            RecurrenceEndDate = request.RecurrenceEndDate,
            MaxOccurrences = request.MaxOccurrences,
            RecurrenceDays = request.RecurrenceDays,
            MedicationName = request.MedicationName,
            Dosage = request.Dosage,
            Instructions = request.Instructions,
            DoctorName = request.DoctorName,
            ClinicName = request.ClinicName,
            ClinicAddress = request.ClinicAddress,
            ClinicPhone = request.ClinicPhone,
            ExerciseType = request.ExerciseType,
            DurationMinutes = request.DurationMinutes,
            CustomFieldsJson = request.CustomFieldsJson,
            CreatedAt = DateTime.UtcNow
        };

        var createdReminder = await _reminderRepository.CreateAsync(reminder);
        return MapToResponse(createdReminder);
    }

    public async Task<ReminderResponse> UpdateAsync(Guid id, UpdateReminderRequest request, Guid userId)
    {
        var reminder = await _reminderRepository.GetByIdAsync(id);
        if (reminder == null || reminder.UserId != userId)
        {
            throw new UnauthorizedAccessException("Không có quyền chỉnh sửa nhắc nhở này");
        }

        // Validate assigned user exists if specified
        if (request.AssignedToUserId.HasValue)
        {
            var assignedUser = await _userRepository.GetByIdAsync(request.AssignedToUserId.Value);
            if (assignedUser == null)
            {
                throw new ArgumentException("Người được giao không tồn tại");
            }
        }

        // Update properties
        reminder.Title = request.Title;
        reminder.Description = request.Description;
        reminder.Type = request.Type;
        reminder.ScheduledAt = request.ScheduledAt;
        reminder.Frequency = request.Frequency;
        reminder.FrequencyInterval = request.FrequencyInterval;
        reminder.Priority = request.Priority;
        reminder.AssignedToUserId = request.AssignedToUserId;
        reminder.IsActive = request.IsActive;
        reminder.EnableNotification = request.EnableNotification;
        reminder.NotificationMinutesBefore = request.NotificationMinutesBefore;
        reminder.NotificationChannels = request.NotificationChannels;
        reminder.RecurrenceEndDate = request.RecurrenceEndDate;
        reminder.MaxOccurrences = request.MaxOccurrences;
        reminder.RecurrenceDays = request.RecurrenceDays;
        reminder.MedicationName = request.MedicationName;
        reminder.Dosage = request.Dosage;
        reminder.Instructions = request.Instructions;
        reminder.DoctorName = request.DoctorName;
        reminder.ClinicName = request.ClinicName;
        reminder.ClinicAddress = request.ClinicAddress;
        reminder.ClinicPhone = request.ClinicPhone;
        reminder.ExerciseType = request.ExerciseType;
        reminder.DurationMinutes = request.DurationMinutes;
        reminder.CustomFieldsJson = request.CustomFieldsJson;

        var updatedReminder = await _reminderRepository.UpdateAsync(reminder);
        return MapToResponse(updatedReminder);
    }

    public async Task DeleteAsync(Guid id, Guid userId)
    {
        var reminder = await _reminderRepository.GetByIdAsync(id);
        if (reminder == null || reminder.UserId != userId)
        {
            throw new UnauthorizedAccessException("Không có quyền xóa nhắc nhở này");
        }

        await _reminderRepository.DeleteAsync(id);
    }

    public async Task<ReminderResponse> MarkAsCompletedAsync(Guid id, Guid userId)
    {
        var reminder = await _reminderRepository.GetByIdAsync(id);
        if (reminder == null || (reminder.UserId != userId && reminder.AssignedToUserId != userId))
        {
            throw new UnauthorizedAccessException("Không có quyền cập nhật nhắc nhở này");
        }

        reminder.IsCompleted = true;
        reminder.CompletedAt = DateTime.UtcNow;

        var updatedReminder = await _reminderRepository.UpdateAsync(reminder);
        return MapToResponse(updatedReminder);
    }

    public async Task<ReminderResponse> MarkAsIncompleteAsync(Guid id, Guid userId)
    {
        var reminder = await _reminderRepository.GetByIdAsync(id);
        if (reminder == null || (reminder.UserId != userId && reminder.AssignedToUserId != userId))
        {
            throw new UnauthorizedAccessException("Không có quyền cập nhật nhắc nhở này");
        }

        reminder.IsCompleted = false;
        reminder.CompletedAt = null;

        var updatedReminder = await _reminderRepository.UpdateAsync(reminder);
        return MapToResponse(updatedReminder);
    }

    public async Task<IEnumerable<ReminderResponse>> SearchAsync(Guid userId, string searchTerm)
    {
        var reminders = await _reminderRepository.SearchAsync(userId, searchTerm);
        return reminders.Select(MapToResponse);
    }

    public async Task<ReminderStatsResponse> GetStatsAsync(Guid userId)
    {
        var totalCount = await _reminderRepository.GetCountByUserAsync(userId);
        var completedCount = await _reminderRepository.GetCompletedCountByUserAsync(userId);
        var overdueReminders = await _reminderRepository.GetOverdueAsync(userId);
        var todayReminders = await _reminderRepository.GetTodayAsync(userId);
        var upcomingReminders = await _reminderRepository.GetUpcomingAsync(userId);

        return new ReminderStatsResponse
        {
            TotalReminders = totalCount,
            CompletedReminders = completedCount,
            OverdueReminders = overdueReminders.Count(),
            TodayReminders = todayReminders.Count(),
            UpcomingReminders = upcomingReminders.Count(),
            CompletionRate = totalCount > 0 ? (double)completedCount / totalCount * 100 : 0
        };
    }

    private static ReminderResponse MapToResponse(Reminder reminder)
    {
        return new ReminderResponse
        {
            Id = reminder.Id,
            Title = reminder.Title,
            Description = reminder.Description,
            Type = reminder.Type,
            TypeDisplay = GetTypeDisplay(reminder.Type),
            ScheduledAt = reminder.ScheduledAt,
            Frequency = reminder.Frequency,
            FrequencyDisplay = GetFrequencyDisplay(reminder.Frequency),
            FrequencyInterval = reminder.FrequencyInterval,
            IsCompleted = reminder.IsCompleted,
            CompletedAt = reminder.CompletedAt,
            IsActive = reminder.IsActive,
            Priority = reminder.Priority,
            PriorityDisplay = GetPriorityDisplay(reminder.Priority),
            UserId = reminder.UserId,
            UserName = reminder.User?.FullName ?? "",
            AssignedToUserId = reminder.AssignedToUserId,
            AssignedToUserName = reminder.AssignedToUser?.FullName,
            EnableNotification = reminder.EnableNotification,
            NotificationMinutesBefore = reminder.NotificationMinutesBefore,
            NotificationChannels = reminder.NotificationChannels,
            RecurrenceEndDate = reminder.RecurrenceEndDate,
            MaxOccurrences = reminder.MaxOccurrences,
            RecurrenceDays = reminder.RecurrenceDays,
            MedicationName = reminder.MedicationName,
            Dosage = reminder.Dosage,
            Instructions = reminder.Instructions,
            DoctorName = reminder.DoctorName,
            ClinicName = reminder.ClinicName,
            ClinicAddress = reminder.ClinicAddress,
            ClinicPhone = reminder.ClinicPhone,
            ExerciseType = reminder.ExerciseType,
            DurationMinutes = reminder.DurationMinutes,
            CustomFieldsJson = reminder.CustomFieldsJson,
            CreatedAt = reminder.CreatedAt,
            UpdatedAt = reminder.UpdatedAt
        };
    }

    private static string GetTypeDisplay(ReminderType type)
    {
        return type switch
        {
            ReminderType.Medication => "Thuốc",
            ReminderType.Appointment => "Lịch khám",
            ReminderType.Exercise => "Tập thể dục",
            ReminderType.Checkup => "Kiểm tra sức khỏe",
            ReminderType.Custom => "Tùy chỉnh",
            _ => type.ToString()
        };
    }

    private static string GetFrequencyDisplay(ReminderFrequency frequency)
    {
        return frequency switch
        {
            ReminderFrequency.Once => "Một lần",
            ReminderFrequency.Daily => "Hàng ngày",
            ReminderFrequency.Weekly => "Hàng tuần",
            ReminderFrequency.Monthly => "Hàng tháng",
            ReminderFrequency.Custom => "Tùy chỉnh",
            _ => frequency.ToString()
        };
    }

    private static string GetPriorityDisplay(ReminderPriority priority)
    {
        return priority switch
        {
            ReminderPriority.Low => "Thấp",
            ReminderPriority.Medium => "Trung bình",
            ReminderPriority.High => "Cao",
            ReminderPriority.Critical => "Khẩn cấp",
            _ => priority.ToString()
        };
    }
}
