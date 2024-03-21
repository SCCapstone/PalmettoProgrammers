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
/// Stores custom config keys.
/// </summary>
public static class ConfigKey
{
    /// <summary>
    /// The JWT Secred config key.
    /// </summary>
    public const string JwtSecret = "JWT_SECRET";

    /// <summary>
    /// The database connection string config key.
    /// </summary>
    public const string ConnectionString = "CONNECTION_STRING";

    public const string EmailConnectionString = "EMAIL_CONNECTION_STRING";

    public const string Environment = "ENVIRONMENT";

    /// <summary>
    /// The config key for an azure storage account connection string.
    /// </summary>
    public const string StorageConnectionString = "STORAGE_CONNECTION_STRING";

    /// <summary>
    /// The config key for the azure storage service container name that avatars are stored in.
    /// </summary>
    public const string AvatarContainerName = "AVATAR_CONTAINER_NAME";

    /// <summary>
    /// The base spa url.
    /// </summary>
    public const string BaseSpaUrl = "BASE_SPA_URL";
}
