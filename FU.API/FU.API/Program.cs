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

internal class Program
{
    /// <summary>
    /// The entrypoint to the program where everything is started.
    /// </summary>
    private static void Main(string[] args)
    {
        WebApplication app = BuildApp(args);
        ConfigureApp(app);
        app.Run();
    }

    private static void ConfigureApp(in WebApplication app)
    {
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

        app.UseCors(x => x
            .WithOrigins("http://localhost:5173", "https://jolly-glacier-0ae92c40f.4.azurestaticapps.net", "https://www.forces-unite.com")
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
    }

    private static WebApplication BuildApp(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        // Load Environment variables into config
        DotNetEnv.Env.TraversePath().Load();
        builder.Configuration.AddEnvironmentVariables();

        AssertCriticalConfigValuesExist(builder.Configuration);

        // Setup the database
        builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration[ConfigKey.ConnectionString]));

        // Validates JWT Tokens
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new()
            {
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration[ConfigKey.JwtSecret] ?? string.Empty)),
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
        builder.Services.AddSingleton<IEmailService, EmailService>();

        builder.Services.AddSignalR(options =>
        {
            options.EnableDetailedErrors = true;
        });

        // from https://stackoverflow.com/a/66628583
        var loggedInPolicy = new AuthorizationPolicyBuilder()
            .RequireAuthenticatedUser()
            .AddRequirements(new IsLoggedInRequirement())
            .Build();

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

        return builder.Build();
    }

    private static void AssertCriticalConfigValuesExist(in ConfigurationManager config)
    {
        if (config[ConfigKey.ConnectionString] is null)
        {
            throw new Exception($"Database connection string is not configured. Missing {ConfigKey.ConnectionString}. See README for adding.");
        }

        if (config[ConfigKey.JwtSecret] is null)
        {
            throw new Exception($"JWT secret is not configured. Missing {ConfigKey.JwtSecret}. See README for adding.");
        }

        if (config[ConfigKey.AvatarContainerName] is null)
        {
            throw new Exception($"Avatar container name is not configured. Missing {ConfigKey.AvatarContainerName}. See README for adding.");
        }

        if (config[ConfigKey.StorageConnectionString] is null)
        {
            throw new Exception($"Storage connection string is not configured. Missing {ConfigKey.StorageConnectionString}. See README for adding.");
        }

        if (config[ConfigKey.EmailConnectionString] is null)
        {
            throw new Exception($"Email service connection string is not configured. Missing {ConfigKey.EmailConnectionString}. See README for adding.");
        }

        if (config[ConfigKey.BaseSpaUrl] is null)
        {
            throw new Exception($"The base SPA Url is not configured. Missing {ConfigKey.BaseSpaUrl}. See README for adding.");
        }
    }
}
