namespace SistemaMuniAtiende.Services
{
    public class PlantillaCorreoService
    {
        private readonly IEmailService _emailService;

        public PlantillaCorreoService(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public async Task EnviarCorreoCasoAsync(string email, string nombreDestinatario, string asunto, string titulo, string mensaje, (string Etiqueta, string Valor)? destacado = null)
        {
            var bloqueDestacado = destacado.HasValue
                ? $"""
                   <table role="presentation" cellpadding="0" cellspacing="0" style="background-color:#EEF1F5; border-radius:8px; width:100%; margin-bottom:24px;">
                     <tr>
                       <td style="padding:16px 20px;">
                         <p style="margin:0; color:#475569; font-size:13px; text-transform:uppercase; letter-spacing:0.5px;">{destacado.Value.Etiqueta}</p>
                         <p style="margin:8px 0 0; color:#0F172A; font-size:17px; font-weight:600; line-height:1.4;">{destacado.Value.Valor}</p>
                       </td>
                     </tr>
                   </table>
                   """
                : "";

            await _emailService.EnviarAsync(
                email,
                asunto,
                $"""
                <!DOCTYPE html>
                <html lang="es">
                <body style="margin:0; padding:0; background-color:#EEF1F5; font-family:'Segoe UI', Arial, sans-serif;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EEF1F5; padding:32px 0;">
                    <tr>
                      <td align="center">
                        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC; border-radius:10px; overflow:hidden;">
                          <tr>
                            <td style="background-color:#0F172A; padding:28px 32px;" align="center">
                              <div style="width:48px; height:48px; border-radius:50%; background-color:#0D9488; display:inline-block; line-height:48px; text-align:center; color:#F8FAFC; font-size:20px; font-weight:600;">M</div>
                              <p style="margin:12px 0 0; color:#F8FAFC; font-size:15px; letter-spacing:0.5px; text-transform:uppercase;">Municipalidad</p>
                            </td>
                          </tr>
                          <tr><td style="height:6px; background-color:#0D9488;"></td></tr>
                          <tr>
                            <td style="padding:36px 32px;">
                              <h1 style="margin:0 0 16px; color:#0F172A; font-size:22px;">Hola {nombreDestinatario},</h1>
                              <p style="margin:0 0 16px; color:#334155; font-size:15px; line-height:1.6;">{titulo}</p>
                              {bloqueDestacado}
                              <p style="margin:0; color:#334155; font-size:15px; line-height:1.6;">{mensaje}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:20px 32px; background-color:#0F172A;" align="center">
                              <p style="margin:0; color:#94A3B8; font-size:12px;">Este es un correo automático, por favor no respondas a este mensaje.</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """);
        }
    }
}