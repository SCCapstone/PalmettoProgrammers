namespace FU.API.Services
{
    using FU.API.Data;
    using FU.API.Interfaces;
    using FU.API.Models;
    using Microsoft.EntityFrameworkCore;

    public class GameService : IGameService
    {
        private readonly AppDbContext _dbContext;

        public GameService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Game?> CreateGame(string gameName)
        {
            var newGame = new Game
            {
                Name = gameName
            };

            _dbContext.Games.Add(newGame);
            await _dbContext.SaveChangesAsync();

            return newGame;
        }

        public async Task DeleteGame(Game game)
        {
            _dbContext.Games.Remove(game);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Game?> GetGame(int gameId)
        {
            return await _dbContext.Games
                .FindAsync(gameId);
        }

        public async Task<IEnumerable<Game>?> GetGames(string gameName)
        {
            var normalizedGameName = gameName.ToUpper();
            return await _dbContext.Games
                .Where(g => g.NormalizedName.Contains(normalizedGameName))
                .ToListAsync();
        }

        public async Task<Game?> UpdateGame(Game game)
        {
            _dbContext.Games.Update(game);
            await _dbContext.SaveChangesAsync();
            return game;
        }

        public async Task<Game?> GetGame(string gameName)
        {
            var normalizedGameName = gameName.ToUpper();
            return await _dbContext.Games
                .Where(g => g.NormalizedName == normalizedGameName)
                .FirstOrDefaultAsync();
        }
    }
}
