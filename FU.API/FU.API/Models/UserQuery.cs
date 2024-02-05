namespace FU.API.Models;

public record UserQuery
{
    public List<string> Keywords { get; set; } = new();
    public UserSortType? SortType { get; set; } = null;
    public SortDirection? SortDirection { get; set; } = null;
    public int Limit { get; set; } = 20;
    public int Offset { get; set; } = 0;
}
