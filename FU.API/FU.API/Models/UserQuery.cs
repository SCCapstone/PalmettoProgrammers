namespace FU.API.Models;

public record UserQuery
{
    public List<string> Keywords { get; set; } = new();
    public UserSortType? SortType { get; set; } = null;
    public SortDirection? SortDirection { get; set; } = null;
    public int Limit { get; set; } = 20;
    public int Page { get; set; } = 1;

    // For user related users
    public int? UserId { get; set; } = null;
    public UserRelationStatus? RelationStatus { get; set; } = null;
}
