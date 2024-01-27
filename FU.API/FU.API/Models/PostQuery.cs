namespace FU.API.Models;

public record PostQuery
{
    public List<int> GameIds { get; set; } = new();
    public List<int> TagIds { get; set; } = new();
    public DateTime? After { get; set; } = null;
    public int MinimumRequiredPlayers { get; set; } = 0;
    public List<string> Keywords { get; set; } = new();
    public SortOption? SortBy { get; set; } = null;
    public int Limit { get; set; } = 20;
    public int Offset { get; set; } = 0;
}
