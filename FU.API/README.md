# API Overview

## Tech Stack

- The api is build with ASP.NET
  - SignalR is used for real-time chat
  - SkiaSharp is used for image manipulation
  - xUnit is used for testing
  - EFCore is our O/RM
- Postgres is our DBMS
- Azure Blob Storage is used to store user avatars
- Azure Communication Service is used to send emails
- Docker can be used for containerization

## Development

### External Requirements

In order to run the project you first have to install:

- [ASP.NET Core 7](https://learn.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core?view=aspnetcore-7.0)
- [PostgreSQL](https://www.postgresql.org/download/)

### Postgres Setup

Install and start the database by installing Docker and running the following command.

```
docker run --name postgres-490 -e POSTGRES_DB=fu_dev -e POSTGRES_PASSWORD=dev -e POSTGRES_USER=dev -p 5432:5432 postgres:alpine
```

To run the container at a later time, run:

```
docker container start postgres-490
```

Alternatively, install and start a PostgreSQL database manually.

### Config Setup

Config settings are loaded from the environment variables. To automatically load the environment variable from a file, create a `.env` file in this folder.

#### Blob storage

An azure storage account is needed with a storage container. Public anonymous access must be enabled. The `STORAGE_CONNECTION_STRING` and `AVATAR_CONTAINER_NAME` environment variables must be set.

```
STORAGE_CONNECTION_STRING="XXXXXXXX"
AVATAR_CONTAINER_NAME="some-container-name"
```

#### Jwt Secret

A random string of 32+ characters is required in the `JWT_SECRET` environment variable as a Jwt Secret.

```
JWT_SECRET="my-32-character-ultra-secure-and-ultra-long-secret"
```

#### Email service

An azure communication service is needed to send emails.

```
EMAIL_CONNECTION_STRING="XXXXXXXX"
```

#### Connect to Postgres

Set the postgres `CONNECTION_STRING` environment variable.

```
CONNECTION_STRING="Host=localhost; Database=fu_dev; Username=dev; Password=dev"
```

### Coding Style

Follow Google's C# [style guide](https://google.github.io/styleguide/csharp-style.html)

## Testing

Run tests on the backend with `dotnet test`. Tests are located in `FU.API.Tests/`. They consist of service unit tests as behavioral testing is done by the SPA.

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

## Understanding Services

Services usually interact directly with the database and use LINQ queries to sort, remove, and insert data into the database. To get a better and more complete understanding of how services work, look at the `FU.API.Tests` directory and look at the unit test.

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

## Avatar Image System Overview

First an avatar is uploaded to the server via `AvatarController.UploadAvatar`. Then it is validated to be an image, cropped to be square, resized, and converted to a JPEG using the `SkiaSharp` library. Then the image is uploaded to a public azure storage blob and its a url is returned to the user for previewing. If the user wants to use the image, they call `UsersController.UpdateProfile` to set it as their new avatar. After awhile, unused profile pictures are deleted by `PeriodicRemoteStorageCleanerHostedService`.

## Understanding DTOs

DTOs, or Data Transfer Objects, serve as simple objects that carry data between processes, typically between a client and a server.

Consider the following DTO as an example:

```
public record UserSearchRequestDTO
{
    [FromQuery]
    public string? Keywords { get; set; }

    [FromQuery]
    public string? Sort { get; set; }

    [FromQuery]
    public int? Limit { get; set; }

    [FromQuery]
    public int? Page { get; set; }
}
```
  
In this example, UserSearchRequestDTO is a DTO used for handling user search requests. It contains properties for keywords, sorting criteria, pagination limits, and page numbers. The [FromQuery] attribute indicates that the properties should be bound from the query string when used in our ASP.NET Web API.

To process the user search request, a static mapper class is utilized to convert the UserSearchRequestDTO to a UserQuery. Here's an example of how it's done:

```
public static class Mapper
{
    ...
    public static UserQuery ToUserQuery(this UserSearchRequestDTO dto)
    {
        var query = new UserQuery()
        {
            Limit = dto.Limit ?? 20,
            Page = dto.Page ?? 1,
            SortType = UserSortType.Username, // Default value
            SortDirection = SortDirection.Ascending // Default value
        };

        // Splitting keywords if provided
        if (dto.Keywords is not null)
        {
            query.Keywords = dto.Keywords.Split(" ").ToList();
        }

        // Setting default sort if not provided
        dto.Sort ??= "newest:desc";

        // Parsing and setting sort type and direction
        var arr = dto.Sort.ToLower().Split(":");
        query.SortType = arr[0] switch
        {
            "username" => UserSortType.Username,
            "dob" => UserSortType.DOB,
            "chatactivity" => UserSortType.ChatActivity,
            _ => UserSortType.Username,
        };

        if (arr.Length > 1 && arr[1].StartsWith("desc"))
        {
            query.SortDirection = SortDirection.Descending;
        }
        else
        {
            query.SortDirection = SortDirection.Ascending;
        }

        return query;
    }
}
```

This static mapper class contains a method ToUserQuery which takes a UserSearchRequestDTO and converts it into a UserQuery object, which is then used in the search service to perform the actual search operation.
