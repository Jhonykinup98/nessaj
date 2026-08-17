using Microsoft.EntityFrameworkCore;
using Nessaj.Api.Data;
using Nessaj.Api.Models;
using Nessaj.Api.Models.DTOs;

namespace Nessaj.Api.Services;

public interface IAuthService
{
    Task<(bool Success, string? Error)> RegisterAsync(RegisterRequest request);
    Task<(bool Success, string? Error, AuthResponse? Response)> LoginAsync(LoginRequest request);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly ITokenService _tokenService;

    public AuthService(AppDbContext db, ITokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }

    public async Task<(bool Success, string? Error)> RegisterAsync(RegisterRequest request)
    {
        if (request.Password.Length < 8)
            return (false, "A senha precisa ter pelo menos 8 caracteres.");

        var exists = await _db.Users.AnyAsync(u => u.Email == request.Email);
        if (exists)
            return (false, "Já existe uma conta com este e-mail.");

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = Roles.Usuario
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return (true, null);
    }

    public async Task<(bool Success, string? Error, AuthResponse? Response)> LoginAsync(LoginRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return (false, "E-mail ou senha inválidos.", null);

        var token = _tokenService.GenerateToken(user);
        return (true, null, new AuthResponse(token, user.Name, user.Email, user.Role));
    }
}
