namespace FU.API.Interfaces;

using FU.API.Models;

public interface ITagService : ICommonService
{
    Task<Tag?> GetTag(int tagId);

    Task<Tag?> GetTag(string tagName);

    Task<IEnumerable<Tag>> GetTags(string tagName);

    Task<Tag> CreateTag(string tagName);

    Task<Tag> UpdateTag(Tag tag);

    Task DeleteTag(Tag tag);
}
