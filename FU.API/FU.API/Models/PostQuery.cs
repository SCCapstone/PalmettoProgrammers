namespace FU.API.Models;

public record PostQuery
{
    public List<int> GameIds { get; set; } = new();
    public List<int> TagIds { get; set; } = new();
    public DateOnly? StartAfterDate { get; set; } = null;
    public DateOnly? EndBeforeDate { get; set; } = null;
    public TimeOnly? StartAfterTime { get; set; } = null;
    public TimeOnly? EndBeforeTime { get; set; } = null;
    public int MinimumRequiredPlayers { get; set; } = 0;
    public List<string> Keywords { get; set; } = new();
    public SortOption? SortBy { get; set; } = null;
    public int Limit { get; set; } = 20;
    public int Offset { get; set; } = 0;
}
