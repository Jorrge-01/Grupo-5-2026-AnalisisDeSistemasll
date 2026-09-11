using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaMuniAtiende.Migrations
{
    /// <inheritdoc />
    public partial class PermitirMultiplesTrabajosCaso : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TrabajosCaso_CasoId",
                table: "TrabajosCaso");

            migrationBuilder.CreateIndex(
                name: "IX_TrabajosCaso_CasoId",
                table: "TrabajosCaso",
                column: "CasoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TrabajosCaso_CasoId",
                table: "TrabajosCaso");

            migrationBuilder.CreateIndex(
                name: "IX_TrabajosCaso_CasoId",
                table: "TrabajosCaso",
                column: "CasoId",
                unique: true);
        }
    }
}
