using System.ComponentModel.DataAnnotations;
using CareNest.Domain.Entities;

namespace CareNest.Application.DTOs.Reminder;

public class UpdateReminderRequest
{
    [Required(ErrorMessage = "Tiêu đề là bắt buộc")]
    [StringLength(200, ErrorMessage = "Tiêu đề không được vượt quá 200 ký tự")]
    public string Title { get; set; } = string.Empty;

    [StringLength(1000, ErrorMessage = "Mô tả không được vượt quá 1000 ký tự")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Loại nhắc nhở là bắt buộc")]
    public ReminderType Type { get; set; }

    [Required(ErrorMessage = "Thời gian nhắc nhở là bắt buộc")]
    public DateTime ScheduledAt { get; set; }

    [Required(ErrorMessage = "Tần suất là bắt buộc")]
    public ReminderFrequency Frequency { get; set; }

    public int? FrequencyInterval { get; set; }

    public ReminderPriority Priority { get; set; } = ReminderPriority.Medium;

    public Guid? AssignedToUserId { get; set; }

    public bool IsActive { get; set; } = true;

    // Notification settings
    public bool EnableNotification { get; set; } = true;
    
    [Range(0, 1440, ErrorMessage = "Thời gian thông báo trước phải từ 0 đến 1440 phút")]
    public int NotificationMinutesBefore { get; set; } = 15;
    
    public List<NotificationChannel> NotificationChannels { get; set; } = new();

    // Recurrence settings
    public DateTime? RecurrenceEndDate { get; set; }
    public int? MaxOccurrences { get; set; }
    public List<DayOfWeek>? RecurrenceDays { get; set; }

    // Medication specific fields
    public string? MedicationName { get; set; }
    public string? Dosage { get; set; }
    public string? Instructions { get; set; }

    // Appointment specific fields
    public string? DoctorName { get; set; }
    public string? ClinicName { get; set; }
    public string? ClinicAddress { get; set; }
    public string? ClinicPhone { get; set; }

    // Exercise specific fields
    public string? ExerciseType { get; set; }
    public int? DurationMinutes { get; set; }

    // Custom fields
    public Dictionary<string, object>? CustomFields { get; set; }
}
