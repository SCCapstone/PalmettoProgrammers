using LiveChatDemo.Models;

namespace LiveChatDemo.Services
{
    public class CommonService
    {
        public static Entity CreateUserEntity() => new() { CreatedAt = DateTime.UtcNow, Type = EntityType.User };
    }
}
