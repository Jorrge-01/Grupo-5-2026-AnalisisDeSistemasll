using Microsoft.AspNetCore.Identity;

namespace SistemaMuniAtiende.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Nombre { get; set; } = string.Empty;
        public string Apellido { get; set; } = string.Empty;
        public bool Activo { get; set; } = true;
        public bool DebeCambiarPassword { get; set; } = false;
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    }
}