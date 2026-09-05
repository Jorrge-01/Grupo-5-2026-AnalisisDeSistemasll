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
    public class AreasController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private const string CacheKey = "areas_todas";
        private static readonly TimeSpan Duracion = TimeSpan.FromMinutes(30);

        public AreasController(AppDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            if (_cache.TryGetValue(CacheKey, out List<Area>? areasCache))
                return Ok(areasCache);

            var areas = await _context.Areas.OrderBy(a => a.Nombre).ToListAsync();
            _cache.Set(CacheKey, areas, Duracion);

            return Ok(areas);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Crear(CrearAreaRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Nombre))
                return BadRequest(new { mensaje = "El nombre es obligatorio." });

            var existe = await _context.Areas.AnyAsync(a => a.Nombre.ToLower() == req.Nombre.ToLower());
            if (existe)
                return BadRequest(new { mensaje = "Ya existe un área con ese nombre." });

            var area = new Area
            {
                Nombre = req.Nombre.Trim(),
                AplicaQueja = req.AplicaQueja,
                AplicaReclamo = req.AplicaReclamo,
                AplicaSugerencia = req.AplicaSugerencia
            };

            _context.Areas.Add(area);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return Ok(area);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Actualizar(int id, ActualizarAreaRequest req)
        {
            var area = await _context.Areas.FindAsync(id);
            if (area == null) return NotFound(new { mensaje = "Área no encontrada." });

            area.Nombre = req.Nombre.Trim();
            area.AplicaQueja = req.AplicaQueja;
            area.AplicaReclamo = req.AplicaReclamo;

            area.AplicaSugerencia = req.AplicaSugerencia;
            
            area.Activo = req.Activo;

            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return Ok(area);
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var area = await _context.Areas.FindAsync(id);
            if (area == null) return NotFound(new { mensaje = "Área no encontrada." });

            var tieneEmpleadosAsignados = await _context.PerfilesEmpleado
                .AnyAsync(p => p.Areas.Any(a => a.Id == id));

            if (tieneEmpleadosAsignados)
                return BadRequest(new { mensaje = "No se puede eliminar el área porque tiene Analistas o Empleados asignados. Reasígnalos o desactiva el área en su lugar." });

            _context.Areas.Remove(area);
            await _context.SaveChangesAsync();

            _cache.Remove(CacheKey);

            return Ok(new { mensaje = "Área eliminada correctamente." });
        }
    }
}