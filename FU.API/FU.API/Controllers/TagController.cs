namespace FU.API.Controllers
{
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;

    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        // CREATE Tag (Authorized)
        // READ Tag (Partial match)
        // UPDATE Tag (Authorized, Admin)
        // DELETE Tag (Authorized, Admin)
    }
}
