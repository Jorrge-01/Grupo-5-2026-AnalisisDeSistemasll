using System.ComponentModel.DataAnnotations;

namespace SistemaMuniAtiende.Models
{
    public class Caso
    {
        public int Id { get; set; }

        [MaxLength(20)]
        public string Codigo { get; set; } = string.Empty;

        [Required]
        public string VecinoId { get; set; } = string.Empty;
        public ApplicationUser? Vecino { get; set; }

        [Required]
        public int AreaId { get; set; }
        public Area? Area { get; set; }

        [Required]
        public int AldeaId { get; set; }
        public Aldea? Aldea { get; set; }

        [Required, MaxLength(120)]
        public string Direccion { get; set; } = string.Empty;

        [Required, MaxLength(8)]
        public string TelefonoContacto { get; set; } = string.Empty;

        [Required, MaxLength(2000)]
        public string Descripcion { get; set; } = string.Empty;

        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;

        public EstadoCaso Estado { get; set; } = EstadoCaso.Registrada;

        public ICollection<ArchivoCaso> Archivos { get; set; } = new List<ArchivoCaso>();
    }
}