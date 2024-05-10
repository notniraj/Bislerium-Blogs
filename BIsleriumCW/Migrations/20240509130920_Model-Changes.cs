using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BIsleriumCW.Migrations
{
    /// <inheritdoc />
    public partial class ModelChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Popularity",
                table: "BlogReactions");

            migrationBuilder.RenameColumn(
                name: "HasLiked",
                table: "CommentReactions",
                newName: "Upvote");

            migrationBuilder.RenameColumn(
                name: "UpVote",
                table: "BlogReactions",
                newName: "Upvote");

            migrationBuilder.RenameColumn(
                name: "DownVote",
                table: "BlogReactions",
                newName: "Downvote");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "CommentReactions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "Downvote",
                table: "CommentReactions",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "CommentReactions",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Upvote",
                table: "BlogReactions",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "Downvote",
                table: "BlogReactions",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "BlogReactions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "BlogReactions",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CommentReactions_UserId",
                table: "CommentReactions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_BlogReactions_UserId",
                table: "BlogReactions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_BlogReactions_AspNetUsers_UserId",
                table: "BlogReactions",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CommentReactions_AspNetUsers_UserId",
                table: "CommentReactions",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BlogReactions_AspNetUsers_UserId",
                table: "BlogReactions");

            migrationBuilder.DropForeignKey(
                name: "FK_CommentReactions_AspNetUsers_UserId",
                table: "CommentReactions");

            migrationBuilder.DropIndex(
                name: "IX_CommentReactions_UserId",
                table: "CommentReactions");

            migrationBuilder.DropIndex(
                name: "IX_BlogReactions_UserId",
                table: "BlogReactions");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "CommentReactions");

            migrationBuilder.DropColumn(
                name: "Downvote",
                table: "CommentReactions");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "CommentReactions");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "BlogReactions");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "BlogReactions");

            migrationBuilder.RenameColumn(
                name: "Upvote",
                table: "CommentReactions",
                newName: "HasLiked");

            migrationBuilder.RenameColumn(
                name: "Upvote",
                table: "BlogReactions",
                newName: "UpVote");

            migrationBuilder.RenameColumn(
                name: "Downvote",
                table: "BlogReactions",
                newName: "DownVote");

            migrationBuilder.AlterColumn<int>(
                name: "UpVote",
                table: "BlogReactions",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "DownVote",
                table: "BlogReactions",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<double>(
                name: "Popularity",
                table: "BlogReactions",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
