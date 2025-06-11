using CareNest.Domain.Enums;

namespace CareNest.Application.DTOs.Family;

public class InvitationDto
{
    public Guid Id { get; set; }
    public Guid FamilyId { get; set; }
    public Guid InvitedBy { get; set; }
    public string Email { get; set; } = string.Empty;
    public FamilyRole Role { get; set; }
    public InvitationStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? AcceptedAt { get; set; }
    public DateTime? DeclinedAt { get; set; }
    public string? Message { get; set; }
    public string FamilyName { get; set; } = string.Empty;
    public string InvitedByName { get; set; } = string.Empty;
}

public class CreateInvitationDto
{
    public string Email { get; set; } = string.Empty;
    public FamilyRole Role { get; set; } = FamilyRole.Member;
    public string? Message { get; set; }
}

public class InvitationResponseDto
{
    public bool Accept { get; set; }
    public string? Message { get; set; }
}
