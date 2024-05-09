using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BIsleriumCW.Migrations
{
    /// <inheritdoc />
    public partial class addedMembersInBlogModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DownVote",
                table: "Blogs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "Popularity",
                table: "Blogs",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "UpVote",
                table: "Blogs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DownVote",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "Popularity",
                table: "Blogs");

            migrationBuilder.DropColumn(
                name: "UpVote",
                table: "Blogs");
        }
    }
}
