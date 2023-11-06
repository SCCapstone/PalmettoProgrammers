using FU.API.Helpers;
using Microsoft.AspNetCore.Authorization;

/// <summary>
/// Computes if the IsLoggedInRequirement passes.
/// </summary>
public class IsLoggedInAuthenticationHandler : AuthorizationHandler<IsLoggedInRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public IsLoggedInAuthenticationHandler(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsLoggedInRequirement requirement)
    {
        var httpContext = _httpContextAccessor.HttpContext;

        string? userId = (string?)httpContext?.Items[CustomContextItems.UserId];

        if (userId is null)
        {
            context.Fail();
        }
        else
        {
            // TODO validate user against db because the user may be deleted since the Jwt creation
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}