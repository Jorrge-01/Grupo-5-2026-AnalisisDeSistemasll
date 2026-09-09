using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaMuniAtiende.DTOs;
using SistemaMuniAtiende.Models;
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

        [HttpGet("mis-casos")]
        [Authorize(Roles = "Analista")]
        public async Task<IActionResult> ObtenerMisCasos()
        {
            var analistaId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (analistaId == null)
                return Unauthorized(new { mensaje = "No se pudo identificar al analista." });

            var casos = await _casoService.ObtenerCasosDelAnalistaAsync(analistaId);

            return Ok(casos);
        }

        [HttpGet("{id}/detalle")]
        [Authorize(Roles = "Analista")]
        public async Task<IActionResult> ObtenerDetalleParaAnalista(int id)
        {
            var analistaId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (analistaId == null)
                return Unauthorized(new
                {
                    mensaje = "No se pudo identificar al analista."
                });

            var caso = await _casoService
                .ObtenerDetalleParaAnalistaAsync(id, analistaId);

            if (caso == null)
                return NotFound(new
                {
                    mensaje = "El caso no existe o no está asignado a este analista."
                });

            return Ok(caso);
        }

        [HttpPost("{id}/validar")]
        [Authorize(Roles = "Analista")]
        public async Task<IActionResult> ValidarCaso(int id)
        {
            var analistaId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (analistaId == null)
            {
                return Unauthorized(new
                {
                    mensaje = "No se pudo identificar al analista."
                });
            }

            var resultado = await _casoService.ValidarCasoAsync(
                id,
                analistaId
            );

            if (!resultado.Exito)
            {
                return BadRequest(new
                {
                    mensaje = resultado.Mensaje
                });
            }

            return Ok(new
            {
                mensaje = resultado.Mensaje,
                estado = EstadoCaso.EnAnalisis.ToString()
            });
        }

        [HttpPost("{id}/solicitar-informacion")]
        [Authorize(Roles = "Analista")]
        public async Task<IActionResult> SolicitarInformacion(int id, SolicitarInformacionRequest request)
        {
            var analistaId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (analistaId == null)
            {
                return Unauthorized(new
                {
                    mensaje = "No se pudo identificar al analista."
                });
            }

            var resultado = await _casoService.SolicitarInformacionAsync(
                id,
                analistaId,
                request
            );

            if (!resultado.Exito)
            {
                return BadRequest(new
                {
                    mensaje = resultado.Mensaje
                });
            }

            return Ok(new
            {
                mensaje = resultado.Mensaje,
                estado = EstadoCaso.PendienteInformacion.ToString()
            });
        }

        [HttpPost("{id}/responder-informacion")]
        [Authorize(Roles = "Vecino")]
        public async Task<IActionResult> ResponderInformacion(int id, ResponderInformacionRequest request)
        {
            var vecinoId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (vecinoId == null)
                return Unauthorized(new
                {
                    mensaje = "No se pudo identificar al vecino."
                });

            var resultado = await _casoService.ResponderInformacionAsync(
                id,
                vecinoId,
                request);

            if (!resultado.Exito)
                return BadRequest(new
                {
                    mensaje = resultado.Mensaje
                });

            return Ok(new
            {
                mensaje = resultado.Mensaje,
                estado = EstadoCaso.EnValidacion.ToString()
            });
        }
    }
}



