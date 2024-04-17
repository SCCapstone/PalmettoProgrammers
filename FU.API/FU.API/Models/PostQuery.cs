namespace FU.API.Models;

public record PostQuery
{
    public List<int> GameIds { get; set; } = new();
    public List<int> TagIds { get; set; } = new();
    public DateTime? StartOnOrAfterDateTime { get; set; } = null;
    public DateTime? EndOnOrBeforeDateTime { get; set; } = null;
    public TimeOnly? StartOnOrAfterTime { get; set; } = null;
    public TimeOnly? EndOnOrBeforeTime { get; set; } = null;
    public int MinimumRequiredPlayers { get; set; } = 0;
    public List<string> Keywords { get; set; } = new();
    public SortDirection? SortDirection { get; set; } = null;
    public PostSortType? SortType { get; set; } = null;
    public int Limit { get; set; } = 20;
    public int Page { get; set; } = 1;

    // For user related posts
    public int? UserId { get; set; } = null;
}
