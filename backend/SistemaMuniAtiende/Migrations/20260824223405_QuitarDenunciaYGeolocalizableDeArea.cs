using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaMuniAtiende.Migrations
{
    /// <inheritdoc />
    public partial class QuitarDenunciaYGeolocalizableDeArea : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AplicaDenuncia",
                table: "Areas");

            migrationBuilder.DropColumn(
                name: "EsGeolocalizable",
                table: "Areas");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AplicaDenuncia",
                table: "Areas",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "EsGeolocalizable",
                table: "Areas",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
