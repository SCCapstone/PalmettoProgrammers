namespace FU.jobs;

using FU.API.Data;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TimerInfo = Microsoft.Azure.Functions.Worker.TimerInfo;
using TimerTriggerAttribute = Microsoft.Azure.Functions.Worker.TimerTriggerAttribute;

public class JobFunction
{
    [Function("CheckExpiredPosts")]
    public async Task CheckExpiredPosts([TimerTrigger("0 */1 * * * *")] TimerInfo timer)
    {
        var config = new ConfigurationBuilder()
            .AddEnvironmentVariables()
            .Build();


        using (var context = ContextFactory.CreateDbContext(config))
        {
            // Add _FU to end of all tag names
            var tags = context.Tags.ToList();
            foreach (var tag in tags)
            {
                tag.Name = tag.Name + "_FU";
            }
            context.Tags.UpdateRange(tags);
            await context.SaveChangesAsync();
        }
    }
}
