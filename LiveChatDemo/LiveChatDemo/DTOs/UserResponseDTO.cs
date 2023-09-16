using LiveChatDemo.Models;

namespace LiveChatDemo.DTOs
{
    public class UserResponseDTO
    {
        public string Username { get; set; }
        public string? SteamId { get; set; }
        public bool SteamIdConfirmed { get; set; }
        public int EntityId { get; set; }

        public static UserResponseDTO FromApplicationUser(ApplicationUser user)
        {
            return new UserResponseDTO
            {
                Username = user.UserName,
                SteamId = user.SteamId,
                SteamIdConfirmed = user.SteamIdConfirmed,
                EntityId = user.EntityId
            };
        }
    }
}
