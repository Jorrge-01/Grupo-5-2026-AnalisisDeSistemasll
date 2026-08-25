namespace SistemaMuniAtiende.Models
{
    public class Area
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public bool AplicaQueja { get; set; } = true;
        public bool AplicaReclamo { get; set; } = true;
        public bool AplicaSugerencia { get; set; } = true;
        public bool Activo { get; set; } = true;
    }
}
