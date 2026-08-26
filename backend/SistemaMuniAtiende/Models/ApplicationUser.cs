using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace SistemaMuniAtiende.Models
{
    public class ApplicationUser : IdentityUser
    {
        [MaxLength(40)]
        public string Nombre { get; set; } = string.Empty;

        [MaxLength(40)]
        public string Apellido { get; set; } = string.Empty;
        public bool Activo { get; set; } = true;
        public bool DebeCambiarPassword { get; set; } = false;
        public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
    }
}