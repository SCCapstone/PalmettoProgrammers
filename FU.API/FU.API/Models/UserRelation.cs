namespace FU.API.Models;

/// <summary>
/// User to user relations.
/// Make User1 the user who sent the request.
/// </summary>
public class UserRelation
{
    /// <summary>
    /// Gets or sets the Id.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the first user.
    /// </summary>
    public ApplicationUser User1 { get; set; } = new ApplicationUser();

    /// <summary>
    /// Gets or sets the id of the first user.
    /// </summary>
    public int User1Id { get; set; }

    /// <summary>
    /// Gets or sets the second user.
    /// </summary>
    public ApplicationUser User2 { get; set; } = new ApplicationUser();

    /// <summary>
    /// Gets or sets the id of the second user.
    /// </summary>
    public int User2Id { get; set; }

    /// <summary>
    /// Gets or sets the status of this relation.
    /// </summary>
    public UserRelationStatus Status { get; set; }

    public Chat Chat { get; set; } = new Chat();

    public int ChatId { get; set; }
}

/// <summary>
/// The user relation status enum.
/// </summary>
public enum UserRelationStatus
{
    /// <summary>
    /// User1 has a pending request from User2
    /// </summary>
    Pending,

    /// <summary>
    /// User1 has requested User2 as a friend
    /// </summary>
    Requested,

    /// <summary>
    /// User1 and User2 are friends
    /// </summary>
    Friends,

    /// <summary>
    /// User1 has blocked User2
    /// </summary>
    Blocked,

    /// <summary>
    /// User1 is blocked by User2
    /// </summary>
    BlockedBy,

    /// <summary>
    /// No relation.
    /// </summary>
    None,
}

/// <summary>
/// The actions related to user relations.
/// </summary>
public enum UserRelationAction
{
    /// <summary>
    /// Friend another user
    /// </summary>
    Friend,

    /// <summary>
    /// Block another user
    /// </summary>
    Block,
}
