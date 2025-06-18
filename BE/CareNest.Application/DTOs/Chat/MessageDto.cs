using CareNest.Domain.Entities;

namespace CareNest.Application.DTOs.Chat;

public class MessageDto
{
    public string Id { get; set; } = string.Empty; // Frontend expects string
    public string ConversationId { get; set; } = string.Empty; // Frontend expects string
    public Guid SenderId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string? SenderAvatar { get; set; }
    public string Content { get; set; } = string.Empty;
    public string Type { get; set; } = "text"; // Frontend expects string
    public DateTime CreatedAt { get; set; }

    // File attachments
    public string? FileName { get; set; }
    public string? FileUrl { get; set; }
    public string? FileType { get; set; }
    public long? FileSize { get; set; }

    // Voice message
    public int? DurationSeconds { get; set; }

    // Read status
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
}

public class CreateMessageDto
{
    public Guid ConversationId { get; set; }
    public string Content { get; set; } = string.Empty;
    public MessageType Type { get; set; } = MessageType.Text;

    // For file messages
    public string? FileName { get; set; }
    public string? FileUrl { get; set; }
    public string? FileType { get; set; }
    public long? FileSize { get; set; }

    // For voice messages
    public int? DurationSeconds { get; set; }
}


