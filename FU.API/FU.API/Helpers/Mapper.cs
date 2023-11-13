namespace FU.API.Helpers;

using FU.API.DTOs.Chat;
using FU.API.DTOs.Game;
using FU.API.DTOs.Post;
using FU.API.DTOs.Tag;
using FU.API.Models;

public static class Mapper
{
    public static UserProfile ToProfile(this ApplicationUser appUser)
    {
        return new UserProfile()
        {
            Id = appUser.UserId,
            Username = appUser.Username,
            Bio = appUser.Bio,
            DOB = appUser.DOB,
            PfpUrl = appUser.PfpUrl,
            IsOnline = appUser.IsOnline,
            FavoriteGames = appUser.FavoriteGames,
            FavoriteTags = appUser.FavoriteTags,
        };
    }

    public static MessageResponseDTO MessageFromModel(this Message message)
    {
        return new MessageResponseDTO()
        {
            Id = message.Id,
            CreatedAt = message.CreatedAt,
            Content = message.Content,
            SenderId = message.SenderId,
            SenderName = message.Sender.Username,
        };
    }

    public static IEnumerable<MessageResponseDTO> MessagesFromModels(this IEnumerable<Message> messages) =>
        messages.Select(message => message.MessageFromModel());

    public static ChatResponseDTO ChatFromModel(this Chat chat)
    {
        return new ChatResponseDTO()
        {
            Id = chat.Id,
            ChatName = chat.ChatName is null ? string.Empty : chat.ChatName,
            LastMessage = chat.LastMessage is null ? string.Empty : chat.LastMessage.Content,
            ChatType = chat.ChatType.ToString(),
            Members = chat.Members.Select(m => m.User.Username).ToList(),
        };
    }

    public static IEnumerable<ChatResponseDTO> ChatsFromModels(this IEnumerable<Chat> chats) =>
        chats.Select(chat => chat.ChatFromModel());

    public static GameResponseDTO GameFromModel(this Game game)
    {
        return new GameResponseDTO()
        {
            Id = game.Id,
            Name = game.Name,
            ImageUrl = game.ImageUrl is null ? string.Empty : game.ImageUrl,
        };
    }

    public static IEnumerable<GameResponseDTO> GamesFromModels(this IEnumerable<Game> games) =>
        games.Select(game => game.GameFromModel());

    public static TagResponseDTO TagFromModel(this Tag tag)
    {
        return new TagResponseDTO()
        {
            Id = tag.Id,
            Name = tag.Name,
        };
    }

    public static IEnumerable<TagResponseDTO> TagsFromModels(this IEnumerable<Tag> tags) =>
        tags.Select(tag => tag.TagFromModel());

    public static PostResponseDTO PostFromModel(this Post post)
    {
        return new PostResponseDTO()
        {
            Id = post.Id,
            Title = post.Title,
            Game = post.Game.Name,
            Description = post.Description,
            StartTime = post.StartTime,
            EndTime = post.EndTime,
            MaxPlayers = post.MaxPlayers,
            ChatId = post.ChatId,
            Creator = post.Creator.Username,
            Tags = post.Tags.Select(t => t.Tag.Name).ToList(),
        };
    }

    public static IEnumerable<PostResponseDTO> PostsFromModels(this IEnumerable<Post> posts) =>
        posts.Select(post => post.PostFromModel());

    public static Post PostFromRequest(this PostRequestDTO postRequestDTO)
    {
        var tagIds = postRequestDTO.TagIds ?? new HashSet<int>();
        return new Post()
        {
            Title = postRequestDTO.Title,
            Description = postRequestDTO.Description,
            StartTime = postRequestDTO.StartTime,
            EndTime = postRequestDTO.EndTime,
            MaxPlayers = postRequestDTO.MaxPlayers,
            GameId = postRequestDTO.GameId,
            Tags = tagIds.Select(tagId => new TagRelation() { TagId = tagId }).ToList(),
        };
    }
}