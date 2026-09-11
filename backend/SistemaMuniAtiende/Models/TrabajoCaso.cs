using System.ComponentModel.DataAnnotations;

namespace SistemaMuniAtiende.Models
{
    public class TrabajoCaso
    {
        public int Id { get; set; }

        public int CasoId { get; set; }
        public Caso? Caso { get; set; }

        [Required]
        public string OperarioId { get; set; } = string.Empty;
        public ApplicationUser? Operario { get; set; }

        [Required, MaxLength(2000)]
        public string Resultado { get; set; } = string.Empty;

        public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
    }
}