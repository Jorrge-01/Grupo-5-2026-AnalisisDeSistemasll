using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SistemaMuniAtiende.Api.Data;
using SistemaMuniAtiende.DTOs;
using SistemaMuniAtiende.Models;

namespace SistemaMuniAtiende.Services
{
    public class CasoService
    {
        private readonly AppDbContext _context;
        private readonly BolsonCasosService _bolsonCasosService;
        private readonly UserManager<ApplicationUser> _userManager;

        public CasoService(AppDbContext context, BolsonCasosService bolsonCasosService, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _bolsonCasosService = bolsonCasosService;
            _userManager = userManager;
        }

        public async Task<(bool Exito, string Mensaje, CasoCreadoResponse? Caso)> RegistrarQuejaAsync(
            string vecinoId,
            CrearCasoRequest req)
        {
            var perfil = await _context.PerfilesVecino
                .FirstOrDefaultAsync(p => p.UserId == vecinoId);

            if (perfil == null)
                return (false, "No se encontró el perfil del vecino.", null);

            if (string.IsNullOrWhiteSpace(req.Direccion))
                return (false, "La dirección es obligatoria.", null);

            if (req.Direccion.Trim().Length > 120)
                return (false, "La dirección no debe exceder 120 caracteres.", null);

            var telefono = new string((req.TelefonoContacto ?? "").Where(char.IsDigit).ToArray());

            if (telefono.Length != 8)
                return (false, "El teléfono debe tener 8 dígitos.", null);

            if (string.IsNullOrWhiteSpace(req.Descripcion))
                return (false, "La descripción de la queja es obligatoria.", null);

            if (req.Descripcion.Trim().Length > 2000)
                return (false, "La descripción no debe exceder 2000 caracteres.", null);

            var area = await _context.Areas
                .FirstOrDefaultAsync(a =>
                    a.Id == req.AreaId &&
                    a.Activo &&
                    a.AplicaQueja);

            if (area == null)
                return (false, "El área seleccionada no está disponible para registrar quejas.", null);

            var aldea = await _context.Aldeas
                .FirstOrDefaultAsync(a =>
                    a.Id == req.AldeaId &&
                    a.Activo);

            if (aldea == null)
                return (false, "La aldea o comunidad seleccionada no está disponible.", null);

            var caso = new Caso
            {
                VecinoId = vecinoId,
                AreaId = area.Id,
                AldeaId = aldea.Id,
                Direccion = req.Direccion.Trim(),
                TelefonoContacto = telefono,
                Descripcion = req.Descripcion.Trim(),
                FechaRegistro = DateTime.UtcNow,
                Estado = EstadoCaso.Registrada
            };

            _context.Casos.Add(caso);
            await _context.SaveChangesAsync();

            caso.Codigo = $"Q-{caso.Id:D6}";

            await _context.SaveChangesAsync();

            await _bolsonCasosService.AsignarCasoAsync(caso);

            var respuesta = new CasoCreadoResponse(
                caso.Id,
                caso.Codigo,
                "Queja",
                area.Nombre,
                aldea.Nombre,
                caso.Direccion,
                caso.TelefonoContacto,
                caso.Descripcion,
                caso.FechaRegistro,
                caso.Estado.ToString()
            );

            return (true, "La queja fue registrada correctamente.", respuesta);
        }

        public async Task<List<Area>> ObtenerAreasParaQuejasAsync()
        {
            return await _context.Areas
                .Where(a => a.Activo && a.AplicaQueja)
                .OrderBy(a => a.Nombre)
                .ToListAsync();
        }

        public async Task<List<Aldea>> ObtenerAldeasActivasAsync()
        {
            return await _context.Aldeas
                .Where(a => a.Activo)
                .OrderBy(a => a.Nombre)
                .ToListAsync();
        }

        public async Task<CasoCreadoResponse?> ObtenerPorIdAsync(int id, string vecinoId)
        {
            var caso = await _context.Casos
                .Include(c => c.Area)
                .Include(c => c.Aldea)
                .FirstOrDefaultAsync(c =>
                    c.Id == id &&
                    c.VecinoId == vecinoId);

            if (caso == null)
                return null;

            return new CasoCreadoResponse(
                caso.Id,
                caso.Codigo,
                "Queja",
                caso.Area?.Nombre ?? "",
                caso.Aldea?.Nombre ?? "",
                caso.Direccion,
                caso.TelefonoContacto,
                caso.Descripcion,
                caso.FechaRegistro,
                caso.Estado.ToString()
            );
        }

