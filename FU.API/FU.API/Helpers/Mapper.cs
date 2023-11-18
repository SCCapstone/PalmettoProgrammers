namespace FU.API.Helpers;

using FU.API.DTOs.Chat;
using FU.API.DTOs.Game;
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

    public static MessageResponseDTO MessageToDto(this Message message)
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

    public static IEnumerable<MessageResponseDTO> MessagesToDtos(this IEnumerable<Message> messages) =>
        messages.Select(message => message.MessageToDto());

    public static ChatResponseDTO ChatToDto(this Chat chat)
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

    public static IEnumerable<ChatResponseDTO> ChatsToDtos(this IEnumerable<Chat> chats) =>
        chats.Select(chat => chat.ChatToDto());

    public static GameDTO GameToDto(this Game game)
    {
        return new GameDTO()
        {
            Id = game.Id,
            Name = game.Name,
            ImageUrl = game.ImageUrl is null ? string.Empty : game.ImageUrl,
        };
    }

    public static IEnumerable<GameDTO> GamesToDtos(this IEnumerable<Game> games) =>
        games.Select(game => game.GameToDto());

    public static TagResponseDTO TagToDto(this Tag tag)
    {
        return new TagResponseDTO()
        {
            Id = tag.Id,
            Name = tag.Name,
        };
    }

    public static IEnumerable<TagResponseDTO> TagsToDtos(this IEnumerable<Tag> tags) =>
        tags.Select(tag => tag.TagToDto());
}