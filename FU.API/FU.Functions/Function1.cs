namespace FU.Functions;

using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using FU.API.Data;

public static class Function1
{
    [FunctionName("TestFunction")]
    public static void Run([TimerTrigger("0 */1 * * * *")] TimerInfo myTimer, ILogger log)
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("local.settings.json", true, true)
            .AddEnvironmentVariables()
            .Build();

        using (var context = ContextFactory.CreateDbContext(config))
        {
            // Update all tags to have _FU at the end
            var tags = context.Tags.ToListAsync().Result;
            foreach (var tag in tags)
            {
                tag.Name += "_FU";
            }

            context.SaveChanges();
        }
    }
}
