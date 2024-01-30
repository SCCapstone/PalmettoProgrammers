namespace FU.API.Jobs;

using FU.API.Data;
using FU.API.Models;

public static class UpdatePostStatusJob
{
    private const int NoEndTimeOffsetHours = 2;

    private const int ExpiredOffsetMins = 15;

    /// <summary>
    /// Executes the job.
    /// Finds expired posts and sets their status to expired.
    /// Finds ongoing posts and sets their status to ongoing.
    /// </summary>
    public static void Execute()
    {
        using (var context = ContextFactory.CreateDbContext())
        {
            // Set the current time
            var currentTime = DateTime.UtcNow;

            // Find expired posts
            // Must have a status of upcoming or ongoing
            // Then must match one of the following
            // 1. Have an end time, and the current time is ExpiredOffsetMins minutes after the end time, or
            // 2. Has just a start time, and the current time is NoEndTimeOffsetHours hours after the start time
            var expiredPosts = context.Posts
                .Where(p =>
                    (p.Status == PostStatus.Upcoming || p.Status == PostStatus.OnGoing) &&
                    ((p.EndTime.HasValue && p.EndTime.Value.AddMinutes(ExpiredOffsetMins) < currentTime) ||
                    ((!p.EndTime.HasValue && p.StartTime.HasValue) && p.StartTime.Value.AddHours(NoEndTimeOffsetHours) < currentTime)))
                .ToList();

            expiredPosts.ForEach(p => p.Status = PostStatus.Expired);

            context.SaveChanges();

            // Find ongoing posts
            // Must have a status of upcoming
            // Then must have a start time, and the current time is after the start time
            var onGoingPosts = context.Posts
                .Where(p => p.Status == PostStatus.Upcoming &&
                        (p.StartTime.HasValue && p.StartTime < currentTime))
                .ToList();

            onGoingPosts.ForEach(p => p.Status = PostStatus.OnGoing);

            context.SaveChanges();
        }
    }
}
