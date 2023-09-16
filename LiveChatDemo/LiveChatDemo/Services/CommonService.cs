using LiveChatDemo.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace LiveChatDemo.Services
{
    public class CommonService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public CommonService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }
        
        public async Task<ApplicationUser> Authenticate(ClaimsPrincipal userClaims)
        {
            var userId = userClaims.Claims.ToList()[3].Value;
            if (userId == null)
            {
                return null;
            }
            var user = await _userManager.FindByIdAsync(userId);
            return user;
        }
        public static Entity CreateUserEntity() => new() { CreatedAt = DateTime.UtcNow, Type = EntityType.User };
    }
}
