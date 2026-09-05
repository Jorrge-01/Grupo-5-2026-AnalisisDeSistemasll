using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SistemaMuniAtiende.Migrations
{
    /// <inheritdoc />
    public partial class ConvertirAldeaAMuchosAUno : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Aldea",
                table: "PerfilesVecino");

            migrationBuilder.AddColumn<int>(
                name: "AldeaId",
                table: "PerfilesVecino",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PerfilesVecino_AldeaId",
                table: "PerfilesVecino",
                column: "AldeaId");

            migrationBuilder.AddForeignKey(
                name: "FK_PerfilesVecino_Aldeas_AldeaId",
                table: "PerfilesVecino",
                column: "AldeaId",
                principalTable: "Aldeas",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PerfilesVecino_Aldeas_AldeaId",
                table: "PerfilesVecino");

            migrationBuilder.DropIndex(
                name: "IX_PerfilesVecino_AldeaId",
                table: "PerfilesVecino");

            migrationBuilder.DropColumn(
                name: "AldeaId",
                table: "PerfilesVecino");

            migrationBuilder.AddColumn<string>(
                name: "Aldea",
                table: "PerfilesVecino",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
