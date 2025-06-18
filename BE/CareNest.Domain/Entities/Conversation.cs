using CareNest.Domain.Common;

namespace CareNest.Domain.Entities;

public class Conversation : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid HealthcareProviderId { get; set; }
    public DateTime? LastActivityAt { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual HealthcareProvider HealthcareProvider { get; set; } = null!;
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}


