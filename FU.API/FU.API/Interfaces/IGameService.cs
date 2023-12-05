namespace FU.API.Interfaces;

using FU.API.Models;

public interface IGameService : ICommonService
{
    Task<Game?> GetGame(int gameId);

    Task<Game?> GetGame(string gameName);

    Task<IEnumerable<Game>> GetGames(string gameName);

    Task<Game> CreateGame(string gameName);

    Task<Game> UpdateGame(Game game);

    Task DeleteGame(Game game);
}
