namespace FU.API.Jobs;

using FU.API.Data;
using FU.API.Models;

public static class ExpiredPostsJob
{
    private const int NoEndTimeOffset = 2;

    public static void Execute()
    {
        using (var context = ContextFactory.CreateDbContext())
        {
            var currentTime = DateTime.UtcNow;

            var expiredPosts = context.Posts
                .Where(p =>
                    ((p.Status == PostStatus.Active || p.Status == PostStatus.OnGoing) &&
                    (p.EndTime.HasValue && p.EndTime < currentTime)) ||
                    ((!p.EndTime.HasValue && p.StartTime.HasValue) && p.StartTime.Value.AddHours(NoEndTimeOffset) < currentTime))
                .ToList();

            expiredPosts.ForEach(p => p.Status = PostStatus.Expired);

            context.SaveChanges();
        }
    }
}
