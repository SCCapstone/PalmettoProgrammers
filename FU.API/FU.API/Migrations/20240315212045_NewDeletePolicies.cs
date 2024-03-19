using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FU.API.Migrations
{
    /// <inheritdoc />
    public partial class NewDeletePolicies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chats_Users_CreatorId",
                table: "Chats");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Users_SenderId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Users_CreatorId",
                table: "Posts");

            migrationBuilder.AlterColumn<int>(
                name: "CreatorId",
                table: "Posts",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "SenderId",
                table: "Messages",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "ApplicationUserUserId",
                table: "GroupMemberships",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ApplicationUserUserId",
                table: "ChatMemberships",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GroupMemberships_ApplicationUserUserId",
                table: "GroupMemberships",
                column: "ApplicationUserUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMemberships_ApplicationUserUserId",
                table: "ChatMemberships",
                column: "ApplicationUserUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatMemberships_Users_ApplicationUserUserId",
                table: "ChatMemberships",
                column: "ApplicationUserUserId",
                principalTable: "Users",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Chats_Users_CreatorId",
                table: "Chats",
                column: "CreatorId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_GroupMemberships_Users_ApplicationUserUserId",
                table: "GroupMemberships",
                column: "ApplicationUserUserId",
                principalTable: "Users",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Users_SenderId",
                table: "Messages",
                column: "SenderId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Users_CreatorId",
                table: "Posts",
                column: "CreatorId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatMemberships_Users_ApplicationUserUserId",
                table: "ChatMemberships");

            migrationBuilder.DropForeignKey(
                name: "FK_Chats_Users_CreatorId",
                table: "Chats");

            migrationBuilder.DropForeignKey(
                name: "FK_GroupMemberships_Users_ApplicationUserUserId",
                table: "GroupMemberships");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Users_SenderId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Users_CreatorId",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_GroupMemberships_ApplicationUserUserId",
                table: "GroupMemberships");

            migrationBuilder.DropIndex(
                name: "IX_ChatMemberships_ApplicationUserUserId",
                table: "ChatMemberships");

            migrationBuilder.DropColumn(
                name: "ApplicationUserUserId",
                table: "GroupMemberships");

            migrationBuilder.DropColumn(
                name: "ApplicationUserUserId",
                table: "ChatMemberships");

            migrationBuilder.AlterColumn<int>(
                name: "CreatorId",
                table: "Posts",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "SenderId",
                table: "Messages",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Chats_Users_CreatorId",
                table: "Chats",
                column: "CreatorId",
                principalTable: "Users",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Users_SenderId",
                table: "Messages",
                column: "SenderId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Users_CreatorId",
                table: "Posts",
                column: "CreatorId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
