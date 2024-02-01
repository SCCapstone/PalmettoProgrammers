using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FU.API.Migrations
{
    /// <inheritdoc />
    public partial class ExpiredPosts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Expired",
                table: "Posts",
                type: "boolean",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Expired",
                table: "Posts");
        }
    }
}
