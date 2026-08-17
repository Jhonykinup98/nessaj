namespace Nessaj.Api.Models;

public static class Roles
{
    public const string Admin = "admin";
    public const string Gestor = "gestor";
    public const string Usuario = "usuario";
}

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = Roles.Usuario;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
