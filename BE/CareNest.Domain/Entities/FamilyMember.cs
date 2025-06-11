using CareNest.Domain.Common;
using CareNest.Domain.Enums;

namespace CareNest.Domain.Entities;

public class FamilyMember : BaseEntity
{
    public Guid FamilyId { get; set; }
    public Guid UserId { get; set; }
    public FamilyRole Role { get; set; } = FamilyRole.Member;
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public string? Nickname { get; set; }

    // Navigation properties
    public Family Family { get; set; } = null!;
    public User User { get; set; } = null!;
}
