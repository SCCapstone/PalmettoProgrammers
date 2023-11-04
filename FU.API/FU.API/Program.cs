#pragma warning disable SA1200 // Using directives should be placed correctly
using FU.API.Data;
using Microsoft.EntityFrameworkCore;
#pragma warning restore SA1200 // Using directives should be placed correctly

var builder = WebApplication.CreateBuilder(args);

// use environment vars
DotNetEnv.Env.TraversePath().Load();
builder.Configuration.AddEnvironmentVariables();
string? connectionString = builder.Configuration["CONNECTION_STRING"] ?? throw new Exception("No Connection String Found");

// Setup the database
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
