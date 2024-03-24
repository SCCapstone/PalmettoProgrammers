namespace FU.API.Tests;

using FU.API.Data;
using FU.API.Models;
using FU.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

public class AccountServiceTests : IDisposable
{
    private readonly DbContextOptions<AppDbContext> _contextOptions;
    private readonly AppDbContext _dbContext;
    private readonly AccountsService _accountsService;

    // adapted from https://github.com/dotnet/EntityFramework.Docs/blob/main/samples/core/Testing/TestingWithoutTheDatabase/InMemoryBloggingControllerTest.cs
    public AccountServiceTests()
    {
        _contextOptions = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("AccountServiceTestsDb")
            .Options;

        _dbContext = new AppDbContext(_contextOptions);

        _dbContext.Database.EnsureDeleted();
        _dbContext.Database.EnsureCreated();

        _dbContext.SaveChanges();

        // Setup and create account service
        var configPairs = new Dictionary<string, string?>
        {
            { "JWT_SECRET", "1234567890" },
            { "EMAIL_CONNECTION_STRING", "endpoint=https://fake.com/;accesskey=Pdada/dsadasd==" },
            { "BASE_SPA_URL", "http://localhost:5173/" },
        };
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configPairs)
            .Build();
        _accountsService = new AccountsService(configuration, _dbContext, new EmailService(configuration));
    }

    public void Dispose()
    {
        _dbContext.Dispose();
    }

    [Fact]
    public async void CreateUser_WithValidCredentials_ReturnsUser()
    {
        // Arange
        Credentials credentials = new() { Username = "Test", Password = "Test" };

        // Act
        ApplicationUser user = await _accountsService.Register(credentials);

        // Assert
        Assert.Equal(user.Username, credentials.Username);
        Assert.NotNull(user.PasswordHash);
    }

    [Fact]
    public async void ChangeUsername_WithValidUsername_ChangesUsername()
    {
        // Arange
        Credentials credentials = new() { Username = "Username1", Password = "Test" };
        string newUsername = "Username2";
        ApplicationUser user = await _accountsService.Register(credentials);

        // Act
        await _accountsService.UpdateUsername(user.UserId, newUsername);

        // Assert
        Assert.Equal(user.Username, newUsername);
    }

    [Fact]
    public async void ChangePassword_WithValidPassword_ChangesPassword()
    {
        // Arange
        Credentials credentials = new() { Username = "Username1", Password = "Password1" };
        string newPassword = "Password2";
        ApplicationUser user = await _accountsService.Register(credentials);
        var ogPasswordHash = user.PasswordHash;

        // Act
        await _accountsService.UpdatePassword(user.UserId, newPassword);

        // Assert
        Assert.NotEqual(user.PasswordHash, ogPasswordHash);
    }
}
