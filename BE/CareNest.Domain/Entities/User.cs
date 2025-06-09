using CareNest.Domain.Common;
using CareNest.Domain.ValueObjects;

namespace CareNest.Domain.Entities;

public class User : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public Email Email { get; set; } = null!;
    public string PasswordHash { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public bool IsEmailVerified { get; set; } = false;
    public DateTime? LastLoginAt { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties for future features
    // public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    // public virtual ICollection<Medication> Medications { get; set; } = new List<Medication>();

    public string FullName => $"{FirstName} {LastName}".Trim();
}
