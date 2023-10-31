namespace FU.API.Models
{
    public class Game
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class GameRelation
    {
        public int Id { get; set; }
        public Game Game { get; set; }
        public int GameId { get; set; }
    }
}
