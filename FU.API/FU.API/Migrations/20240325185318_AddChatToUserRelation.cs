using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FU.API.Migrations
{
    /// <inheritdoc />
    public partial class AddChatToUserRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Delete all user relations
            migrationBuilder.Sql("DELETE FROM \"UserRelations\"");

            migrationBuilder.AddColumn<int>(
                name: "ChatId",
                table: "UserRelations",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_UserRelations_ChatId",
                table: "UserRelations",
                column: "ChatId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserRelations_Chats_ChatId",
                table: "UserRelations",
                column: "ChatId",
                principalTable: "Chats",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserRelations_Chats_ChatId",
                table: "UserRelations");

            migrationBuilder.DropIndex(
                name: "IX_UserRelations_ChatId",
                table: "UserRelations");

            migrationBuilder.DropColumn(
                name: "ChatId",
                table: "UserRelations");
        }
    }
}
