namespace FU.API.Models;

public record SortOption
{
    public SortDirection Direction { get; set; }
    public SortType Type { get; set; }
}

// Can't inherit so easiest method is to add all sort types to one enum
public enum SortType
{
    EarliestToScheduledTime,
    NewestCreated,
    NumberOfPlayers,
    Title,
}

public enum SortDirection
{
    Ascending,
    Descending,
}