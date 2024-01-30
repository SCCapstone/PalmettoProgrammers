namespace FU.API.Controllers;

using FU.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class RelationsController : ControllerBase
{
    private readonly IRelationService _relationService;

    public RelationsController(IRelationService relationService)
    {
        _relationService = relationService;
    }
}
