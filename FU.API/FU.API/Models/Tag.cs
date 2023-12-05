namespace FU.API.Models;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

/// <summary>
/// The tag class.
/// </summary>
public class Tag
{
    /// <summary>
    /// Gets or sets the id of the tag.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the name of the tag.
    /// </summary>
    [Required]
    [StringLength(50)] // Adjust the maximum length as needed
    [RegularExpression(@"^\S+$", ErrorMessage = "Tag cannot contain spaces.")]
    public string Name
    {
        get { return _name; }
        set { _name = value.ToLower(); }
    }

    [NotMapped]
    private string _name = string.Empty;
}
