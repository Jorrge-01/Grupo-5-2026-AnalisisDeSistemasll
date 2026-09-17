using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SistemaMuniAtiende.Models;


namespace SistemaMuniAtiende.Api.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<ArchivoCaso> ArchivosCaso { get; set; }
        public DbSet<PerfilVecino> PerfilesVecino { get; set; }
        public DbSet<Aldea> Aldeas { get; set; }
        public DbSet<PerfilEmpleado> PerfilesEmpleado { get; set; }
        public DbSet<Area> Areas { get; set; }

        public DbSet<Bitacora> Bitacoras { get; set; }

        public DbSet<Caso> Casos { get; set; }

        public DbSet<SolicitudInformacionCaso> SolicitudesInformacionCaso { get; set; }

        public DbSet<InstruccionTrabajo> InstruccionesTrabajo { get; set; }
        public DbSet<TrabajoCaso> TrabajosCaso { get; set; }
        public DbSet<SolicitudCorreccionTrabajo> SolicitudesCorreccionTrabajo { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<PerfilVecino>()
                .HasIndex(p => p.Cui)
                .IsUnique();

            builder.Entity<PerfilVecino>()
                .HasOne(p => p.Usuario)
                .WithMany()
                .HasForeignKey(p => p.UserId);

            builder.Entity<PerfilEmpleado>()
                .HasOne(p => p.Usuario)
                .WithMany()
                .HasForeignKey(p => p.UserId);

            builder.Entity<PerfilEmpleado>()
                .HasMany(p => p.Areas)
                .WithMany();

            builder.Entity<PerfilVecino>()
                .HasOne(p => p.Aldea)
                .WithMany()
                .HasForeignKey(p => p.AldeaId);

            builder.Entity<Caso>()
                .HasOne(c => c.Vecino)
                .WithMany()
                .HasForeignKey(c => c.VecinoId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Caso>()
                .HasOne(c => c.Analista)
                .WithMany()
                .HasForeignKey(c => c.AnalistaId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Caso>()
                .HasOne(c => c.Area)
                .WithMany()
                .HasForeignKey(c => c.AreaId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Caso>()
                .HasOne(c => c.Aldea)
                .WithMany()
                .HasForeignKey(c => c.AldeaId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Caso>()
                .Property(c => c.Estado)
                .HasConversion<string>()
                .HasMaxLength(30);

            builder.Entity<Caso>()
                .HasIndex(c => c.Codigo)
                .IsUnique();

            builder.Entity<Caso>()
                .HasIndex(c => c.VecinoId);

            builder.Entity<Caso>()
                .HasIndex(c => c.AreaId);

            builder.Entity<Caso>()
                .HasIndex(c => c.Estado);

            builder.Entity<Caso>()
                .HasIndex(c => c.AnalistaId);


            builder.Entity<SolicitudInformacionCaso>()
                .HasOne(s => s.Caso)
                .WithMany()
                .HasForeignKey(s => s.CasoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<SolicitudInformacionCaso>()
                .HasOne(s => s.Analista)
                .WithMany()
                .HasForeignKey(s => s.AnalistaId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<SolicitudInformacionCaso>()
                .Property(s => s.Estado)
                .HasConversion<string>()
                .HasMaxLength(20);

            builder.Entity<SolicitudInformacionCaso>()
                .HasIndex(s => s.CasoId);

            builder.Entity<SolicitudInformacionCaso>()
                .HasIndex(s => s.AnalistaId);


            builder.Entity<InstruccionTrabajo>()
                .HasOne(i => i.Caso)
                .WithMany()
                .HasForeignKey(i => i.CasoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<InstruccionTrabajo>()
                .HasOne(i => i.Analista)
                .WithMany()
                .HasForeignKey(i => i.AnalistaId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<InstruccionTrabajo>()
                .HasOne(i => i.Operario)
                .WithMany()
                .HasForeignKey(i => i.OperarioId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<InstruccionTrabajo>()
                .HasIndex(i => i.CasoId)
                .IsUnique();

            builder.Entity<InstruccionTrabajo>()
                .HasIndex(i => i.AnalistaId);

            builder.Entity<InstruccionTrabajo>()
                .HasIndex(i => i.OperarioId);


            builder.Entity<TrabajoCaso>()
                .HasOne(t => t.Caso)
                .WithMany()
                .HasForeignKey(t => t.CasoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<TrabajoCaso>()
                .HasOne(t => t.Operario)
                .WithMany()
                .HasForeignKey(t => t.OperarioId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<TrabajoCaso>()
                .HasIndex(t => t.CasoId);

            builder.Entity<TrabajoCaso>()
                .HasIndex(t => t.OperarioId);


            builder.Entity<SolicitudCorreccionTrabajo>()
                .HasOne(s => s.Caso)
                .WithMany()
                .HasForeignKey(s => s.CasoId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<SolicitudCorreccionTrabajo>()
                .HasOne(s => s.Analista)
                .WithMany()
                .HasForeignKey(s => s.AnalistaId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<SolicitudCorreccionTrabajo>()
                .HasOne(s => s.Operario)
                .WithMany()
                .HasForeignKey(s => s.OperarioId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<SolicitudCorreccionTrabajo>()
                .HasIndex(s => s.CasoId);

            builder.Entity<SolicitudCorreccionTrabajo>()
                .HasIndex(s => s.AnalistaId);

            builder.Entity<SolicitudCorreccionTrabajo>()
                .HasIndex(s => s.OperarioId);
        }
    }
}