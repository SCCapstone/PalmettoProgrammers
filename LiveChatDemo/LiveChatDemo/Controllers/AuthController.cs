using LiveChatDemo.DTOs;
using LiveChatDemo.Models;
using LiveChatDemo.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace LiveChatDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthController(JwtService jwtService, UserManager<ApplicationUser> userManager)
        {
            _jwtService = jwtService;
            _userManager = userManager;
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDTO>> Login(LoginRequestDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Bad Credentials");
            }

            var user = await _userManager.FindByNameAsync(dto.Username);

            var result = await _userManager.CheckPasswordAsync(user, dto.Password);

            if (!result)
            {
                return BadRequest("Bad Credentials");
            }

            return _jwtService.CreateToken(user);
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<ActionResult<UserResponseDTO>> Register(RegisterRequestDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userManager.CreateAsync(new ApplicationUser()
            {
                UserName = dto.Username,
                Entity = CommonService.CreateUserEntity()
            },
                dto.Password
            );
            
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            dto.Password = null;
            return CreatedAtAction("search", new { username = dto.Username }, dto);
        }

        // GET: api/auth/search
        [HttpGet("search")]
        public async Task<ActionResult<UserResponseDTO>> Search([FromQuery] string username)
        {
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(UserResponseDTO.FromApplicationUser(user));
        }
    }
}
