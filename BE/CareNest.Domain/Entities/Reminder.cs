using CareNest.Domain.Common;

namespace CareNest.Domain.Entities;

public class Reminder : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ReminderType Type { get; set; }
    public DateTime ScheduledAt { get; set; }
    public ReminderFrequency Frequency { get; set; }
    public int? FrequencyInterval { get; set; } // For custom frequencies
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAt { get; set; }
    public bool IsActive { get; set; } = true;
    public ReminderPriority Priority { get; set; } = ReminderPriority.Medium;
    
    // Relationships
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid? AssignedToUserId { get; set; }
    public User? AssignedToUser { get; set; }
    
    // Notification settings
    public bool EnableNotification { get; set; } = true;
    public int NotificationMinutesBefore { get; set; } = 15;
    public List<NotificationChannel> NotificationChannels { get; set; } = new();
    
    // Recurrence settings
    public DateTime? RecurrenceEndDate { get; set; }
    public int? MaxOccurrences { get; set; }
    public List<DayOfWeek>? RecurrenceDays { get; set; } // For weekly recurrence
    
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
    
    // Custom fields for extensibility (stored as JSON string)
    public string? CustomFieldsJson { get; set; }
}

public enum ReminderType
{
    Medication = 1,
    Appointment = 2,
    Exercise = 3,
    Checkup = 4,
    Custom = 5
}

public enum ReminderFrequency
{
    Once = 1,
    Daily = 2,
    Weekly = 3,
    Monthly = 4,
    Custom = 5
}

public enum ReminderPriority
{
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4
}

public enum NotificationChannel
{
    Web = 1,
    Email = 2,
    SMS = 3,
    Push = 4
}
