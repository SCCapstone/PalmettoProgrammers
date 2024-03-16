namespace FU.API.DTOs.User;

public record UserProfileChangesDTO
{
    public int Id { get; set; }
    public Guid? AvatarId { get; set; }
    public string? Bio { get; set; }
    public DateOnly? DOB { get; set; }
    public bool? IsOnline { get; set; }
}
