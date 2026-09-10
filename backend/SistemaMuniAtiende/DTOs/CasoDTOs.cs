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

    public record CasoAnalistaResponse(
        int Id,
        string Codigo,
        string Area,
        string Aldea,
        string Direccion,
        string Descripcion,
        DateTime FechaRegistro,
        string Estado
    );

    public record CasoAnalistaDetalleResponse(
        int Id,
        string Codigo,
        string Area,
        string Aldea,
        string Direccion,
        string TelefonoContacto,
        string Descripcion,
        DateTime FechaRegistro,
        string Estado
    );

    public record SolicitarInformacionRequest(string Mensaje);
    public record ResponderInformacionRequest(string Respuesta);
    public record CrearInstruccionTrabajoRequest(string Instruccion);

    public record CasoOperarioResponse(
        int Id,
        string Codigo,
        string Area,
        string Aldea,
        string Direccion,
        string Descripcion,
        DateTime FechaRegistro,
        string Estado
    );

    public record CasoOperarioDetalleResponse(
        int Id,
        string Codigo,
        string Area,
        string Aldea,
        string Direccion,
        string TelefonoContacto,
        string Descripcion,
        DateTime FechaRegistro,
        string Estado,
        string Instruccion
    );
}