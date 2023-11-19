namespace FU.API.Helpers;

using FU.API.DTOs.Search;
using FU.API.DTOs.Chat;
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

    public static PostQuery ToPostQuery(this PostSearchRequestDTO dto)
    {
        var query = new PostQuery()
        {
            After = dto.After,
            MinimumRequiredPlayers = dto.MinPlayers,
            DescriptionContains = dto.Keywords.Split(" ").ToList(),
            Limit = dto.Limit,
            Offset = dto.Offset,
            SortBy = new ()
        };

        // E.g. dto.Sort = "title:asc" or just "title"
        var arr = dto.Sort.ToLower().Split(":");
        query.SortBy.Type = arr[0] switch
        {
            "players" => SortType.NumberOfPlayers,
            "soonest" => SortType.NewestCreated,
            "newest" => SortType.NewestCreated,
            "title" => SortType.Title,
            _ => SortType.NewestCreated
        };

        if (arr.Length > 1 && arr[1].StartsWith("desc"))
        {
            query.SortBy.Direction = SortDirection.Descending;
        }
        else
        {
            query.SortBy.Direction = SortDirection.Ascending;
        }

        // TODO tags
        // TODO games
        return query;
    }
}