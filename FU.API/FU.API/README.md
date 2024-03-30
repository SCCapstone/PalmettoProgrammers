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

Our chat system uses SignalR to send real time messages. Upon signing in, users are automatically connected to our SignalR ChatHub. Once connected, SignalR assigns a unique `ConnectionId` to each client, allowing the server to manage communication with individual users or groups of users effectively. See [here](https://learn.microsoft.com/en-us/aspnet/core/signalr/hubs?view=aspnetcore-8.0#handle-events-for-a-connection) for more information.

When users navigate to a pages with a chat, they will be connected the chat group associated with that user or post (see `ChatHub.JoinChatGroup`). A user sends a message by send a `POST` request. The request is handled by `SaveMessage` seen below. This function saves the message to the database and instantly broadcasts it to all other users currently connected to the same chat room.

    public class ChatController
    {
        ...

        [HttpPost]
        [Route("{chatId}/messages")]
        public async Task<IActionResult> SaveMessage(int chatId, [FromBody] string message)
        {
            ...

            var newMessage = await _chatService.SaveMessage(chat, message, user);

            var response = newMessage.ToDto();
            await _hubContext.Clients.Group($"ChatGroup-{chatId}").SendAsync("ReceiveMessage", response);

            return Created(response);
        }
    }
