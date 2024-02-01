namespace FU.API.Helpers;

/// <summary>
/// A claim for the generated Jwt Tokens. Aka a custom key value pair.
/// </summary>
public static class CustomClaimTypes
{
    /// <summary>
    /// Stores the userId to tie the Jwt to a user.
    /// </summary>
    public const string UserId = "userId";
}

/// <summary>
/// A key to store the userId in the http context.
/// </summary>
public static class CustomContextItems
{
    /// <summary>
    /// userId key value.
    /// </summary>
    public const string UserId = "userId";
}

/// <summary>
/// Stores the custom config key's.
/// </summary>
public static class ConfigKey
{
    /// <summary>
    /// The Jwt Secred config key.
    /// </summary>
    public const string JwtSecret = "JWT_SECRET";

    /// <summary>
    /// The connection string config key.
    /// </summary>
    public const string ConnectionString = "CONNECTION_STRING";

    public const string JobExpressionsMap = "JOB_EXPRESSIONS";
}