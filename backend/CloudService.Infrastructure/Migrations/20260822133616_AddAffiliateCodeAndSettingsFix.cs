using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CloudService.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAffiliateCodeAndSettingsFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AppliedAffiliateCode",
                table: "OrderRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AppliedPromoCode",
                table: "OrderRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountAmount",
                table: "OrderRequests",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "FinalPrice",
                table: "OrderRequests",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "AffiliateCode",
                table: "AffiliateApplications",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SystemSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Key = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemSettings", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "SystemSettings",
                columns: new[] { "Id", "CreatedAt", "Description", "Key", "UpdatedAt", "Value" },
                values: new object[,]
                {
                    { new Guid("11111111-2222-3333-4444-555555555555"), new DateTime(2026, 8, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Phần trăm giảm giá cho khách hàng khi nhập mã Affiliate", "AffiliateDiscountRate", null, "10" },
                    { new Guid("22222222-3333-4444-5555-666666666666"), new DateTime(2026, 8, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Phần trăm hoa hồng cho đối tác Affiliate", "AffiliateCommissionRate", null, "10" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AffiliateApplications_AffiliateCode",
                table: "AffiliateApplications",
                column: "AffiliateCode",
                unique: true,
                filter: "[AffiliateCode] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_SystemSettings_Key",
                table: "SystemSettings",
                column: "Key",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SystemSettings");

            migrationBuilder.DropIndex(
                name: "IX_AffiliateApplications_AffiliateCode",
                table: "AffiliateApplications");

            migrationBuilder.DropColumn(
                name: "AppliedAffiliateCode",
                table: "OrderRequests");

            migrationBuilder.DropColumn(
                name: "AppliedPromoCode",
                table: "OrderRequests");

            migrationBuilder.DropColumn(
                name: "DiscountAmount",
                table: "OrderRequests");

            migrationBuilder.DropColumn(
                name: "FinalPrice",
                table: "OrderRequests");

            migrationBuilder.DropColumn(
                name: "AffiliateCode",
                table: "AffiliateApplications");
        }
    }
}
