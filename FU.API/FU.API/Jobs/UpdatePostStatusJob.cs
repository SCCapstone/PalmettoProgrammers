namespace FU.API.Jobs;

using FU.API.Data;
using FU.API.Models;

public static class UpdatePostStatusJob
{
    private const int NoEndTimeOffset = 2;

    private const int ExpiredOffset = 15;

    /// <summary>
    /// Executes the job.
    /// Finds expired posts and sets their status to expired.
    /// Finds ongoing posts and sets their status to ongoing.
    /// </summary>
    public static void Execute()
    {
        using (var context = ContextFactory.CreateDbContext())
        {
            var currentTime = DateTime.UtcNow;

            var expiredPosts = context.Posts
                .Where(p =>
                    (p.Status == PostStatus.Active || p.Status == PostStatus.OnGoing) &&
                    ((p.EndTime.HasValue && p.EndTime.Value.AddMinutes(ExpiredOffset) < currentTime) ||
                    ((!p.EndTime.HasValue && p.StartTime.HasValue) && p.StartTime.Value.AddHours(NoEndTimeOffset) < currentTime)))
                .ToList();

            expiredPosts.ForEach(p => p.Status = PostStatus.Expired);

            context.SaveChanges();

            var onGoingPosts = context.Posts
                .Where(p => p.Status == PostStatus.Active &&
                        (p.StartTime.HasValue && p.StartTime < currentTime))
                .ToList();

            onGoingPosts.ForEach(p => p.Status = PostStatus.OnGoing);

            context.SaveChanges();
        }
    }
}
