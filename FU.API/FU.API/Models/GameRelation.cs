namespace FU.API.Models
{
    /// <summary>
    /// The game relation.
    /// </summary>
    public class GameRelation
    {
        /// <summary>
        /// Gets or sets the id of the relation.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the game of relation.
        /// </summary>
        public Game Game { get; set; } = new Game();

        /// <summary>
        /// Gets or sets the id of the game.
        /// </summary>
        public int GameId { get; set; }
    }
}
