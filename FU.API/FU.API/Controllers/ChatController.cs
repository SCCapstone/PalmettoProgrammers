namespace FU.API.Controllers;

using FU.API.DTOs.Chat;
using FU.API.Exceptions;
using FU.API.Helpers;
using FU.API.Hubs;
using FU.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

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

    /// <summary>
    /// Saves a message to the database and sends it to the other users in the chat.
    /// </summary>
    /// <param name="chatId">The chat id.</param>
    /// <param name="message">The message to save.</param>
    /// <returns>201 Created at action.</returns>
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

    /// <summary>
    /// Gets messages from a chat.
    /// </summary>
    /// <param name="chatId">The chat.</param>
    /// <param name="offset">The offset.</param>
    /// <param name="limit">The limit.</param>
    /// <returns>A list of messages.</returns>
    [HttpGet]
    [Route("{chatId}/messages")]
    public async Task<IActionResult> GetMessages(int chatId, [FromQuery] int offset = 1, [FromQuery] int limit = 10)
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

        var messages = await _chatService.GetChatMessages(chatId, offset, limit);

        var response = messages.ToDtos();

        return Ok(response);
    }

    /// <summary>
    /// Gets a chat by id.
    /// </summary>
    /// <param name="chatId">The chat id.</param>
    /// <returns>The chat.</returns>
    [HttpGet]
    [Route("{chatId}")]
    public async Task<IActionResult> GetChat(int chatId)
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

        var response = chat.ToDto();

        return Ok(response);
    }

    /// <summary>
    /// Gets a direct chat between the current user and another user.
    /// </summary>
    /// <param name="otherUserId">The id of the other user.</param>
    /// <returns>The chat between the 2 users.</returns>
    [HttpGet]
    [Route("direct/{otherUserId}")]
    public async Task<IActionResult> GetDirectChat(int otherUserId)
    {
        var user = await _chatService.GetAuthorizedUser(User) ?? throw new UnauthorizedException();

        var otherUser = await _chatService.GetUser(otherUserId);

        if (otherUser is null)
        {
            return NotFound("Other user not found");
        }

        // Find an existing chat between the users
        var existingChat = await _chatService.GetChat(user.UserId, otherUserId);

        ChatResponseDTO? response;

        // Return the chat if one already exists
        if (existingChat is not null)
        {
            response = existingChat.ToDto();
            return Ok(response);
        }

        // Otherwise create a new chat
        var newChat = await _chatService.CreateChat(user, otherUser);

        if (newChat is null)
        {
            return BadRequest("Failed to create the new chat");
        }

        response = newChat.ToDto();

        return Ok(response);
    }
}
