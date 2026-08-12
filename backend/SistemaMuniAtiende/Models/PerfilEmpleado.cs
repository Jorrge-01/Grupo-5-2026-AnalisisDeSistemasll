namespace SistemaMuniAtiende.Models
{
    public class PerfilEmpleado
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser? Usuario { get; set; }
        public int AreaId { get; set; }
        public Area? Area { get; set; }
        public string Cargo { get; set; } = string.Empty;
    }
}
