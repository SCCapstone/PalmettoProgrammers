namespace FU.API.Controllers
{
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {

        // CREATE Game (Authorized)
        // READ Game (Partial match)
        // UPDATE Game (Authorized, Admin)
        // DELETE Game (Authorized, Admin)
    }
}
