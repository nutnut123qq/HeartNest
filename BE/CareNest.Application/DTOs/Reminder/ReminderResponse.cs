using CareNest.Domain.Entities;

namespace CareNest.Application.DTOs.Reminder;

public class ReminderResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ReminderType Type { get; set; }
    public string TypeDisplay { get; set; } = string.Empty;
    public DateTime ScheduledAt { get; set; }
    public ReminderFrequency Frequency { get; set; }
    public string FrequencyDisplay { get; set; } = string.Empty;
    public int? FrequencyInterval { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
    public bool IsActive { get; set; }
    public ReminderPriority Priority { get; set; }
    public string PriorityDisplay { get; set; } = string.Empty;
    
    // User information
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public Guid? AssignedToUserId { get; set; }
    public string? AssignedToUserName { get; set; }
    
    // Notification settings
    public bool EnableNotification { get; set; }
    public int NotificationMinutesBefore { get; set; }
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
    
    // Timestamps
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Computed properties
    public bool IsOverdue => !IsCompleted && ScheduledAt < DateTime.UtcNow;
    public bool IsUpcoming => !IsCompleted && ScheduledAt > DateTime.UtcNow && ScheduledAt <= DateTime.UtcNow.AddHours(24);
    public bool IsToday => !IsCompleted && ScheduledAt.Date == DateTime.UtcNow.Date;
    
    public TimeSpan? TimeUntilDue => IsCompleted ? null : ScheduledAt - DateTime.UtcNow;
    public string TimeUntilDueDisplay
    {
        get
        {
            if (IsCompleted) return "Đã hoàn thành";
            if (IsOverdue) return "Quá hạn";
            
            var timeUntil = TimeUntilDue;
            if (timeUntil == null) return "";
            
            if (timeUntil.Value.TotalDays >= 1)
                return $"Còn {(int)timeUntil.Value.TotalDays} ngày";
            if (timeUntil.Value.TotalHours >= 1)
                return $"Còn {(int)timeUntil.Value.TotalHours} giờ";
            if (timeUntil.Value.TotalMinutes >= 1)
                return $"Còn {(int)timeUntil.Value.TotalMinutes} phút";
            
            return "Sắp đến giờ";
        }
    }
}
