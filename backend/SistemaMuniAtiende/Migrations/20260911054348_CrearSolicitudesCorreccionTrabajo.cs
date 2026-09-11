using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SistemaMuniAtiende.Migrations
{
    /// <inheritdoc />
    public partial class CrearSolicitudesCorreccionTrabajo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SolicitudesCorreccionTrabajo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CasoId = table.Column<int>(type: "integer", nullable: false),
                    AnalistaId = table.Column<string>(type: "text", nullable: false),
                    OperarioId = table.Column<string>(type: "text", nullable: false),
                    Correccion = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    FechaSolicitud = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SolicitudesCorreccionTrabajo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SolicitudesCorreccionTrabajo_AspNetUsers_AnalistaId",
                        column: x => x.AnalistaId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SolicitudesCorreccionTrabajo_AspNetUsers_OperarioId",
                        column: x => x.OperarioId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SolicitudesCorreccionTrabajo_Casos_CasoId",
                        column: x => x.CasoId,
                        principalTable: "Casos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudesCorreccionTrabajo_AnalistaId",
                table: "SolicitudesCorreccionTrabajo",
                column: "AnalistaId");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudesCorreccionTrabajo_CasoId",
                table: "SolicitudesCorreccionTrabajo",
                column: "CasoId");

            migrationBuilder.CreateIndex(
                name: "IX_SolicitudesCorreccionTrabajo_OperarioId",
                table: "SolicitudesCorreccionTrabajo",
                column: "OperarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SolicitudesCorreccionTrabajo");
        }
    }
}
