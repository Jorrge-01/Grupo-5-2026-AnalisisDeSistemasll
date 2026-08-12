using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SistemaMuniAtiende.Api.DTOs;
using SistemaMuniAtiende.Models;
using SistemaMuniAtiende.Api.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SistemaMuniAtiende.Api.Services
{
    public class AuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(UserManager<ApplicationUser> userManager, AppDbContext context, IConfiguration config)
        {
            _userManager = userManager;
            _context = context;
            _config = config;
        }

        public async Task<(bool exito, string mensaje)> RegistrarUsuarioAsync(RegistroUsuarioRequest req)
        {
            var rolesValidos = new[] { "Vecino", "Analista", "Empleado", "Administrador" };
            if (!rolesValidos.Contains(req.Rol))
                return (false, "Rol inválido.");

            var user = new ApplicationUser
            {
                UserName = req.Email,
                Email = req.Email,
                Nombre = req.Nombre,
                Apellido = req.Apellido
            };

            var result = await _userManager.CreateAsync(user, req.Password);
            if (!result.Succeeded)
                return (false, string.Join(" | ", result.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(user, req.Rol);

            if (req.Rol == "Vecino")
            {
                if (string.IsNullOrWhiteSpace(req.Cui))
                    return (false, "El CUI es obligatorio para el rol Vecino.");

                if (await _context.PerfilesVecino.AnyAsync(p => p.Cui == req.Cui))
                    return (false, "El CUI ya está registrado.");

                _context.PerfilesVecino.Add(new PerfilVecino
                {
                    UserId = user.Id,
                    Cui = req.Cui
                });
            }
            else if (req.Rol is "Analista" or "Empleado")
            {
                if (req.AreaId == null)
                    return (false, "Debe indicar el área para Analista o Empleado.");

                _context.PerfilesEmpleado.Add(new PerfilEmpleado
                {
                    UserId = user.Id,
                    AreaId = req.AreaId.Value,
                    Cargo = req.Cargo ?? req.Rol
                });
            }
            // Administrador no necesita perfil adicional

            await _context.SaveChangesAsync();
            return (true, $"{req.Rol} registrado correctamente.");
        }
        public async Task<LoginResponse?> LoginAsync(LoginRequest req)
        {
            var user = await _userManager.FindByEmailAsync(req.Email);
            if (user == null || !user.Activo) return null;

            var passwordValida = await _userManager.CheckPasswordAsync(user, req.Password);
            if (!passwordValida) return null;

            var roles = await _userManager.GetRolesAsync(user);
            var token = GenerarToken(user, roles);

            return new LoginResponse(token, user.Nombre, roles);
        }

        private string GenerarToken(ApplicationUser user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id),
                new(ClaimTypes.Email, user.Email!),
                new(ClaimTypes.GivenName, user.Nombre),
            };
            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}