namespace FU.API.Models
{
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
        public string Name { get; set; } = string.Empty;
    }
}
