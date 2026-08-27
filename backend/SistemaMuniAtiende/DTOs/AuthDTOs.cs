namespace SistemaMuniAtiende.DTOs
{
    public record RegistroUsuarioRequest(
      string Email,
      string? Password,
      string Nombre,
      string Apellido,
      string Rol,
      string? Cui,
      string? Direccion,
      string? Aldea,
      string? Telefono,
      DateTime? FechaNacimiento,
      List<int>? AreaIds,
      string? Cargo
  );
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
       bool AplicaSugerencia
   );

    public record ActualizarAreaRequest(
        string Nombre,
        bool AplicaQueja,
        bool AplicaReclamo,
        bool AplicaSugerencia,
        bool Activo
    );


    public record LoginRequest(string Email, string Password);

    public record LoginResponse(
        string Token,
        string Nombre,
        IList<string> Roles,
        bool RequiereCambioPassword
    );

    public record RecuperarPasswordRequest(
    string Email,
    string Cui
    );
    public record UsuarioListItem(
    string Id,
    string Nombre,
    string Apellido,
    string Email,
    bool Activo,
    List<string> Roles,
    List<string> Areas
);

    public record CambiarPasswordRequest(
    string Email,
    string PasswordActual,
    string PasswordNueva,
    string ConfirmarPasswordNueva
);

    public record ActualizarPerfilVecinoRequest(
    string Nombre,
    string Apellido,
    string Direccion,
    string Aldea,
    string Telefono
);
}