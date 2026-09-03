using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SistemaMuniAtiende.Migrations
{
    /// <inheritdoc />
    public partial class CrearModuloCasos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Casos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Codigo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    VecinoId = table.Column<string>(type: "text", nullable: false),
                    AreaId = table.Column<int>(type: "integer", nullable: false),
                    AldeaId = table.Column<int>(type: "integer", nullable: false),
                    Direccion = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: false),
                    TelefonoContacto = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    Descripcion = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Estado = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Casos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Casos_Aldeas_AldeaId",
                        column: x => x.AldeaId,
                        principalTable: "Aldeas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Casos_Areas_AreaId",
                        column: x => x.AreaId,
                        principalTable: "Areas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Casos_AspNetUsers_VecinoId",
                        column: x => x.VecinoId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Casos_AldeaId",
                table: "Casos",
                column: "AldeaId");

            migrationBuilder.CreateIndex(
                name: "IX_Casos_AreaId",
                table: "Casos",
                column: "AreaId");

            migrationBuilder.CreateIndex(
                name: "IX_Casos_Codigo",
                table: "Casos",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Casos_Estado",
                table: "Casos",
                column: "Estado");

            migrationBuilder.CreateIndex(
                name: "IX_Casos_VecinoId",
                table: "Casos",
                column: "VecinoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Casos");
        }
    }
}
