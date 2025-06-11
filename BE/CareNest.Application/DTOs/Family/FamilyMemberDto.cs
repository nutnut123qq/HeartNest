using CareNest.Domain.Enums;

namespace CareNest.Application.DTOs.Family;

public class FamilyMemberDto
{
    public Guid Id { get; set; }
    public Guid FamilyId { get; set; }
    public Guid UserId { get; set; }
    public FamilyRole Role { get; set; }
    public DateTime JoinedAt { get; set; }
    public bool IsActive { get; set; }
    public string? Nickname { get; set; }
    public UserDto User { get; set; } = new();
}

public class UserDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? Avatar { get; set; }
}

public class UpdateFamilyMemberRoleDto
{
    public FamilyRole Role { get; set; }
}

public class UpdateFamilyMemberDto
{
    public FamilyRole Role { get; set; }
    public string? Nickname { get; set; }
}
