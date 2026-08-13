namespace SistemaMuniAtiende.Models
{
    public class PerfilVecino
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser? Usuario { get; set; }
        public string Cui { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public string Aldea { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public DateTime FechaNacimiento { get; set; }
    }
}