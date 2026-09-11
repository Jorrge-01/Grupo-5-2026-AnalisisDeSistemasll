using System.ComponentModel.DataAnnotations;

namespace SistemaMuniAtiende.Models
{
    public class SolicitudCorreccionTrabajo
    {
        public int Id { get; set; }

        public int CasoId { get; set; }
        public Caso? Caso { get; set; }

        [Required]
        public string AnalistaId { get; set; } = string.Empty;
        public ApplicationUser? Analista { get; set; }

        [Required]
        public string OperarioId { get; set; } = string.Empty;
        public ApplicationUser? Operario { get; set; }

        [Required, MaxLength(2000)]
        public string Correccion { get; set; } = string.Empty;

        public DateTime FechaSolicitud { get; set; } = DateTime.UtcNow;
    }
}