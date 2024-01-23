using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FU.API.Migrations
{
    /// <inheritdoc />
    public partial class NormalizedPostDescAndTitle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NormalizedDescription",
                table: "Posts",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NormalizedTitle",
                table: "Posts",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NormalizedDescription",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "NormalizedTitle",
                table: "Posts");
        }
    }
}
