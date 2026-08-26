using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SistemaMuniAtiende.Models;


namespace SistemaMuniAtiende.Api.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<PerfilVecino> PerfilesVecino { get; set; }
        public DbSet<Aldea> Aldeas { get; set; }
        public DbSet<PerfilEmpleado> PerfilesEmpleado { get; set; }
        public DbSet<Area> Areas { get; set; }

        public DbSet<Bitacora> Bitacoras { get; set; }

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
        }
    }
}