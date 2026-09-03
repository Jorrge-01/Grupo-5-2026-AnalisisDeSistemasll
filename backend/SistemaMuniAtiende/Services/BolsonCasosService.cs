using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SistemaMuniAtiende.Api.Data;
using SistemaMuniAtiende.Models;

namespace SistemaMuniAtiende.Services
{
    public class BolsonCasosService
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public BolsonCasosService(AppDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<(bool asignado, string mensaje)> AsignarCasoAsync(Caso caso)
        {
            if (caso.AnalistaId != null)
                return (true, "El caso ya tiene un analista asignado.");

            if (caso.Estado != EstadoCaso.Registrada)
                return (false, "El caso no se encuentra disponible para asignación.");

            var analistas = await _userManager.GetUsersInRoleAsync("Analista");

            var analistasActivos = analistas
                .Where(a => a.Activo)
                .ToList();

            if (!analistasActivos.Any())
                return (false, "No existen analistas activos disponibles.");

            var perfiles = await _context.PerfilesEmpleado
                .Include(p => p.Areas)
                .Where(p => p.Areas.Any(a => a.Id == caso.AreaId))
                .ToListAsync();

            var candidatos = analistasActivos
                .Where(a => perfiles.Any(p => p.UserId == a.Id))
                .ToList();

            if (!candidatos.Any())
                return (false, "No existe un analista activo asignado al área del caso.");

            var estadosActivos = new[]
            {
                EstadoCaso.Asignada,
                EstadoCaso.EnValidacion,
                EstadoCaso.PendienteInformacion,
                EstadoCaso.EnAnalisis,
                EstadoCaso.AsignadaAOperario,
                EstadoCaso.EnEjecucion,
                EstadoCaso.TrabajoRealizado,
                EstadoCaso.EnVerificacion,
                EstadoCaso.Reabierta
            };

            var cargas = await _context.Casos
                .Where(c => c.AnalistaId != null && estadosActivos.Contains(c.Estado))
                .GroupBy(c => c.AnalistaId!)
                .Select(g => new
                {
                    AnalistaId = g.Key,
                    CasosActivos = g.Count()
                })
                .ToListAsync();

            var analistaSeleccionado = candidatos
                .Select(a => new
                {
                    Analista = a,
                    CasosActivos = cargas
                        .Where(c => c.AnalistaId == a.Id)
                        .Select(c => c.CasosActivos)
                        .FirstOrDefault()
                })
                .OrderBy(x => x.CasosActivos)
                .ThenBy(x => x.Analista.Nombre)
                .First()
                .Analista;

            caso.AnalistaId = analistaSeleccionado.Id;
            caso.Estado = EstadoCaso.Asignada;

            await _context.SaveChangesAsync();

            return (
                true,
                $"Caso {caso.Codigo} asignado al analista {analistaSeleccionado.Nombre} {analistaSeleccionado.Apellido}."
            );
        }

        public async Task<int> AsignarCasosPendientesAsync()
        {
            var casosPendientes = await _context.Casos
                .Where(c => c.Estado == EstadoCaso.Registrada && c.AnalistaId == null)
                .OrderBy(c => c.FechaRegistro)
                .ToListAsync();

            var asignados = 0;

            foreach (var caso in casosPendientes)
            {
                var resultado = await AsignarCasoAsync(caso);

                if (resultado.asignado)
                    asignados++;
            }

            return asignados;
        }

        public async Task<List<object>> ObtenerCasosPendientesAsync()
        {
            return await _context.Casos
                .AsNoTracking()
                .Where(c => c.Estado == EstadoCaso.Registrada && c.AnalistaId == null)
                .Include(c => c.Area)
                .Include(c => c.Aldea)
                .OrderBy(c => c.FechaRegistro)
                .Select(c => new
                {
                    c.Id,
                    c.Codigo,
                    Area = c.Area!.Nombre,
                    Aldea = c.Aldea!.Nombre,
                    c.Direccion,
                    c.Descripcion,
                    c.FechaRegistro,
                    Estado = c.Estado.ToString()
                })
                .Cast<object>()
                .ToListAsync();
        }
    }
}