namespace FU.API.Models;

// Some Propertie are nullable to allow partial updating
public record UserProfile
{
    public int Id { get; set; }
    public string? PfpUrl { get; set; }
    public bool? IsOnline { get; set; }
    public string? Bio { get; set; }
    public DateOnly? DOB { get; set; }
    public string? Username { get; set; } = string.Empty;
    public ICollection<Game> FavoriteGames { get; set; } = new HashSet<Game>();
    public ICollection<Tag> FavoriteTags { get; set; } = new HashSet<Tag>();
}