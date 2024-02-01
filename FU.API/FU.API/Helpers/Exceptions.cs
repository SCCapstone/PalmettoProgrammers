namespace FU.API.Exceptions;

using System.Net;
using Microsoft.AspNetCore.Mvc;

public abstract class ExceptionWithResponse : Exception
{
    public abstract string Description { get; }

    public abstract string Title { get; }

    public abstract HttpStatusCode StatusCode { get; }

    public ProblemDetails GetProblemDetails()
    {
        return new()
        {
            Title = Title,
            Detail = Description,
            Status = (int)StatusCode,
        };
    }
}

public class DuplicateUserException : ExceptionWithResponse
{
    public override string Description { get; } = "The user already exists";

    public override string Title { get; } = "Duplicate User";

    public override HttpStatusCode StatusCode { get; } = HttpStatusCode.Conflict;

    public DuplicateUserException()
    {
    }

    public DuplicateUserException(string title, string description, HttpStatusCode statusCode)
    {
        Title = title;
        Description = description;
        StatusCode = statusCode;
    }
}

public class UnauthorizedException : ExceptionWithResponse
{
    public override string Title { get; } = "Unauthorized";

    public override string Description { get; } = "The user is not authorized";

    public override HttpStatusCode StatusCode { get; } = HttpStatusCode.Unauthorized;

    public UnauthorizedException()
    {
    }

    public UnauthorizedException(string description)
    {
        Description = description;
    }
}

public class NotFoundException : ExceptionWithResponse
{
    public override string Description { get; } = "Not Found";

    public override string Title { get; } = "The resource was not found";

    public override HttpStatusCode StatusCode { get; } = HttpStatusCode.NotFound;

    public NotFoundException()
    {
    }

    public NotFoundException(string title, string description)
    {
        Title = title;
        Description = description;
    }
}

public class PostNotFoundException : NotFoundException
{
    public override string Description { get; } = "Post Not Found";

    public override string Title { get; } = "The post was not found";
}

public class NonexistentGameException : ExceptionWithResponse
{
    public override string Description { get; } = "The game does not exist";

    public override string Title { get; } = "Nonexistent Game";

    public override HttpStatusCode StatusCode { get; } = HttpStatusCode.NotFound;

    public NonexistentGameException()
    {
    }

    public NonexistentGameException(string title, string description, HttpStatusCode statusCode)
    {
        Title = title;
        Description = description;
        StatusCode = statusCode;
    }
}

public class PostException : ExceptionWithResponse
{
    public override string Description { get; } = "Error with the post";

    public override string Title { get; } = "Post Exception";

    public override HttpStatusCode StatusCode { get; }

    public PostException()
    {
    }

    public PostException(string description, HttpStatusCode statusCode)
    {
        Description = description;
        StatusCode = statusCode;
    }
}

public class ConflictException : ExceptionWithResponse
{
    public override string Description { get; } = "Conflict exception";

    public override string Title { get; } = "Conflict exception";

    public override HttpStatusCode StatusCode { get; } = HttpStatusCode.Conflict;

    public ConflictException()
    {
    }

    public ConflictException(string description)
    {
        Description = description;
    }
}
