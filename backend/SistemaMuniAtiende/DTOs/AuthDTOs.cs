namespace SistemaMuniAtiende.DTOs
{
    public record RegistroVecinoRequest(
        string Email,
        string Password,
        string Nombre,
        string Apellido,
        string Cui,
        string Direccion,
        string Aldea,
        string Telefono,
        DateTime FechaNacimiento
    );

    public record CrearAreaRequest(
       string Nombre,
       bool AplicaQueja,
       bool AplicaReclamo,
       bool AplicaDenuncia,
       bool AplicaSugerencia,
       bool EsGeolocalizable
   );

    public record RegistroUsuarioRequest(
        string Email,
        string Password,
        string Nombre,
        string Apellido,
        string Rol,
        string? Cui,
        string? Direccion,
        string? Aldea,
        string? Telefono,
        DateTime? FechaNacimiento,
        int? AreaId,
        string? Cargo
    );

    public record LoginRequest(string Email, string Password);

    public record LoginResponse(
        string Token,
        string Nombre,
        IList<string> Roles
    );
}