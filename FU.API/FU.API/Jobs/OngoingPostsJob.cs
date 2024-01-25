namespace FU.API.Jobs;

using FU.API.Data;
using FU.API.Models;

public static class OngoingPostsJob
{
    public static void Execute()
    {
        using (var context = ContextFactory.CreateDbContext())
        {
            var currentTime = DateTime.UtcNow;

            // Find ongoing posts
            // An ongoing post is one that is active, and the current time is after the start time
            var onGoingPosts = context.Posts
                .Where(p => p.Status == PostStatus.Active &&
                        (p.StartTime.HasValue && p.StartTime < currentTime))
                .ToList();

            onGoingPosts.ForEach(p => p.Status = PostStatus.OnGoing);

            context.SaveChanges();
        }
    }
}
