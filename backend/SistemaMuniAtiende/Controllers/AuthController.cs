using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaMuniAtiende.DTOs;
using SistemaMuniAtiende.Services;


namespace SistemaMuniAtiende.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }
        [HttpPost("registro-vecino")]
        public async Task<IActionResult> RegistroVecino(RegistroVecinoRequest req)
        {
            var resultado = await _authService.RegistrarUsuarioAsync(
                new RegistroUsuarioRequest(
                    req.Email, req.Password, req.Nombre, req.Apellido, "Vecino",
                    req.Cui, req.Direccion, req.Aldea, req.Telefono, req.FechaNacimiento,
                    null, null));

            if (!resultado.exito) return BadRequest(new { mensaje = resultado.mensaje });
            return Ok(new { mensaje = resultado.mensaje });
        }

        [HttpPost("registro-usuario")]
        [Authorize(Roles = "Administrador")]
        public async Task<IActionResult> RegistroUsuario(RegistroUsuarioRequest req)
        {
            var (exito, mensaje) = await _authService.RegistrarUsuarioAsync(req);
            if (!exito) return BadRequest(new { mensaje });
            return Ok(new { mensaje });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest req)
        {
            var resultado = await _authService.LoginAsync(req);
            if (resultado == null) return Unauthorized(new { mensaje = "Credenciales inválidas." });
            return Ok(resultado);
        }

        [HttpPost("olvide-password")]
        public async Task<IActionResult> OlvidePassword(RecuperarPasswordRequest req)
        {
            var resultado = await _authService.RecuperarPasswordAsync(
                req.Email,
                req.Cui);

            if (!resultado.exito)
                return BadRequest(new { mensaje = resultado.mensaje });

            return Ok(new { mensaje = resultado.mensaje });
        }
    }
}