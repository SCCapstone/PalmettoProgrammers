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
        return new ()
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
    public override string Description { get; } = "The user is not authorized";

    public override string Title { get; } = "Unauthorized User";

    public override HttpStatusCode StatusCode { get; } = HttpStatusCode.Unauthorized;

    public UnauthorizedException()
    {
    }

    public UnauthorizedException(string title, string description, HttpStatusCode statusCode)
    {
        Title = title;
        Description = description;
        StatusCode = statusCode;
    }
}

public class NonexistentGame : ExceptionWithResponse
{
    public override string Description { get; } = "The game does not exist";

    public override string Title { get; } = "Nonexistent Game";

    public override HttpStatusCode StatusCode { get; } = HttpStatusCode.Conflict;

    public NonexistentGame()
    {
    }

    public NonexistentGame(string title, string description, HttpStatusCode statusCode)
    {
        Title = title;
        Description = description;
        StatusCode = statusCode;
    }
}