namespace FU.API.DTOs.User;

using FU.API.Models;

public class UserRelationDTO
{
    public UserProfile User { get; set; } = new UserProfile();

    public string Status { get; set; } = string.Empty;
}
