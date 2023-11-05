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