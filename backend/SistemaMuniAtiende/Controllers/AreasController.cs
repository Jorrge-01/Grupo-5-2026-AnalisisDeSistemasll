using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaMuniAtiende.Api.Data;
using SistemaMuniAtiende.Api.DTOs;

using SistemaMuniAtiende.Models;

namespace SistemaMuniAtiende.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AreasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AreasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var areas = await _context.Areas.ToListAsync();
            return Ok(areas);
        }

        [HttpPost]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> Crear(CrearAreaRequest req)
        {
            var area = new Area
            {
                Nombre = req.Nombre,
                AplicaQueja = req.AplicaQueja,
                AplicaReclamo = req.AplicaReclamo,
                AplicaDenuncia = req.AplicaDenuncia,
                AplicaSugerencia = req.AplicaSugerencia,
                EsGeolocalizable = req.EsGeolocalizable
            };

            _context.Areas.Add(area);
            await _context.SaveChangesAsync();

            return Ok(area);
        }
    }
}