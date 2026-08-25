using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using SistemaMuniAtiende.Models;
using System.Text.Json;

namespace SistemaMuniAtiende.Api.Data
{
    public class BitacoraInterceptor : SaveChangesInterceptor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BitacoraInterceptor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public override InterceptionResult<int> SavingChanges(
            DbContextEventData eventData, InterceptionResult<int> result)
        {
            RegistrarCambios(eventData.Context);
            return result;
        }

        public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
            DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
        {
            RegistrarCambios(eventData.Context);
            return ValueTask.FromResult(result);
        }

        private void RegistrarCambios(DbContext? context)
        {
            Console.WriteLine("BitacoraInterceptor: RegistrarCambios ejecutado");
            if (context == null) return;

            var userId = _httpContextAccessor.HttpContext?.User?
                .FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var ip = _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString();

            var entradas = context.ChangeTracker.Entries()
                .Where(e => e.Entity is not Bitacora &&
                            (e.State == EntityState.Added ||
                             e.State == EntityState.Modified ||
                             e.State == EntityState.Deleted))
                .ToList();

            foreach (var entrada in entradas)
            {
                var registro = new Bitacora
                {
                    UserId = userId,
                    Accion = entrada.State.ToString(),
                    Entidad = entrada.Entity.GetType().Name,
                    EntidadId = ObtenerId(entrada),
                    Detalle = SerializarValores(entrada),
                    Ip = ip
                };
                context.Set<Bitacora>().Add(registro);
            }
        }

        private static string? ObtenerId(EntityEntry entrada)
        {
            var clave = entrada.Metadata.FindPrimaryKey();
            if (clave == null) return null;
            var propiedad = clave.Properties.First();
            return entrada.CurrentValues[propiedad]?.ToString();
        }

        private static string SerializarValores(EntityEntry entrada)
        {
            try
            {
                var valores = entrada.CurrentValues.Properties
                    .Where(p => !p.Name.ToLower().Contains("password") && !p.Name.ToLower().Contains("hash"))
                    .ToDictionary(p => p.Name, p => entrada.CurrentValues[p]);
                return JsonSerializer.Serialize(valores);
            }
            catch
            {
                return "{}";
            }
        }
    }
}