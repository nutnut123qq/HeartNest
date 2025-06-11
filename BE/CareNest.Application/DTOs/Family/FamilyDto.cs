namespace CareNest.Application.DTOs.Family;

public class FamilyDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; }
    public int MemberCount { get; set; }
    public List<FamilyMemberDto> Members { get; set; } = new();
}

public class CreateFamilyDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public class UpdateFamilyDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}
