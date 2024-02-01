using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FU.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPostStatusIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Posts_Status",
                table: "Posts",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Posts_Status",
                table: "Posts");
        }
    }
}
