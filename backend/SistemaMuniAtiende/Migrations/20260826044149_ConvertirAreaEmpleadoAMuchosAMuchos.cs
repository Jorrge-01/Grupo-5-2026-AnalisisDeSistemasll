using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaMuniAtiende.Migrations
{
    /// <inheritdoc />
    public partial class ConvertirAreaEmpleadoAMuchosAMuchos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PerfilesEmpleado_Areas_AreaId",
                table: "PerfilesEmpleado");

            migrationBuilder.DropIndex(
                name: "IX_PerfilesEmpleado_AreaId",
                table: "PerfilesEmpleado");

            migrationBuilder.DropColumn(
                name: "AreaId",
                table: "PerfilesEmpleado");

            migrationBuilder.AlterColumn<string>(
                name: "Cargo",
                table: "PerfilesEmpleado",
                type: "character varying(60)",
                maxLength: 60,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateTable(
                name: "AreaPerfilEmpleado",
                columns: table => new
                {
                    AreasId = table.Column<int>(type: "integer", nullable: false),
                    PerfilEmpleadoId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AreaPerfilEmpleado", x => new { x.AreasId, x.PerfilEmpleadoId });
                    table.ForeignKey(
                        name: "FK_AreaPerfilEmpleado_Areas_AreasId",
                        column: x => x.AreasId,
                        principalTable: "Areas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AreaPerfilEmpleado_PerfilesEmpleado_PerfilEmpleadoId",
                        column: x => x.PerfilEmpleadoId,
                        principalTable: "PerfilesEmpleado",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AreaPerfilEmpleado_PerfilEmpleadoId",
                table: "AreaPerfilEmpleado",
                column: "PerfilEmpleadoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AreaPerfilEmpleado");

            migrationBuilder.AlterColumn<string>(
                name: "Cargo",
                table: "PerfilesEmpleado",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(60)",
                oldMaxLength: 60);

            migrationBuilder.AddColumn<int>(
                name: "AreaId",
                table: "PerfilesEmpleado",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_PerfilesEmpleado_AreaId",
                table: "PerfilesEmpleado",
                column: "AreaId");

            migrationBuilder.AddForeignKey(
                name: "FK_PerfilesEmpleado_Areas_AreaId",
                table: "PerfilesEmpleado",
                column: "AreaId",
                principalTable: "Areas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
