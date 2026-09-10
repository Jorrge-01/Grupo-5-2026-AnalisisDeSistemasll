using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SistemaMuniAtiende.Migrations
{
    /// <inheritdoc />
    public partial class CrearInstruccionesTrabajo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InstruccionesTrabajo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CasoId = table.Column<int>(type: "integer", nullable: false),
                    AnalistaId = table.Column<string>(type: "text", nullable: false),
                    Instruccion = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    OperarioId = table.Column<string>(type: "text", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FechaAsignacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InstruccionesTrabajo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InstruccionesTrabajo_AspNetUsers_AnalistaId",
                        column: x => x.AnalistaId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_InstruccionesTrabajo_AspNetUsers_OperarioId",
                        column: x => x.OperarioId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_InstruccionesTrabajo_Casos_CasoId",
                        column: x => x.CasoId,
                        principalTable: "Casos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InstruccionesTrabajo_AnalistaId",
                table: "InstruccionesTrabajo",
                column: "AnalistaId");

            migrationBuilder.CreateIndex(
                name: "IX_InstruccionesTrabajo_CasoId",
                table: "InstruccionesTrabajo",
                column: "CasoId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_InstruccionesTrabajo_OperarioId",
                table: "InstruccionesTrabajo",
                column: "OperarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InstruccionesTrabajo");
        }
    }
}
