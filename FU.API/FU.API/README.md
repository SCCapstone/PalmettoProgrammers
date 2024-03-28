## Avatar Image System Overview

First the avatar is uploaded to the server via `AvatarController.UploadAvatar`. Then it is validated to be an image, cropped to be square, resized, and converted to a JPEG using the `SkiaSharp` library. Then the image is uploaded to a public azure storage blob and its a url is returned to the user for previewing. If the user wants to use the image, they call `UsersController.UpdateProfile` to set it as their new avatar. After awhile, unused profile pictures are deleted by `PeriodicRemoteStorageCleanerHostedService`.

## Understanding Controllers

The controllers serve as wrappers around the Services. They take an http request, run a corresponding service calls, and return an http result. For example consider the following `GameController` class.

    [Route("api/Games")]
    public class GamesController
    {
        ...

        [HttpGet]
        [Route("{gameId}")]
        public async Task<IActionResult> GetGame(int gameId)
        {
            Game? game = await _gameService.GetGame(gameId);

            if (game is null)
            {
                return NotFound("Game not found");
            }

            GameDTO response = game.ToDto();

            return Ok(response);
        }
    }

To understand what's going on let's walk through the request `GET api/Games/2`. ASP.NET knows `GameController` is responsible for handling all requests starting with the path `api/Games` because of the attribute `[Route("api/Games")]`. Furthermore, the `GetGame` function has the attributes `[HttpGet]` and `[Route("{gameId}")]` which means it handles all `GET` requests at `api/Games/{gameId}`. Since `2` matches `{gameId}`, `GetGame(2)` is called. The function starts by calling `_gameService.GetGame(2)` and checking if a anything was found. If so, the `Game` object is then converted to a `GameDTO` object to standardize request formats. This object is then sent back to the requester with an `OK` response (or `200`). ASP.NET automatically converts the response to a JSON object.

## Chat System Overview
Our chat system uses SignalR to send real time messages. Upon signing in, users are automatically connected to our SignalR ChatHub. Once connected, SignalR assigns a unique ConnectionId to each client, allowing the server to manage communication with individual users or groups of users effectively. https://learn.microsoft.com/en-us/aspnet/core/signalr/hubs?view=aspnetcore-8.0#handle-events-for-a-connection

Once connected, users can navigate to a post or users pages, which will then connect them to the chat group associated with that user or post.

    public async Task JoinChatGroup(int chatId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"ChatGroup-{chatId}");
    }

Whenever a new message is saved to a chat, it is instantly broadcasted to all users currently connected to that chat room. 

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatController(IChatService chatService, IHubContext<ChatHub> hubContext)
        {
            _chatService = chatService;
            _hubContext = hubContext;
        }

        [HttpPost]
        [Route("{chatId}/messages")]
        public async Task<IActionResult> SaveMessage(int chatId, [FromBody] string message)
        {
            var user = await _chatService.GetAuthorizedUser(User) ?? throw new UnauthorizedException();

            var chat = await _chatService.GetChat(chatId);

            if (chat is null)
            {
                return NotFound("Chat not found");
            }

            // Make sure the user is in the chat
            var userInChat = chat.Members.Where(m => m.UserId == user.UserId).Any();

            if (!userInChat)
            {
                return Unauthorized("User is not part of chat");
            }

            var newMessage = await _chatService.SaveMessage(chat, message, user);
            if (newMessage is null)
            {
                return BadRequest();
            }

            var response = newMessage.ToDto();
            await _hubContext.Clients.Group($"ChatGroup-{chatId}").SendAsync("ReceiveMessage", response);

            return CreatedAtAction(nameof(SaveMessage), response);
        }
    }