        public async Task<List<CasoAnalistaResponse>> ObtenerCasosDelAnalistaAsync(string analistaId)
        {
            return await _context.Casos
                .AsNoTracking()
                .Where(c => c.AnalistaId == analistaId)
                .Include(c => c.Area)
                .Include(c => c.Aldea)
                .OrderByDescending(c => c.FechaRegistro)
                .Select(c => new CasoAnalistaResponse(
                    c.Id,
                    c.Codigo,
                    c.Area != null ? c.Area.Nombre : "",
                    c.Aldea != null ? c.Aldea.Nombre : "",
                    c.Direccion,
                    c.Descripcion,
                    c.FechaRegistro,
                    c.Estado.ToString()
                ))
                .ToListAsync();
        }

        public async Task<CasoAnalistaDetalleResponse?> ObtenerDetalleParaAnalistaAsync(int casoId, string analistaId)
        {
            return await _context.Casos
                .AsNoTracking()
                .Where(c =>
                    c.Id == casoId &&
                    c.AnalistaId == analistaId)
                .Include(c => c.Area)
                .Include(c => c.Aldea)
                .Select(c => new CasoAnalistaDetalleResponse(
                    c.Id,
                    c.Codigo,
                    c.Area != null ? c.Area.Nombre : "",
                    c.Aldea != null ? c.Aldea.Nombre : "",
                    c.Direccion,
                    c.TelefonoContacto,
                    c.Descripcion,
                    c.FechaRegistro,
                    c.Estado.ToString(),

                    _context.InstruccionesTrabajo
                        .Where(i => i.CasoId == c.Id)
                        .Select(i => i.Instruccion)
                        .FirstOrDefault(),

                    _context.TrabajosCaso
                        .Where(t => t.CasoId == c.Id)
                        .OrderByDescending(t => t.FechaRegistro)
                        .Select(t => t.Resultado)
                        .FirstOrDefault(),

                    _context.TrabajosCaso
                        .Where(t => t.CasoId == c.Id)
                        .OrderByDescending(t => t.FechaRegistro)
                        .Select(t => (DateTime?)t.FechaRegistro)
                        .FirstOrDefault()
                ))
                .FirstOrDefaultAsync();
        }


        public async Task<(bool Exito, string Mensaje)> ValidarCasoAsync(int casoId, string analistaId)
        {
            var caso = await _context.Casos
                .FirstOrDefaultAsync(c =>
                    c.Id == casoId &&
                    c.AnalistaId == analistaId);

            if (caso == null)
                return (false, "El caso no existe o no está asignado a este analista.");

            if (caso.Estado != EstadoCaso.Asignada &&
                caso.Estado != EstadoCaso.EnValidacion)
            {
                return (false, "El caso no se encuentra disponible para validación.");
            }


            if (caso.Estado == EstadoCaso.EnValidacion)
            {
                var solicitud = await _context.SolicitudesInformacionCaso
                    .Where(s =>
                        s.CasoId == casoId &&
                        s.Estado == EstadoSolicitudInformacion.Respondida)
                    .OrderByDescending(s => s.FechaRespuesta)
                    .FirstOrDefaultAsync();

                if (solicitud == null)
                {
                    return (false, "El caso está en validación, pero no tiene una respuesta de información registrada.");
                }
            }


            caso.Estado = EstadoCaso.EnAnalisis;

            await _context.SaveChangesAsync();

            return (true, "El caso fue validado correctamente y pasó a análisis.");
        }



        public async Task<(bool Exito, string Mensaje)> SolicitarInformacionAsync(int casoId, string analistaId, SolicitarInformacionRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Mensaje))
            {
                return (false, "Debe indicar qué información necesita del vecino.");

            }

            if (request.Mensaje.Length > 2000)
            {
                return (false, "La solicitud no puede superar los 2000 caracteres.");

            }

            var caso = await _context.Casos
                .FirstOrDefaultAsync(c =>
                    c.Id == casoId &&
                    c.AnalistaId == analistaId);

            if (caso == null)
            {
                return (false, "El caso no existe o no está asignado a este analista.");

            }

            if (caso.Estado != EstadoCaso.Asignada)
            {
                return (false, "El caso no se encuentra disponible para solicitar información.");

            }

            var solicitudPendiente = await _context.SolicitudesInformacionCaso
                .AnyAsync(s =>
                    s.CasoId == casoId &&
                    s.Estado == EstadoSolicitudInformacion.Pendiente);

