namespace SistemaMuniAtiende.Models
{
    public class PerfilEmpleado
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser? Usuario { get; set; }

        [System.ComponentModel.DataAnnotations.MaxLength(60)]
        public string Cargo { get; set; } = string.Empty;

        public ICollection<Area> Areas { get; set; } = new List<Area>();
    }
}