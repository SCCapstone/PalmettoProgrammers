using Microsoft.AspNetCore.Identity;

namespace LiveChatDemo.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? SteamId { get; set; }
        public bool SteamIdConfirmed { get; set; } = false;

        // Navigation Properties
        public int EntityId { get; set; }
        public Entity Entity { get; set; }
    }
}
