namespace FU.API.Models;

public enum UserSortType
{
    Username,
    DOB,
    ChatActivity,
}

public enum PostSortType
{
    EarliestToScheduledTime,
    NewestCreated,
    NumberOfPlayers,
    Title,
    ChatActivity,
}

public enum SortDirection
{
    Ascending,
    Descending,
}
