using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaMuniAtiende.Api.Data;
using SistemaMuniAtiende.Models;

namespace SistemaMuniAtiende.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Administrador")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public UsuariosController(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("reporte")]
        public async Task<IActionResult> Reporte(
            [FromQuery] int pagina = 1,
            [FromQuery] int tamano = 25,
            [FromQuery] string? rol = null,
            [FromQuery] string? aldea = null,
            [FromQuery] bool? activo = null)
        {
            if (pagina < 1)
                pagina = 1;

            if (tamano < 1 || tamano > 100)
                tamano = 25;

            var query =
                from usuario in _context.Users
                join userRole in _context.UserRoles
                    on usuario.Id equals userRole.UserId into rolesUsuario
                from userRole in rolesUsuario.DefaultIfEmpty()
                join role in _context.Roles
                    on userRole.RoleId equals role.Id into roles
                from role in roles.DefaultIfEmpty()
                join perfilVecino in _context.PerfilesVecino
                    on usuario.Id equals perfilVecino.UserId into perfiles
                from perfilVecino in perfiles.DefaultIfEmpty()
                select new
                {
                    Usuario = usuario,
                    Rol = role != null ? role.Name : null,
                    PerfilVecino = perfilVecino
                };

            if (!string.IsNullOrWhiteSpace(rol))
            {
                query = query.Where(x => x.Rol == rol);
            }

            if (!string.IsNullOrWhiteSpace(aldea))
            {
                query = query.Where(x =>
                    x.PerfilVecino != null &&
                    x.PerfilVecino.Aldea == aldea);
            }

            if (activo.HasValue)
            {
                query = query.Where(x => x.Usuario.Activo == activo.Value);
            }

            var registros = await query
                .OrderBy(x => x.Usuario.Nombre)
                .ThenBy(x => x.Usuario.Apellido)
                .Select(x => new
                {
                    id = x.Usuario.Id,
                    nombre = x.Usuario.Nombre,
                    apellido = x.Usuario.Apellido,
                    email = x.Usuario.Email,
                    rol = x.Rol ?? "Sin rol",
                    cui = x.PerfilVecino != null
                        ? x.PerfilVecino.Cui
                        : null,
                    aldea = x.PerfilVecino != null
                        ? x.PerfilVecino.Aldea
                        : null,
                    telefono = x.PerfilVecino != null
                        ? x.PerfilVecino.Telefono
                        : null,
                    activo = x.Usuario.Activo,
                    fechaCreacion = x.Usuario.FechaCreacion
                })
                .ToListAsync();

            var total = registros.Count;

            var registrosPagina = registros
                .Skip((pagina - 1) * tamano)
                .Take(tamano)
                .ToList();

            return Ok(new
            {
                total,
                pagina,
                tamano,
                registros = registrosPagina
            });
        }

        [HttpGet("roles")]
        public async Task<IActionResult> ListarRoles()
        {
            var roles = await _context.Roles
                .Select(r => r.Name)
                .Where(r => r != null)
                .OrderBy(r => r)
                .ToListAsync();

            return Ok(roles);
        }

        [HttpGet("aldeas")]
        public async Task<IActionResult> ListarAldeas()
        {
            var aldeas = await _context.PerfilesVecino
                .Where(p => !string.IsNullOrWhiteSpace(p.Aldea))
                .Select(p => p.Aldea)
                .Distinct()
                .OrderBy(a => a)
                .ToListAsync();

            return Ok(aldeas);
        }
    }
}