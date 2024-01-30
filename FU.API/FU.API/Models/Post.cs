namespace FU.API.Models;

using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// The post class.
/// </summary>
public class Post
{
    /// <summary>
    /// Gets or sets the id of the post.
    /// </summary>
    public int Id { get; set; }

    [NotMapped]
    private string _title = string.Empty;

    /// <summary>
    /// Gets or sets the title of the post.
    /// </summary>
    public string Title
    {
        get => _title;
        set
        {
            _title = value;
            NormalizedTitle = value.ToUpper();
        }
    }

    public string NormalizedTitle { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the game of the post.
    /// </summary>
    public Game Game { get; set; } = new Game();

    /// <summary>
    /// Gets or sets the id of the game.
    /// </summary>
    public int GameId { get; set; }

    /// <summary>
    /// Gets or sets the description of the post.
    /// </summary>
    [NotMapped]
    private string _description = string.Empty;

    public string Description
    {
        get => _description;
        set
        {
            _description = value;
            NormalizedDescription = value.ToUpper();
        }
    }

    public string NormalizedDescription { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the start time.
    /// </summary>
    public DateTime? StartTime { get; set; }

    /// <summary>
    /// Gets or sets the posts end time.
    /// </summary>
    public DateTime? EndTime { get; set; }

    /// <summary>
    /// Gets or sets the max players.
    /// </summary>
    public int? MaxPlayers { get; set; }

    /// <summary>
    /// Gets or sets the chat for the post.
    /// </summary>
    public Chat Chat { get; set; } = new Chat();

    /// <summary>
    /// Gets or sets the id of the chat.
    /// </summary>
    public int ChatId { get; set; }

    /// <summary>
    /// Gets or sets the creator of the post.
    /// </summary>
    public ApplicationUser Creator { get; set; } = new ApplicationUser();

    public PostStatus? Status { get; set; }

    /// <summary>
    /// Gets or sets the id of the creator.
    /// </summary>
    public int CreatorId { get; set; }

    /// <summary>
    /// Gets or sets when the post was created.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Gets or sets the tags of a post.
    /// </summary>
    public ICollection<TagRelation> Tags { get; set; } = new HashSet<TagRelation>();
}

public enum PostStatus
{
    /// <summary>
    /// The post is Upcoming. This is the default status for posts with a start time.
    /// </summary>
    Upcoming,

    /// <summary>
    /// The post has expired. This status is set when the post has ended.
    /// </summary>
    Expired,

    /// <summary>
    /// The post is on going. This status is set when the post has started.
    /// </summary>
    OnGoing
}
