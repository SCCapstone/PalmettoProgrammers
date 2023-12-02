namespace FU.API.Models;

/// <summary>
/// The tag relation class.
/// </summary>
public class TagRelation
{
    /// <summary>
    /// Gets or sets the id of the relation.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the tag of the relation.
    /// </summary>
    public Tag Tag { get; set; } = new Tag();

    /// <summary>
    /// Gets or sets the id of the tag.
    /// </summary>
    public int TagId { get; set; }
}
