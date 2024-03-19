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

    public const string EmailConnectionString = "EMAIL_CONNECTION_STRING";

    public const string Environment = "ENVIRONMENT";

    /// <summary>
    /// The connection string for an azure storage account.
    /// </summary>
    public const string StorageConnectionString = "STORAGE_CONNECTION_STRING";

    /// <summary>
    /// The azure storage service container name for avatars.
    /// </summary>
    public const string AvatarContainerName = "AVATAR_CONTAINER_NAME";

    /// <summary>
    /// The base spa url.
    /// </summary>
    public const string BaseSpaUrl = "BASE_SPA_URL";
}
