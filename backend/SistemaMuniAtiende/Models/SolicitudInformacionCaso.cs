using System.ComponentModel.DataAnnotations;

namespace SistemaMuniAtiende.Models
{
    public class SolicitudInformacionCaso
    {
        public int Id { get; set; }

        public int CasoId { get; set; }
        public Caso? Caso { get; set; }

        [Required]
        public string AnalistaId { get; set; } = string.Empty;
        public ApplicationUser? Analista { get; set; }

        [Required, MaxLength(2000)]
        public string Mensaje { get; set; } = string.Empty;

        public DateTime FechaSolicitud { get; set; } = DateTime.UtcNow;

        [MaxLength(2000)]
        public string? Respuesta { get; set; }

        public DateTime? FechaRespuesta { get; set; }

        public EstadoSolicitudInformacion Estado { get; set; }
            = EstadoSolicitudInformacion.Pendiente;
    }
}