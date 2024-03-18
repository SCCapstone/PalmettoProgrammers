#pragma warning disable SA1200 // Using directives should be placed correctly
using System.Text;
using FU.API.Data;
using FU.API.Helpers;
using FU.API.Hubs;
using FU.API.Interfaces;
using FU.API.Middleware;
using FU.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
#pragma warning restore SA1200 // Using directives should be placed correctly

var builder = WebApplication.CreateBuilder(args);

// use environment vars
DotNetEnv.Env.TraversePath().Load();
builder.Configuration.AddEnvironmentVariables();
string connectionString = builder.Configuration[ConfigKey.ConnectionString]
    ?? throw new Exception($"Database connection string is not configured. Missing {ConfigKey.ConnectionString}. See README for adding.");
string jwtSecret = builder.Configuration[ConfigKey.JwtSecret]
    ?? throw new Exception($"JWT secret is not configured. Missing {ConfigKey.AvatarContainerName}. See README for adding.");

if (builder.Configuration[ConfigKey.AvatarContainerName] is null)
{
    throw new Exception($"Avatar container name is not configured. Missing {ConfigKey.AvatarContainerName}. See README for adding.");
}

if (builder.Configuration[ConfigKey.StorageConnectionString] is null)
{
    throw new Exception($"Storage connection string is not configured. Missing {ConfigKey.StorageConnectionString}. See README for adding.");
}

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

builder.Services.AddHostedService<PeriodicRemoteStorageCleanerHostedService>();

// used to get the context in IsLoggedInAuthenticationHandler
builder.Services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddSingleton<IAuthorizationHandler, IsLoggedInAuthenticationHandler>();
builder.Services.AddScoped<AccountsService>();
builder.Services.AddScoped<IPostService, PostService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<ITagService, TagService>();
builder.Services.AddScoped<ISearchService, SearchService>();
builder.Services.AddScoped<IRelationService, RelationService>();
builder.Services.AddScoped<ICommonService, CommonService>();
builder.Services.AddScoped<IStorageService, AzureBlobStorageService>();

// Add SignalR
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});

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

// Allow to pass JWT from swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ForcesUnite",
        Version = "v1"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter your token in the text input below.\r\n\r\nExample: \"1safsfsdfdfd\"",
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
else
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Allow any cors
app.UseCors(x => x
    .WithOrigins("http://localhost:5173", "https://jolly-glacier-0ae92c40f.4.azurestaticapps.net")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
    .WithExposedHeaders("X-total-count"));

app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();
app.UseExceptionHandler(new ExceptionHandlerOptions { ExceptionHandler = ExceptionHandler.HandleException });
app.MapControllers();

// Add SignalR hub endpoint
app.MapHub<ChatHub>("/chathub");

app.Run();
