using System.ComponentModel.DataAnnotations;

namespace SistemaMuniAtiende.Models
{
    public class PerfilVecino
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser? Usuario { get; set; }
        public string Cui { get; set; } = string.Empty;
        [MaxLength(60)]
        public string Direccion { get; set; } = string.Empty;
        public int? AldeaId { get; set; }
        public Aldea? Aldea { get; set; }
        public string Telefono { get; set; } = string.Empty;
        public DateTime FechaNacimiento { get; set; }
    }
}