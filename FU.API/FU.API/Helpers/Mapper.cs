namespace FU.API.Helpers;

using FU.API.DTOs.Search;
using FU.API.DTOs.Chat;
using FU.API.DTOs.Game;
using FU.API.DTOs.Post;
using FU.API.DTOs.Tag;
using FU.API.Models;
using FU.API.DTOs.Group;

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
            FavoriteGames = appUser.FavoriteGames.Select(g => g.Game).ToList(),
            FavoriteTags = appUser.FavoriteTags.Select(t => t.Tag).ToList(),
        };
    }

    public static MessageResponseDTO ToDto(this Message message)
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

    public static IEnumerable<MessageResponseDTO> ToDtos(this IEnumerable<Message> messages) =>
        messages.Select(message => message.ToDto());

    public static ChatResponseDTO ToDto(this Chat chat)
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

    public static IEnumerable<ChatResponseDTO> ToDtos(this IEnumerable<Chat> chats) =>
        chats.Select(chat => chat.ToDto());

    public static GameDTO ToDto(this Game game)
    {
        return new GameDTO()
        {
            Id = game.Id,
            Name = game.Name,
            ImageUrl = game.ImageUrl is null ? string.Empty : game.ImageUrl,
        };
    }

    public static IEnumerable<GameDTO> ToDtos(this IEnumerable<Game> games) =>
        games.Select(game => game.ToDto());

    public static TagResponseDTO ToDto(this Tag tag)
    {
        return new TagResponseDTO()
        {
            Id = tag.Id,
            Name = tag.Name,
        };
    }

    public static IEnumerable<TagResponseDTO> ToDtos(this IEnumerable<Tag> tags) =>
        tags.Select(tag => tag.ToDto());

    public static PostQuery ToPostQuery(this PostSearchRequestDTO dto)
    {
        var query = new PostQuery()
        {
            After = dto.After,
            MinimumRequiredPlayers = dto.MinPlayers ?? 0,
            Limit = dto.Limit ?? 20,
            Offset = dto.Offset ?? 0,
            SortBy = new()
        };

        if (dto.Keywords is not null)
        {
            query.Keywords = dto.Keywords.Split(" ").ToList();
        }

        if (dto.Games is not null)
        {
            // loop through comma string, adding each parsable value to gameIds
            foreach (string value in dto.Games.Split(","))
            {
                if (int.TryParse(value, out int id))
                {
                    query.GameIds.Add(id);
                }
            }
        }

        if (dto.Tags is not null)
        {
            // loop through comma string, adding each parsable value to tagIds
            foreach (string value in dto.Tags.Split(","))
            {
                if (int.TryParse(value, out int id))
                {
                    query.TagIds.Add(id);
                }
            }
        }

        // defaults if unset
        dto.Sort ??= "newest:desc";

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

        return query;
    }

    public static PostResponseDTO ToDto(this Post post, bool hasJoined = false)
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
            HasJoined = hasJoined,
        };
    }

    public static IEnumerable<PostResponseDTO> ToDtos(this IEnumerable<Post> posts) =>
        posts.Select(post => post.ToDto());

    public static Post ToModel(this PostRequestDTO postRequestDTO)
    {
        var tagIds = postRequestDTO.TagIds ?? new HashSet<int>();
        return new Post()
        {
            Title = postRequestDTO.Title,
            Description = postRequestDTO.Description ?? string.Empty,
            StartTime = postRequestDTO.StartTime,
            EndTime = postRequestDTO.EndTime,
            MaxPlayers = postRequestDTO.MaxPlayers,
            GameId = postRequestDTO.GameId,
            Tags = tagIds.Select(tagId => new TagRelation() { TagId = tagId }).ToList(),
        };
    }

    public static GroupSimpleDTO ToSimpleDto(this Group group)
    {
        return new GroupSimpleDTO()
        {
            Id = group.Id,
            Name = group.Name,
            Description = group.Description,
            ChatId = group.ChatId,
            Tags = group.Tags.Select(t => t.Tag.Name).ToList(),
        };
    }

    public static IEnumerable<GroupSimpleDTO> ToSimpleDtos(this IEnumerable<Group> groups) =>
        groups.Select(group => group.ToSimpleDto());

    public static Dictionary<string, int> StringJobsToMap(string mapString)
    {
        var map = new Dictionary<string, int>();
        foreach (string job in mapString.Split(";"))
        {
            var arr = job.Split(":");
            if (arr.Length == 2 && int.TryParse(arr[1], out int value))
            {
                map.Add(arr[0], value);
            }
        }

        return map;
    }
}
