namespace FU.API.Hubs;

using System;
using FU.API.Data;
using FU.API.Helpers;
using FU.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

/// <summary>
/// The chathub for handleing chat.
/// </summary>
[Authorize]
public class ChatHub : Hub
{
    /// <summary>
    /// List of the connected users names.
    /// </summary>
    public static readonly List<string> ConnectedUsers = new ();

    /// <summary>
    /// The app db context.
    /// </summary>
    private readonly AppDbContext _context;

    /// <summary>
    /// Initializes a new instance of the <see cref="ChatHub"/> class.
    /// </summary>
    /// <param name="context">The app db context.</param>
    public ChatHub(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Connect the user to the hub.
    /// </summary>
    /// <returns>Task.</returns>
    public override Task OnConnectedAsync()
    {
        var userId = UserId;
        var user = _context.Users.Find(userId);

        if (user is null || user.Username is null)
        {
            return Task.CompletedTask;
        }

        if (!ConnectedUsers.Contains(user.Username))
        {
            ConnectedUsers.Add(user.Username);
        }

        // Update the online status of the user
        user.IsOnline = true;
        _context.Users.Update(user);
        _context.SaveChanges();

        return base.OnConnectedAsync();
    }

    /// <summary>
    /// Disconnect the user from the hub.
    /// </summary>
    /// <param name="exception">Exception.</param>
    /// <returns>Task.</returns>
    public override Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = UserId;
        var user = _context.Users.Find(userId);

        if (user is null || user.Username is null)
        {
            return Task.CompletedTask;
        }

        if (ConnectedUsers.Contains(user.Username))
        {
            ConnectedUsers.Remove(user.Username);
        }

        // Update the online status of the user
        user.IsOnline = false;
        _context.Users.Update(user);
        _context.SaveChanges();

        return base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Join the chat group so the user can recieve live messages.
    /// </summary>
    /// <param name="chatId">The id of the chat to join.</param>
    /// <returns>Task.</returns>
    public async Task JoinChatGroup(int chatId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"ChatGroup-{chatId}");
    }

    /// <summary>
    /// Leave the chat group to stop recieving live messages.
    /// </summary>
    /// <param name="chatId">The id of the chat to leave.</param>
    /// <returns>Task.</returns>
    public async Task LeaveChatGroup(int chatId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"ChatGroup-{chatId}");
    }

    /// <summary>
    /// Gets the user id from the context.
    /// </summary>
    private int UserId => Context?.User?.Claims?.FirstOrDefault(c => c.Type == CustomClaimTypes.UserId)?.Value is not null
        ? int.Parse(Context.User.Claims.FirstOrDefault(c => c.Type == CustomClaimTypes.UserId)?.Value ?? string.Empty)
        : -1;
}