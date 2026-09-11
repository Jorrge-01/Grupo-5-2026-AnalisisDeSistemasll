using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SistemaMuniAtiende.Migrations
{
    /// <inheritdoc />
    public partial class CrearTrabajosCaso : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TrabajosCaso",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CasoId = table.Column<int>(type: "integer", nullable: false),
                    OperarioId = table.Column<string>(type: "text", nullable: false),
                    Resultado = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrabajosCaso", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrabajosCaso_AspNetUsers_OperarioId",
                        column: x => x.OperarioId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TrabajosCaso_Casos_CasoId",
                        column: x => x.CasoId,
                        principalTable: "Casos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TrabajosCaso_CasoId",
                table: "TrabajosCaso",
                column: "CasoId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TrabajosCaso_OperarioId",
                table: "TrabajosCaso",
                column: "OperarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TrabajosCaso");
        }
    }
}
