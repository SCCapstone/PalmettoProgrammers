namespace FU.API.Services
{
    using FU.API.Data;
    using FU.API.Interfaces;
    using FU.API.Models;
    using Microsoft.EntityFrameworkCore;

    public class TagService : ITagService
    {
        private readonly AppDbContext _dbContext;

        public TagService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Tag?> CreateTag(string tagName)
        {
            var newTag = new Tag
            {
                Name = tagName
            };

            _dbContext.Tags.Add(newTag);
            await _dbContext.SaveChangesAsync();

            return newTag;
        }

        public async Task DeleteTag(Tag tag)
        {
            _dbContext.Tags.Remove(tag);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Tag?> GetTag(int tagId)
        {
            return await _dbContext.Tags
                .FindAsync(tagId);
        }

        public async Task<IEnumerable<Tag>?> GetTags(string tagName)
        {
            var normalizedTagName = tagName.ToLower();
            return await _dbContext.Tags
                .Where(t => t.Name.Contains(normalizedTagName))
                .ToListAsync();
        }

        public async Task<Tag?> UpdateTag(Tag tag)
        {
            _dbContext.Tags.Update(tag);
            await _dbContext.SaveChangesAsync();

            return tag;
        }

        public async Task<Tag?> GetTag(string tagName)
        {
            var normalizedTagName = tagName.ToLower();
            return await _dbContext.Tags
                .FirstOrDefaultAsync(t => t.Name == normalizedTagName);
        }
    }
}
