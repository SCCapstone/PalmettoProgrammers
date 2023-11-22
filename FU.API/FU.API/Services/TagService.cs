namespace FU.API.Services
{
    using FU.API.Data;
    using FU.API.Interfaces;
    using FU.API.Models;
    using Microsoft.EntityFrameworkCore;

    public class TagService : CommonService, ITagService
    {
        private readonly AppDbContext _dbContext;

        public TagService(AppDbContext dbContext)
            : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Tag> CreateTag(string tagName)
        {
            var newTag = new Tag
            {
                Name = tagName
            };

            try
            {
                _dbContext.Tags.Add(newTag);
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                throw new DbUpdateException();
            }

            return newTag;
        }

        public async Task DeleteTag(Tag tag)
        {
            try
            {
                _dbContext.Tags.Remove(tag);
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                throw new DbUpdateException();
            }
        }

        public async Task<Tag?> GetTag(int tagId)
        {
            return await _dbContext.Tags
                .FindAsync(tagId);
        }

        public async Task<IEnumerable<Tag>> GetTags(string tagName)
        {
            var normalizedTagName = tagName.ToLower();
            return await _dbContext.Tags
                .Where(t => t.Name.Contains(normalizedTagName))
                .ToListAsync();
        }

        public async Task<Tag> UpdateTag(Tag tag)
        {
            try
            {
                _dbContext.Tags.Update(tag);
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                throw new DbUpdateException();
            }

            return tag;
        }

        public async Task<Tag?> GetTag(string tagName)
        {
            var normalizedTagName = tagName.ToLower();
            return await _dbContext.Tags
                .FirstOrDefaultAsync(t => t.Name == normalizedTagName);
        }

        public async Task<IEnumerable<Tag>?> GetTags(List<int> tagIds)
        {
            var tags = await _dbContext.Tags
                .Where(t => tagIds.Contains(t.Id))
                .ToListAsync();

            return tags.Count == tagIds.Count
                ? tags
                : null;
        }
    }
}
