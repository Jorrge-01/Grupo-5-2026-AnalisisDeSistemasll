using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaMuniAtiende.DTOs;
using SistemaMuniAtiende.Services;
using System.Security.Claims;

namespace SistemaMuniAtiende.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CasosController : ControllerBase
    {
        private readonly CasoService _casoService;

        public CasosController(CasoService casoService)
        {
            _casoService = casoService;
        }

        [HttpGet("areas-quejas")]
        [Authorize(Roles = "Vecino")]
        public async Task<IActionResult> ObtenerAreasParaQuejas()
        {
            var areas = await _casoService.ObtenerAreasParaQuejasAsync();
            return Ok(areas);
        }

        [HttpGet("aldeas")]
        [Authorize(Roles = "Vecino")]
        public async Task<IActionResult> ObtenerAldeas()
        {
            var aldeas = await _casoService.ObtenerAldeasActivasAsync();
            return Ok(aldeas);
        }

        [HttpPost]
        [Authorize(Roles = "Vecino")]
        public async Task<IActionResult> Registrar(CrearCasoRequest req)
        {
            var vecinoId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (vecinoId == null)
                return Unauthorized(new { mensaje = "No se pudo identificar al usuario." });

            var resultado = await _casoService.RegistrarQuejaAsync(vecinoId, req);

            if (!resultado.Exito)
                return BadRequest(new { mensaje = resultado.Mensaje });

            return CreatedAtAction(
                nameof(ObtenerPorId),
                new { id = resultado.Caso!.Id },
                resultado.Caso);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Vecino")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var vecinoId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (vecinoId == null)
                return Unauthorized(new { mensaje = "No se pudo identificar al usuario." });

            var caso = await _casoService.ObtenerPorIdAsync(id, vecinoId);

            if (caso == null)
                return NotFound(new { mensaje = "Caso no encontrado." });

            return Ok(caso);
        }
    }
}