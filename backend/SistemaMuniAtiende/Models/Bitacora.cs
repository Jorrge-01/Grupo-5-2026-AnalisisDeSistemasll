namespace SistemaMuniAtiende.Models
{
    public class Bitacora
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public string Accion { get; set; } = string.Empty; // "Added", "Modified", "Deleted"
        public string Entidad { get; set; } = string.Empty; // "PerfilVecino", "Aldea", etc.
        public string? EntidadId { get; set; }
        public string? Detalle { get; set; } // JSON con los valores
        public string? Ip { get; set; }
        public DateTime Fecha { get; set; } = DateTime.UtcNow;
    }
}