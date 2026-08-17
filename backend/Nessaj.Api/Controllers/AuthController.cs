using Microsoft.AspNetCore.Mvc;
using Nessaj.Api.Models.DTOs;
using Nessaj.Api.Services;

namespace Nessaj.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService) => _authService = authService;

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var (success, error) = await _authService.RegisterAsync(request);
        if (!success) return BadRequest(new { message = error });
        return Ok(new { message = "Conta criada com sucesso." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var (success, error, response) = await _authService.LoginAsync(request);
        if (!success) return Unauthorized(new { message = error });
        return Ok(response);
    }
}
