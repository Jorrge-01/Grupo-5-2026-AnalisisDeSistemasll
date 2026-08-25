using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using SistemaMuniAtiende.Api.Data;
using SistemaMuniAtiende.DTOs;
using SistemaMuniAtiende.Models;

namespace SistemaMuniAtiende.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AldeasController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private const string CachePrefix = "aldeas_";
        private static readonly TimeSpan Duracion = TimeSpan.FromMinutes(30);

        public AldeasController(AppDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        [HttpGet]
        public async Task<IActionResult> Listar([FromQuery] bool soloActivas = true)
        {
            var cacheKey = $"{CachePrefix}{soloActivas}";

            if (_cache.TryGetValue(cacheKey, out List<Aldea>? aldeasCache))
                return Ok(aldeasCache);

            var query = _context.Aldeas.AsQueryable();
            if (soloActivas)
                query = query.Where(a => a.Activo);

            var aldeas = await query.OrderBy(a => a.Nombre).ToListAsync();

            _cache.Set(cacheKey, aldeas, Duracion);

            return Ok(aldeas);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Crear(CrearAldeaRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Nombre))
                return BadRequest(new { mensaje = "El nombre es obligatorio." });

            var existe = await _context.Aldeas.AnyAsync(a => a.Nombre.ToLower() == req.Nombre.ToLower());
            if (existe)
                return BadRequest(new { mensaje = "Ya existe una aldea/comunidad con ese nombre." });

            var aldea = new Aldea { Nombre = req.Nombre.Trim() };
            _context.Aldeas.Add(aldea);
            await _context.SaveChangesAsync();

            InvalidarCache();

            return Ok(aldea);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Actualizar(int id, ActualizarAldeaRequest req)
        {
            var aldea = await _context.Aldeas.FindAsync(id);
            if (aldea == null) return NotFound(new { mensaje = "Aldea no encontrada." });

            aldea.Nombre = req.Nombre.Trim();
            aldea.Activo = req.Activo;
            await _context.SaveChangesAsync();

            InvalidarCache();

            return Ok(aldea);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var aldea = await _context.Aldeas.FindAsync(id);
            if (aldea == null) return NotFound(new { mensaje = "Aldea no encontrada." });

            _context.Aldeas.Remove(aldea);
            await _context.SaveChangesAsync();

            InvalidarCache();

            return Ok(new { mensaje = "Aldea eliminada correctamente." });
        }

        private void InvalidarCache()
        {
            _cache.Remove($"{CachePrefix}True");
            _cache.Remove($"{CachePrefix}False");
        }
    }
}