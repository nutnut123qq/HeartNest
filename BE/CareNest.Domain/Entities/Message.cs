using CareNest.Domain.Common;

namespace CareNest.Domain.Entities;

public class Message : BaseEntity
{
    public Guid ConversationId { get; set; }
    public Conversation Conversation { get; set; } = null!;
    
    public Guid SenderId { get; set; }
    public User Sender { get; set; } = null!;
    
    public string Content { get; set; } = string.Empty;
    public MessageType Type { get; set; } = MessageType.Text;
    
    // File/Media properties
    public string? FileName { get; set; }
    public string? FileUrl { get; set; }
    public string? FileType { get; set; }
    public long? FileSize { get; set; }
    
    // Voice message properties
    public int? DurationSeconds { get; set; }
    
    // Message status
    public bool IsRead { get; set; } = false;
    public DateTime? ReadAt { get; set; }
}

public enum MessageType
{
    Text = 1,
    Image = 2,
    File = 3,
    Voice = 4,
    System = 5,
    Prescription = 6,
    Appointment = 7
}
