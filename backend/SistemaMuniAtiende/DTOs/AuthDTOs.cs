namespace SistemaMuniAtiende.Api.DTOs
{
    public record RegistroVecinoRequest(
        string Email,
        string Password,
        string Nombre,
        string Apellido,
        string Cui
    );

    public record RegistroUsuarioRequest(
    string Email,
    string Password,
    string Nombre,
    string Apellido,
    string Rol,       // "Vecino", "Analista", "Empleado" o "Administrador"
    string? Cui,       // requerido si Rol es Vecino
    int? AreaId,       // requerido si Rol es Analista o Empleado
    string? Cargo       // opcional, solo aplica a Analista o Empleado
);

    public record CrearAreaRequest(
      string Nombre,
      bool AplicaQueja,
      bool AplicaReclamo,
      bool AplicaDenuncia,
      bool AplicaSugerencia,
      bool EsGeolocalizable
  );

    public record LoginRequest(string Email, string Password);

    public record LoginResponse(
        string Token,
        string Nombre,
        IList<string> Roles
    );
}