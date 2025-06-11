using CareNest.Domain.Common;

namespace CareNest.Domain.Entities;

public class Family : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public Guid CreatedBy { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public User Creator { get; set; } = null!;
    public ICollection<FamilyMember> Members { get; set; } = new List<FamilyMember>();
    public ICollection<Invitation> Invitations { get; set; } = new List<Invitation>();
}
