namespace FU.API.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

/// <summary>
/// User of the application.
/// </summary>
[Microsoft.EntityFrameworkCore.Index(nameof(Username))]
public class ApplicationUser
{
    /// <summary>
    /// Gets or sets the url for profile picture.
    /// </summary>
    public string PfpUrl { get; set; } = "https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png";

    /// <summary>
    /// Gets or sets a value indicating whether the user is online or not.
    /// </summary>
    public bool IsOnline { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the user is admin of the site.
    /// </summary>
    public bool IsAdmin { get; set; }

    [NotMapped]
    private string _bio = string.Empty;

    public string Bio
    {
        get => _bio;
        set
        {
            _bio = value;
            NormalizedBio = value.ToUpper();
        }
    }

    public string NormalizedBio { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the dob of the user.
    /// </summary>
    public DateOnly? DOB { get; set; }

    /// <summary>
    /// Gets or sets the FavoriteGames.
    /// </summary>
    [JsonIgnore]
    public ICollection<GameRelation> FavoriteGames { get; set; } = new HashSet<GameRelation>();

    /// <summary>
    /// Gets or sets the FavoriteTags.
    /// </summary>
    [JsonIgnore]
    public ICollection<TagRelation> FavoriteTags { get; set; } = new HashSet<TagRelation>();

    /// <summary>
    /// Gets or sets the GroupMemberships.
    /// </summary>
    [JsonIgnore]
    public ICollection<GroupMembership> Groups { get; set; } = new HashSet<GroupMembership>();

    /// <summary>
    /// Gets or sets the ChatMemberships.
    /// </summary>
    [JsonIgnore]
    public ICollection<ChatMembership> Chats { get; set; } = new HashSet<ChatMembership>();

    // ACCCOUNT INFO

    /// <summary>
    /// Gets or sets the id of the user.
    /// </summary>
    [Key]
    public int UserId { get; set; }

    [NotMapped]
    private string _username = string.Empty;

    /// <summary>
    /// Gets or sets the username.
    /// </summary>
    public string Username
    {
        get => _username;
        set
        {
            _username = value;
            NormalizedUsername = value.ToUpper();
        }
    }

    /// <summary>
    /// Gets or sets the normalized username.
    /// </summary>
    public string NormalizedUsername { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the passwordHash.
    /// </summary>
    [JsonIgnore]
    public string PasswordHash { get; set; } = string.Empty;

    [NotMapped]
    private string? _email;

    /// <summary>
    /// Gets or sets the user email.
    /// </summary>
    [EmailAddress]
    [JsonIgnore]
    public string? Email
    {
        get => _email;
        set
        {
            _email = value;
            if (value is not null)
            {
                NormalizedEmail = value.ToUpper();
            }
        }
    }

    public string NormalizedEmail { get; set; } = string.Empty;

    public bool AccountConfirmed { get; set; } = false;
}
