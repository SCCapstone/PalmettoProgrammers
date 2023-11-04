namespace FU.API.Hubs
{
    using FU.API.Data;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.SignalR;
    using System;

    /// <summary>
    /// The chathub for handleing chat.
    /// </summary>
    [Authorize]
    public class ChatHub : Hub
    {
        /// <summary>
        /// List of the connected users names.
        /// </summary>
        public readonly static List<string> ConnectedUsers = new();

        /// <summary>
        /// The app db context.
        /// </summary>
        private readonly AppDbContext _context;

        /// <summary>
        /// Initializes a new instance of the <see cref="ChatHub"/> class.
        /// </summary>
        /// <param name="context">The app db context</param>
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
            return base.OnConnectedAsync();
        }

        /// <summary>
        /// Disconnect the user from the hub
        /// </summary>
        /// <param name="exception">Exception.</param>
        /// <returns>Task.</returns>
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// Join the chat group so the user can recieve live messages.
        /// </summary>
        /// <param name="chatId">The id of the chat to join.</param>
        /// <returns>Task.</returns>
        public async Task JoinChatGroup(int chatId)
        {
            var user = await _context.Users.FindAsync(IdentityName);
        }

        /// <summary>
        /// Leave the chat group to stop recieving live messages.
        /// </summary>
        /// <param name="chatId">The id of the chat to leave.</param>
        /// <returns>Task.</returns>
        public async Task LeaveChatGroup(int chatId)
        {

        }

        /// <summary>
        /// Gets the identity name from the context.
        /// </summary>
        private string? IdentityName => Context?.User?.Identity?.Name;

    }
}
