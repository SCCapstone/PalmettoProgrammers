namespace FU.API.Models;

public enum UserSortType
{
    Username,
}

public enum PostSortType
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
