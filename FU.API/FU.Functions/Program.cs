using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
  .Build();

await host.RunAsync();
