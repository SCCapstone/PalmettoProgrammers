namespace FU.API.Exceptoins;

public class DuplicateUserException : Exception
{
    public DuplicateUserException() { }
    public DuplicateUserException(string message) : base(message) { }
    public DuplicateUserException(string message, Exception inner) : base(message, inner) { }
}