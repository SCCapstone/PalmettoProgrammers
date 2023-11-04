using Microsoft.AspNetCore.Identity;

namespace FU.API.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string PfpUrl { get; set; } = "https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png";
        public bool IsOnline { get; set; }
        public bool IsAdmin { get; set; }
        public string? Bio { get; set; }
        public DateOnly? DOB { get; set; }
        public ICollection<GameRelation> FavoriteGames { get; set; }
        public ICollection<TagRelation> FavoriteTags { get; set; }
        public ICollection<GroupMembership> Groups { get; set; }
        public ICollection<ChatMembership> Chats { get; set; }
    }

    /// <summary>
    /// Make user1 the one who sent the request
    /// </summary>
    public class UserRelation
    {
        public int Id { get; set; }
        public ApplicationUser User1 { get; set; }
        public string User1Id { get; set; }
        public ApplicationUser User2 { get; set; }
        public string User2Id { get; set; }
        public UserRelationStatus Status { get; set; }
    }

    public enum UserRelationStatus
    {
        Pending,
        Friends,
        Blocked
    }
}
