using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FU.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPostStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Expired",
                table: "Posts");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Posts",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Posts");

            migrationBuilder.AddColumn<bool>(
                name: "Expired",
                table: "Posts",
                type: "boolean",
                nullable: true);
        }
    }
}
