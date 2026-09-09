using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SistemaMuniAtiende.Migrations
{
    /// <inheritdoc />
    public partial class CrearSolicitudesInformacionCaso : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SolicitudesInformacionCaso",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CasoId = table.Column<int>(type: "integer", nullable: false),
                    AnalistaId = table.Column<string>(type: "text", nullable: false),
                    Mensaje = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    FechaSolicitud = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Respuesta = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    FechaRespuesta = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Estado = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolicitudesInformacionCaso", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SolicitudesInformacionCaso_AspNetUsers_AnalistaId",
                        column: x => x.AnalistaId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SolicitudesInformacionCaso_Casos_CasoId",
                        column: x => x.CasoId,
                        principalTable: "Casos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudesInformacionCaso_AnalistaId",
                table: "SolicitudesInformacionCaso",
                column: "AnalistaId");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudesInformacionCaso_CasoId",
                table: "SolicitudesInformacionCaso",
                column: "CasoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SolicitudesInformacionCaso");
        }
    }
}