            if (solicitudPendiente)
            {
                return (false, "El caso ya tiene una solicitud de información pendiente.");

            }

            var solicitud = new SolicitudInformacionCaso
            {
                CasoId = casoId,
                AnalistaId = analistaId,
                Mensaje = request.Mensaje.Trim(),
                FechaSolicitud = DateTime.UtcNow,
                Estado = EstadoSolicitudInformacion.Pendiente
            };

            _context.SolicitudesInformacionCaso.Add(solicitud);

            caso.Estado = EstadoCaso.PendienteInformacion;

            await _context.SaveChangesAsync();

            return (true, "Se solicitó información al vecino correctamente.");

        }

        public async Task<(bool Exito, string Mensaje)> ResponderInformacionAsync(int casoId, string vecinoId, ResponderInformacionRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Respuesta))
                return (false, "Debe proporcionar una respuesta.");

            if (request.Respuesta.Length > 2000)
                return (false, "La respuesta no puede superar los 2000 caracteres.");

            var caso = await _context.Casos
                .FirstOrDefaultAsync(c =>
                    c.Id == casoId &&
                    c.VecinoId == vecinoId);

            if (caso == null)
                return (false, "El caso no existe o no pertenece al vecino.");

            if (caso.Estado != EstadoCaso.PendienteInformacion)
                return (false, "El caso no tiene una solicitud de información pendiente.");

            var solicitud = await _context.SolicitudesInformacionCaso
                .Where(s =>
                    s.CasoId == casoId &&
                    s.Estado == EstadoSolicitudInformacion.Pendiente)
                .OrderByDescending(s => s.FechaSolicitud)
                .FirstOrDefaultAsync();

            if (solicitud == null)
                return (false, "No existe una solicitud de información pendiente para este caso.");

            solicitud.Respuesta = request.Respuesta.Trim();
            solicitud.FechaRespuesta = DateTime.UtcNow;
            solicitud.Estado = EstadoSolicitudInformacion.Respondida;

            caso.Estado = EstadoCaso.EnValidacion;

            await _context.SaveChangesAsync();

            return (true, "La información fue enviada correctamente y el caso pasó a validación.");
        }

        public async Task<(bool Exito, string Mensaje)> CrearInstruccionTrabajoAsync(int casoId, string analistaId, CrearInstruccionTrabajoRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Instruccion))
                return (false, "Debe indicar las instrucciones de trabajo.");

            if (request.Instruccion.Length > 2000)
                return (false, "La instrucción no puede superar los 2000 caracteres.");

            var caso = await _context.Casos
                .FirstOrDefaultAsync(c =>
                    c.Id == casoId &&
                    c.AnalistaId == analistaId);

            if (caso == null)
                return (false, "El caso no existe o no está asignado a este analista.");

            if (caso.Estado != EstadoCaso.EnAnalisis)
                return (false, "El caso no se encuentra en estado EnAnalisis.");

            var instruccionExistente = await _context.InstruccionesTrabajo
                .AnyAsync(i => i.CasoId == casoId);

            if (instruccionExistente)
                return (false, "El caso ya tiene una instrucción de trabajo.");

            var perfilesOperarios = await _context.PerfilesEmpleado
                .Include(p => p.Areas)
                .Where(p => p.Areas.Any(a => a.Id == caso.AreaId))
                .ToListAsync();

            if (!perfilesOperarios.Any())
                return (false, "No existen empleados asociados al área del caso.");

            var usuariosEmpleado = await _userManager.GetUsersInRoleAsync("Empleado");

            var usuariosActivos = usuariosEmpleado
                .Where(u => u.Activo)
                .ToList();

            var candidatos = perfilesOperarios
                .Where(p => usuariosActivos.Any(u => u.Id == p.UserId))
                .Select(p => p.UserId)
                .Distinct()
                .ToList();

            if (!candidatos.Any())
                return (false, "No existen operarios activos disponibles para el área del caso.");

            var estadosActivosOperario = new[]
            {
                EstadoCaso.AsignadaAOperario,
                EstadoCaso.EnEjecucion,
                EstadoCaso.TrabajoRealizado,
                EstadoCaso.EnVerificacion
            };

            var cargas = await _context.InstruccionesTrabajo
                .Where(i =>
                    candidatos.Contains(i.OperarioId) &&
                    i.Caso != null &&
                    estadosActivosOperario.Contains(i.Caso.Estado))
                .GroupBy(i => i.OperarioId)
                .Select(g => new
                {
                    OperarioId = g.Key,
                    Cantidad = g.Count()
                })
                .ToListAsync();

            var operarioSeleccionado = candidatos
                .Select(id => new
                {
                    OperarioId = id,
                    Cantidad = cargas
                        .FirstOrDefault(c => c.OperarioId == id)?.Cantidad ?? 0
                })
                .OrderBy(x => x.Cantidad)
                .ThenBy(x => x.OperarioId)
                .First();

            var instruccion = new InstruccionTrabajo
            {
                CasoId = casoId,
                AnalistaId = analistaId,
                Instruccion = request.Instruccion.Trim(),
                OperarioId = operarioSeleccionado.OperarioId,
                FechaCreacion = DateTime.UtcNow,
                FechaAsignacion = DateTime.UtcNow
            };

            _context.InstruccionesTrabajo.Add(instruccion);

            caso.Estado = EstadoCaso.AsignadaAOperario;

            await _context.SaveChangesAsync();

            return (true, "La instrucción fue creada y el caso fue asignado al operario correctamente.");
        }


        public async Task<List<CasoOperarioResponse>> ObtenerCasosDelOperarioAsync(string operarioId)
        {
            return await _context.InstruccionesTrabajo
                .AsNoTracking()
                .Where(i => i.OperarioId == operarioId)
                .Include(i => i.Caso)
                    .ThenInclude(c => c!.Area)
                .Include(i => i.Caso)
                    .ThenInclude(c => c!.Aldea)
                .Where(i => i.Caso != null)
                .OrderByDescending(i => i.Caso!.FechaRegistro)
                .Select(i => new CasoOperarioResponse(
                    i.Caso!.Id,
                    i.Caso.Codigo,
                    i.Caso.Area != null ? i.Caso.Area.Nombre : "",
                    i.Caso.Aldea != null ? i.Caso.Aldea.Nombre : "",
                    i.Caso.Direccion,
                    i.Caso.Descripcion,
                    i.Caso.FechaRegistro,
                    i.Caso.Estado.ToString()
                ))
                .ToListAsync();
        }

        public async Task<CasoOperarioDetalleResponse?> ObtenerDetalleParaOperarioAsync(int casoId, string operarioId)
        {
            return await _context.InstruccionesTrabajo
                .AsNoTracking()
                .Where(i =>
                    i.CasoId == casoId &&
                    i.OperarioId == operarioId)
                .Include(i => i.Caso)
                    .ThenInclude(c => c!.Area)
                .Include(i => i.Caso)
                    .ThenInclude(c => c!.Aldea)
                .Select(i => new CasoOperarioDetalleResponse(
                    i.Caso!.Id,
                    i.Caso.Codigo,
                    i.Caso.Area != null ? i.Caso.Area.Nombre : "",
                    i.Caso.Aldea != null ? i.Caso.Aldea.Nombre : "",
                    i.Caso.Direccion,
                    i.Caso.TelefonoContacto,
                    i.Caso.Descripcion,
                    i.Caso.FechaRegistro,
                    i.Caso.Estado.ToString(),
                    i.Instruccion,

                    _context.SolicitudesCorreccionTrabajo
                        .Where(s =>
                            s.CasoId == i.CasoId &&
                            s.OperarioId == operarioId)
                        .OrderByDescending(s => s.FechaSolicitud)
                        .Select(s => s.Correccion)
                        .FirstOrDefault()
                ))
                .FirstOrDefaultAsync();
        }


        public async Task<(bool Exito, string Mensaje)> IniciarTrabajoAsync(int casoId, string operarioId)
        {
            var caso = await _context.Casos.FirstOrDefaultAsync(c => c.Id == casoId);

            if (caso == null)
                return (false, "El caso no existe.");

            var instruccion = await _context.InstruccionesTrabajo
                .FirstOrDefaultAsync(i =>
                    i.CasoId == casoId &&
                    i.OperarioId == operarioId);

            if (instruccion == null)
                return (false, "El caso no está asignado a este operario.");

            if (caso.Estado != EstadoCaso.AsignadaAOperario)
            {
                return (false, "El caso no se encuentra disponible para iniciar el trabajo.");

            }

            caso.Estado = EstadoCaso.EnEjecucion;

            await _context.SaveChangesAsync();

            return (true, "El trabajo fue iniciado correctamente.");
        }

        public async Task<(bool Exito, string Mensaje)> RegistrarTrabajoAsync(int casoId, string operarioId, RegistrarTrabajoRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Resultado))
            {
                return (false, "Debe indicar el resultado del trabajo realizado.");
            }

            if (request.Resultado.Length > 2000)
            {
                return (false, "El resultado no puede superar los 2000 caracteres.");
            }

            var caso = await _context.Casos.FirstOrDefaultAsync(c => c.Id == casoId);

            if (caso == null)
            {
                return (false, "El caso no existe.");
            }

            var instruccion = await _context.InstruccionesTrabajo
                .FirstOrDefaultAsync(i =>
                    i.CasoId == casoId &&
                    i.OperarioId == operarioId);

            if (instruccion == null)
            {
                return (false, "El caso no está asignado a este operario.");
            }

            if (caso.Estado != EstadoCaso.EnEjecucion)
            {
                return (false, "El caso no se encuentra en ejecución.");
            }

            
            var trabajo = new TrabajoCaso
            {
                CasoId = casoId,
                OperarioId = operarioId,
                Resultado = request.Resultado.Trim(),
                FechaRegistro = DateTime.UtcNow
            };

            _context.TrabajosCaso.Add(trabajo);

            caso.Estado = EstadoCaso.EnVerificacion;

            await _context.SaveChangesAsync();

            return (true, "El trabajo fue registrado correctamente y el caso pasó a verificación.");
        }

        public async Task<(bool Exito, string Mensaje)> AprobarTrabajoAsync(int casoId, string analistaId)
        {
            var caso = await _context.Casos
                .FirstOrDefaultAsync(c =>
                    c.Id == casoId &&
                    c.AnalistaId == analistaId);

            if (caso == null)
            {
                return (false, "El caso no existe o no está asignado a este analista.");
            }

            if (caso.Estado != EstadoCaso.EnVerificacion)
            {
                return (false, "El caso no se encuentra en estado EnVerificacion.");
            }

            var trabajo = await _context.TrabajosCaso
                .Where(t => t.CasoId == casoId)
                .OrderByDescending(t => t.FechaRegistro)
                .FirstOrDefaultAsync();

            if (trabajo == null)
            {
                return (false, "El caso no tiene un trabajo registrado para verificar.");
            }

            caso.Estado = EstadoCaso.Solucionada;

            await _context.SaveChangesAsync();

            return (true, "El trabajo fue verificado correctamente y el caso quedó solucionado.");
        }

        public async Task<(bool Exito, string Mensaje)> SolicitarCorreccionAsync(int casoId, string analistaId, SolicitarCorreccionRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Correccion))
            {
                return (false, "Debe indicar qué debe corregir el operario.");
            }

            if (request.Correccion.Length > 2000)
            {
                return (false, "La descripción de la corrección no puede superar los 2000 caracteres.");
            }

            var caso = await _context.Casos
                .FirstOrDefaultAsync(c =>
                    c.Id == casoId &&
                    c.AnalistaId == analistaId);

            if (caso == null)
            {
                return (false, "El caso no existe o no está asignado a este analista.");
            }

            if (caso.Estado != EstadoCaso.EnVerificacion)
            {
                return (false, "El caso no se encuentra en estado EnVerificacion.");
            }

            var trabajo = await _context.TrabajosCaso
                .Where(t => t.CasoId == casoId)
                .OrderByDescending(t => t.FechaRegistro)
                .FirstOrDefaultAsync();

            if (trabajo == null)
            {
                return (false, "El caso no tiene un trabajo registrado para solicitar corrección.");
            }

            var instruccion = await _context.InstruccionesTrabajo.FirstOrDefaultAsync(i => i.CasoId == casoId);

            if (instruccion == null)
            {
                return (false, "El caso no tiene una instrucción de trabajo asignada.");
            }


            var solicitud = new SolicitudCorreccionTrabajo
            {
                CasoId = casoId,
                AnalistaId = analistaId,
                OperarioId = instruccion.OperarioId,
                Correccion = request.Correccion.Trim(),
                FechaSolicitud = DateTime.UtcNow
            };

            _context.SolicitudesCorreccionTrabajo.Add(solicitud);

            caso.Estado = EstadoCaso.EnEjecucion;

            await _context.SaveChangesAsync();

            return (true, "Se solicitó una corrección al operario y el caso regresó a ejecución.");
        }
    }
}



















































