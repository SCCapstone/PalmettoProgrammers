namespace FU.API.Models
{
    using System.ComponentModel.DataAnnotations.Schema;

    /// <summary>
    /// The game class.
    /// </summary>
    public class Game
    {
        /// <summary>
        /// Gets or sets the id of the game.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the name of the game.
        /// </summary>
        public string Name
        {
            get => _name;
            set
            {
                _name = value;
                NormalizedName = value.ToLower();
            }
        }

        public string NormalizedName { get; set; } = string.Empty;

        [NotMapped]
        private string _name = string.Empty;

        /// <summary>
        /// Gets or sets the url of the image for the game.
        /// </summary>
        public string? ImageUrl { get; set; }
    }
}
