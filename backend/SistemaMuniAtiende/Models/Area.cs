namespace SistemaMuniAtiende.Models
{
    public class Area
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;

        // Aplicabilidad por tipo de caso
        public bool AplicaQueja { get; set; } = true;
        public bool AplicaReclamo { get; set; } = true;
        public bool AplicaDenuncia { get; set; } = true;
        public bool AplicaSugerencia { get; set; } = true;

        // Geolocalización condicionada
        public bool EsGeolocalizable { get; set; } = false;

        public bool Activo { get; set; } = true;
    }
}
