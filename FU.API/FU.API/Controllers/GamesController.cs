namespace FU.API.Controllers
{
    using FU.API.DTOs.Game;
    using FU.API.Helpers;
    using FU.API.Interfaces;
    using FU.API.Services;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GamesController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly AccountsService _accountsService;

        public GamesController(IGameService gameService, AccountsService accountsService)
        {
            _gameService = gameService;
            _accountsService = accountsService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateGame([FromBody] GameDTO dto)
        {
            var user = await _accountsService.GetCurrentUser(User);

            if (user is null)
            {
                return Unauthorized("User is not signed in");
            }

            var gameName = dto.Name;
            var game = await _gameService.GetGame(gameName);

            if (game is not null)
            {
                return BadRequest("Game already exists");
            }

            game = await _gameService.CreateGame(gameName);

            return await GetGame(game.Id);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetGames([FromQuery] string gameName)
        {
            var games = await _gameService.GetGames(gameName);

            var response = games.ToDtos();

            return Ok(response);
        }

        [HttpGet]
        [Route("{gameId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetGame(int gameId)
        {
            var game = await _gameService.GetGame(gameId);

            if (game is null)
            {
                return NotFound("Game not found");
            }

            var response = game.ToDto();

            return Ok(response);
        }

        [HttpPatch]
        [Route("{gameId}")]
        public async Task<IActionResult> UpdateGame(int gameId, [FromBody] UpdateGameDTO updateGame)
        {
            var user = await _accountsService.GetCurrentUser(User);

            if (user is null || !user.IsAdmin)
            {
                return Unauthorized("User is not authorized");
            }

            var game = await _gameService.GetGame(gameId);

            if (game is null)
            {
                return NotFound("Game not found");
            }

            game.Name = updateGame.Name ?? game.Name;
            game.ImageUrl = updateGame.ImageUrl ?? game.ImageUrl;

            var updatedGame = await _gameService.UpdateGame(game);

            var response = updatedGame.ToDto();

            return Ok(response);
        }

        [HttpDelete]
        [Route("{gameId}")]
        public async Task<IActionResult> DeleteGame(int gameId)
        {
            var user = await _accountsService.GetCurrentUser(User);

            if (user is null || !user.IsAdmin)
            {
                return Unauthorized("User is not authorized");
            }

            var game = await _gameService.GetGame(gameId);

            if (game is null)
            {
                return NotFound("Game not found");
            }

            await _gameService.DeleteGame(game);

            return NoContent();
        }
    }
}
