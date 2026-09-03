using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SistemaMuniAtiende.Migrations
{
    /// <inheritdoc />
    public partial class AgregarAnalistaACasos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AnalistaId",
                table: "Casos",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ArchivoCaso",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CasoId = table.Column<int>(type: "integer", nullable: false),
                    NombreArchivo = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    TipoContenido = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    RutaArchivo = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    TamanoBytes = table.Column<long>(type: "bigint", nullable: false),
                    FechaCarga = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArchivoCaso", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ArchivoCaso_Casos_CasoId",
                        column: x => x.CasoId,
                        principalTable: "Casos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Casos_AnalistaId",
                table: "Casos",
                column: "AnalistaId");

            migrationBuilder.CreateIndex(
                name: "IX_ArchivoCaso_CasoId",
                table: "ArchivoCaso",
                column: "CasoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Casos_AspNetUsers_AnalistaId",
                table: "Casos",
                column: "AnalistaId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Casos_AspNetUsers_AnalistaId",
                table: "Casos");

            migrationBuilder.DropTable(
                name: "ArchivoCaso");

            migrationBuilder.DropIndex(
                name: "IX_Casos_AnalistaId",
                table: "Casos");

            migrationBuilder.DropColumn(
                name: "AnalistaId",
                table: "Casos");
        }
    }
}
