using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaMuniAtiende.Migrations
{
    /// <inheritdoc />
    public partial class AgregarArchivosCasoDbSet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ArchivoCaso_Casos_CasoId",
                table: "ArchivoCaso");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ArchivoCaso",
                table: "ArchivoCaso");

            migrationBuilder.RenameTable(
                name: "ArchivoCaso",
                newName: "ArchivosCaso");

            migrationBuilder.RenameIndex(
                name: "IX_ArchivoCaso_CasoId",
                table: "ArchivosCaso",
                newName: "IX_ArchivosCaso_CasoId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ArchivosCaso",
                table: "ArchivosCaso",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ArchivosCaso_Casos_CasoId",
                table: "ArchivosCaso",
                column: "CasoId",
                principalTable: "Casos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ArchivosCaso_Casos_CasoId",
                table: "ArchivosCaso");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ArchivosCaso",
                table: "ArchivosCaso");

            migrationBuilder.RenameTable(
                name: "ArchivosCaso",
                newName: "ArchivoCaso");

            migrationBuilder.RenameIndex(
                name: "IX_ArchivosCaso_CasoId",
                table: "ArchivoCaso",
                newName: "IX_ArchivoCaso_CasoId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ArchivoCaso",
                table: "ArchivoCaso",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ArchivoCaso_Casos_CasoId",
                table: "ArchivoCaso",
                column: "CasoId",
                principalTable: "Casos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
