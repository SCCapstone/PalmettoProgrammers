using FU.API.Exceptions;
using Microsoft.AspNetCore.Diagnostics;

namespace FU.API.Middleware;

public static class ExceptionHandler
{
    public async static Task HandleException(HttpContext context)
    {
        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        var error = exceptionHandlerPathFeature?.Error;

        if (error is ExceptionWithResponse exception)
        {
            context.Response.StatusCode = (int)exception.StatusCode;
            await context.Response.WriteAsJsonAsync(exception.GetProblemDetails());
        }
    }
}