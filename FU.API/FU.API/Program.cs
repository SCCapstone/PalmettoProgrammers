#pragma warning disable SA1200 // Using directives should be placed correctly
using System.Text;
using FU.API.Data;
using FU.API.Helpers;
using FU.API.Middleware;
using FU.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
#pragma warning restore SA1200 // Using directives should be placed correctly

var builder = WebApplication.CreateBuilder(args);

// use environment vars
DotNetEnv.Env.TraversePath().Load();
builder.Configuration.AddEnvironmentVariables();
string connectionString = builder.Configuration[ConfigKey.ConnectionString]
    ?? throw new Exception("No connection string found from env var " + ConfigKey.ConnectionString);
string jwtSecret = builder.Configuration[ConfigKey.JwtSecret]
    ?? throw new Exception("No jwt secret found from env var " + ConfigKey.JwtSecret);

// Setup the database
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

// Validates JWT Tokens
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new()
    {
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ValidateLifetime = true,
        ValidateAudience = false,
        ValidateIssuer = false,
    };
    options.Events = new JwtBearerEvents()
    {
        // https://stackoverflow.com/a/75373719
        // Add the userId claim stored in the token to the HttpContext
        OnTokenValidated = context =>
        {
            string? userId = context.Principal?.FindFirst(CustomClaimTypes.UserId)?.Value;

            if (userId is not null)
            {
                context.HttpContext.Items.Add(CustomContextItems.UserId, userId);
            }

            return Task.CompletedTask;
        },
    };
});

// https://stackoverflow.com/a/66628583
var loggedInPolicy = new AuthorizationPolicyBuilder()
    .RequireAuthenticatedUser()
    .AddRequirements(new IsLoggedInRequirement())
    .Build();

// used to get the context in IsLoggedInAuthenticationHandler
builder.Services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddSingleton<IAuthorizationHandler, IsLoggedInAuthenticationHandler>();
builder.Services.AddScoped<AccountsService>();

builder.Services.AddAuthorization(options =>
{
    // This line can be omitted if you don't need to be
    // able to explicitly set the policy
    options.AddPolicy("LoggedIn", loggedInPolicy);

    // If no policy specified, use this
    options.DefaultPolicy = loggedInPolicy;
});

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
    app.UseHttpsRedirection();
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler(new ExceptionHandlerOptions { ExceptionHandler = ExceptionHandler.HandleException });
app.MapControllers();

app.Run();
