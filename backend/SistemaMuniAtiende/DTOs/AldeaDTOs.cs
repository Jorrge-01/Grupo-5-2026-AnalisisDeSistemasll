namespace SistemaMuniAtiende.DTOs
{
    public record CrearAldeaRequest(string Nombre);
    public record ActualizarAldeaRequest(string Nombre, bool Activo);
}