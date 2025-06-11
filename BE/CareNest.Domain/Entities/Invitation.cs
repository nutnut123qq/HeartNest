using CareNest.Domain.Common;
using CareNest.Domain.Enums;

namespace CareNest.Domain.Entities;

public class Invitation : BaseEntity
{
    public Guid FamilyId { get; set; }
    public Guid InvitedBy { get; set; }
    public string Email { get; set; } = string.Empty;
    public FamilyRole Role { get; set; } = FamilyRole.Member;
    public InvitationStatus Status { get; set; } = InvitationStatus.Pending;
    public DateTime ExpiresAt { get; set; }
    public DateTime? AcceptedAt { get; set; }
    public DateTime? DeclinedAt { get; set; }
    public string? Message { get; set; }

    // Navigation properties
    public Family Family { get; set; } = null!;
    public User InvitedByUser { get; set; } = null!;
}
