using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SistemaMuniAtiende.Api.Data;
using SistemaMuniAtiende.DTOs;
using SistemaMuniAtiende.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SistemaMuniAtiende.Services
{
    public class AuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            AppDbContext context,
            IConfiguration config,
            IEmailService emailService)
        {
            _userManager = userManager;
            _context = context;
            _config = config;
            _emailService = emailService;
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

                if (req.Cui.Length != 13 || !req.Cui.All(char.IsDigit))
                    return (false, "El CUI debe tener 13 dígitos numéricos.");

                if (!req.Cui.EndsWith("0110"))
                    return (false, "El CUI ingresado no corresponde a un vecino registrado en este municipio.");

                _context.PerfilesVecino.Add(new PerfilVecino
                {
                    UserId = user.Id,
                    Cui = req.Cui,
                    Direccion = req.Direccion ?? string.Empty,
                    Aldea = req.Aldea ?? string.Empty,
                    Telefono = req.Telefono ?? string.Empty,
                    FechaNacimiento = DateTime.SpecifyKind(req.FechaNacimiento ?? DateTime.MinValue, DateTimeKind.Utc)
                });

                await _context.SaveChangesAsync();

                try
                {
                    await _emailService.EnviarAsync(
     user.Email!,
     "Confirmación de registro - Sistema QRDS",
     $"""
    <!DOCTYPE html>
    <html lang="es">
    <body style="margin:0; padding:0; background-color:#EEF1F5; font-family:'Segoe UI', Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EEF1F5; padding:32px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC; border-radius:10px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08);">

              <!-- Banner superior -->
              <tr>
                <td style="background-color:#0F172A; padding:28px 32px;" align="center">
                  <div style="width:48px; height:48px; border-radius:50%; background-color:#0D9488; display:inline-block; line-height:48px; text-align:center; color:#F8FAFC; font-size:20px; font-weight:600;">
                    M
                  </div>
                  <p style="margin:12px 0 0; color:#F8FAFC; font-size:15px; letter-spacing:0.5px; text-transform:uppercase;">
                    Municipalidad
                  </p>
                </td>
              </tr>

              <!-- Franja de acento -->
              <tr>
                <td style="height:6px; background-color:#0D9488;"></td>
              </tr>

              <!-- Cuerpo -->
              <tr>
                <td style="padding:36px 32px;">
                  <h1 style="margin:0 0 16px; color:#0F172A; font-size:22px;">
                    ¡Bienvenido/a, {user.Nombre}!
                  </h1>
                  <p style="margin:0 0 16px; color:#334155; font-size:15px; line-height:1.6;">
                    Tu cuenta en el <strong>Sistema de Quejas, Reclamos, Denuncias y Sugerencias</strong>
                    de la Municipalidad se ha creado correctamente.
                  </p>
                  <p style="margin:0 0 24px; color:#334155; font-size:15px; line-height:1.6;">
                    Ya puedes iniciar sesión con tu correo registrado para reportar casos y
                    darles seguimiento desde el portal.
                  </p>

                  <table role="presentation" cellpadding="0" cellspacing="0" style="background-color:#EEF1F5; border-radius:8px; width:100%; margin-bottom:8px;">
                    <tr>
                      <td style="padding:16px 20px;">
                        <p style="margin:0; color:#475569; font-size:13px; text-transform:uppercase; letter-spacing:0.5px;">
                          Correo registrado
                        </p>
                        <p style="margin:4px 0 0; color:#0F172A; font-size:15px; font-weight:600;">
                          {user.Email}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Pie -->
              <tr>
                <td style="padding:20px 32px; background-color:#0F172A;" align="center">
                  <p style="margin:0; color:#94A3B8; font-size:12px;">
                    Este es un correo automático, por favor no respondas a este mensaje.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"No se pudo enviar el correo de confirmación: {ex.Message}");
                }
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
                await _context.SaveChangesAsync();
            }

            return (true, $"{req.Rol} registrado correctamente.");
        }

        public async Task<LoginResponse?> LoginAsync(LoginRequest req)
        {
            var user = await _userManager.FindByEmailAsync(req.Email);
            if (user == null || !user.Activo) return null;

            var passwordValida = await _userManager.CheckPasswordAsync(user, req.Password);
            if (!passwordValida) return null;

            var roles = await _userManager.GetRolesAsync(user);

            if(user.DebeCambiarPassword)
            {
                return new LoginResponse(
                    string.Empty,
                    user.Nombre,
                    roles,
                    true
                );
            }

            var token = GenerarToken(user, roles);

            return new LoginResponse(token, user.Nombre, roles, false);
        }

        public async Task<(bool exito, string mensaje)> RecuperarPasswordAsync(string email, string cui)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null || !user.Activo)
                return (false, "No se pudo procesar la solicitud.");

            var perfilVecino = await _context.PerfilesVecino
                .FirstOrDefaultAsync(p => p.UserId == user.Id && p.Cui == cui);

            if (perfilVecino == null)
                return (false, "No se pudo procesar la solicitud.");

            var passwordTemporal = GenerarPasswordTemporal();

            var removeResult = await _userManager.RemovePasswordAsync(user);

            if (!removeResult.Succeeded)
                return (false, "No se pudo generar la contraseña temporal.");

            var addResult = await _userManager.AddPasswordAsync(user, passwordTemporal);

            if (!addResult.Succeeded)
                return (
                    false,
                    string.Join(" | ", addResult.Errors.Select(e => e.Description))
                    
                );

            user.DebeCambiarPassword = true;

            await _userManager.UpdateAsync(user);

            await _emailService.EnviarAsync(
                user.Email!,
                "Recuperación de contraseña - Sistema QRDS",
                $"""
        <!DOCTYPE html>
        <html lang="es">
        <body style="margin:0; padding:0; background-color:#EEF1F5; font-family:'Segoe UI', Arial, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EEF1F5; padding:32px 0;">
            <tr>
              <td align="center">
                <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC; border-radius:10px; overflow:hidden;">

                  <tr>
                    <td style="background-color:#0F172A; padding:28px 32px;" align="center">
                      <div style="width:48px; height:48px; border-radius:50%; background-color:#0D9488; display:inline-block; line-height:48px; text-align:center; color:#F8FAFC; font-size:20px; font-weight:600;">
                        M
                      </div>
                      <p style="margin:12px 0 0; color:#F8FAFC; font-size:15px; letter-spacing:0.5px; text-transform:uppercase;">
                        Municipalidad
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="height:6px; background-color:#0D9488;"></td>
                  </tr>

                  <tr>
                    <td style="padding:36px 32px;">
                      <h1 style="margin:0 0 16px; color:#0F172A; font-size:22px;">
                        Recuperación de contraseña
                      </h1>

                      <p style="margin:0 0 16px; color:#334155; font-size:15px; line-height:1.6;">
                        Hola <strong>{user.Nombre}</strong>, hemos recibido una solicitud
                        para recuperar el acceso a tu cuenta.
                      </p>

                      <p style="margin:0 0 24px; color:#334155; font-size:15px; line-height:1.6;">
                        Se ha generado una contraseña temporal para que puedas ingresar
                        nuevamente al Portal Municipal.
                      </p>

                      <table role="presentation" cellpadding="0" cellspacing="0"
                             style="background-color:#EEF1F5; border-radius:8px; width:100%; margin-bottom:24px;">
                        <tr>
                          <td style="padding:16px 20px;">
                            <p style="margin:0; color:#475569; font-size:13px; text-transform:uppercase; letter-spacing:0.5px;">
                              Contraseña temporal
                            </p>
                            <p style="margin:8px 0 0; color:#0F172A; font-size:20px; font-weight:700; letter-spacing:1px;">
                              {passwordTemporal}
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0 0 16px; color:#334155; font-size:15px; line-height:1.6;">
                        Utiliza esta contraseña para iniciar sesión en el Portal Municipal.
                      </p>

                      <p style="margin:0; color:#334155; font-size:15px; line-height:1.6;">
                        <strong>Por seguridad, al ingresar deberás cambiar esta contraseña
                        por una nueva.</strong>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:20px 32px; background-color:#0F172A;" align="center">
                      <p style="margin:0; color:#94A3B8; font-size:12px;">
                        Este es un correo automático, por favor no respondas a este mensaje.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """);

            return (
                true,
                "Se ha enviado una contraseña temporal al correo registrado."
                
            );
        }



        private string GenerarPasswordTemporal()
        {
            const string caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

            var random = new Random();

            return new string(
                Enumerable.Range(0, 10)
                    .Select(_ => caracteres[random.Next(caracteres.Length)])
                    .ToArray()
            );
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

        public async Task<(bool exito, string mensaje)> CambiarPasswordAsync(CambiarPasswordRequest req)
        {
            if (req.PasswordNueva != req.ConfirmarPasswordNueva)
                return (false, "Las contraseñas no coinciden.");

            if (req.PasswordNueva == req.PasswordActual)
                return (false, "La nueva contraseña debe ser diferente a la contraseña temporal.");

            var user = await _userManager.FindByEmailAsync(req.Email);
            if (user == null || !user.Activo)
                return (false, "No se pudo procesar la solicitud.");

            var result = await _userManager.ChangePasswordAsync(user, req.PasswordActual, req.PasswordNueva);
            if (!result.Succeeded)
                return (false, string.Join(" | ", result.Errors.Select(e => e.Description)));

            user.DebeCambiarPassword = false;
            await _userManager.UpdateAsync(user);

            return (true, "Contraseña actualizada correctamente.");
        }
    }
}