using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudService.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAffiliateTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AffiliateId",
                table: "OrderRequests",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "AppUserId",
                table: "AffiliateApplications",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateApplications_AppUserId",
                table: "AffiliateApplications",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_AffiliateApplications_AppUsers_AppUserId",
                table: "AffiliateApplications",
                column: "AppUserId",
                principalTable: "AppUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AffiliateApplications_AppUsers_AppUserId",
                table: "AffiliateApplications");

            migrationBuilder.DropIndex(
                name: "IX_AffiliateApplications_AppUserId",
                table: "AffiliateApplications");

            migrationBuilder.DropColumn(
                name: "AffiliateId",
                table: "OrderRequests");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "AffiliateApplications");
        }
    }
}
