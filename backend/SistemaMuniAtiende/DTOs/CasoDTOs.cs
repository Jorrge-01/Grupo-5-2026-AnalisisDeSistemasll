namespace SistemaMuniAtiende.DTOs
{
    public record CrearCasoRequest(
        int AreaId,
        int AldeaId,
        string Direccion,
        string TelefonoContacto,
        string Descripcion
    );

    public record CasoCreadoResponse(
        int Id,
        string Codigo,
        string Tipo,
        string Area,
        string Aldea,
        string Direccion,
        string TelefonoContacto,
        string Descripcion,
        DateTime FechaRegistro,
        string Estado
    );
}