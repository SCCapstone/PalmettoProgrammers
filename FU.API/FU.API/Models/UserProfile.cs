namespace FU.API.Models;

public record UserProfile
{
    public int Id { get; set; }
    public string PfpUrl { get; set; } = "https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png";
    public bool IsOnline { get; set; }
    public string? Bio { get; set; }
    public DateOnly? DOB { get; set; }
    public string Username { get; set; } = string.Empty;
    public ICollection<GameRelation> FavoriteGames { get; set; } = new HashSet<GameRelation>();
    public ICollection<TagRelation> FavoriteTags { get; set; } = new HashSet<TagRelation>();
}