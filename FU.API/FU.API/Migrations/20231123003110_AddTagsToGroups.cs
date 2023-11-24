#nullable disable

namespace FU.API.Migrations
{
    using Microsoft.EntityFrameworkCore.Migrations;

    /// <inheritdoc />
    public partial class AddTagsToGroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GroupId",
                table: "TagRelations",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TagRelations_GroupId",
                table: "TagRelations",
                column: "GroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_TagRelations_Groups_GroupId",
                table: "TagRelations",
                column: "GroupId",
                principalTable: "Groups",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TagRelations_Groups_GroupId",
                table: "TagRelations");

            migrationBuilder.DropIndex(
                name: "IX_TagRelations_GroupId",
                table: "TagRelations");

            migrationBuilder.DropColumn(
                name: "GroupId",
                table: "TagRelations");
        }
    }
}
