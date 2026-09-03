using Microsoft.EntityFrameworkCore;
using SistemaMuniAtiende.Api.Data;
using SistemaMuniAtiende.DTOs;
using SistemaMuniAtiende.Models;

namespace SistemaMuniAtiende.Services
{
    public class CasoService
    {
        private readonly AppDbContext _context;

        public CasoService(AppDbContext context)
        {
            _context = context;
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
    }
}