using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CloudService.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPromotionsAndAuthTokens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NewsArticles_AppUsers_AuthorId",
                table: "NewsArticles");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanPrices_ServicePlans_PlanId",
                table: "PlanPrices");

            migrationBuilder.DropForeignKey(
                name: "FK_Promotions_ServicePlans_PlanId",
                table: "Promotions");

            migrationBuilder.DropForeignKey(
                name: "FK_ServicePlans_ServiceCategories_CategoryId",
                table: "ServicePlans");

            migrationBuilder.DropIndex(
                name: "IX_ServicePlans_Slug",
                table: "ServicePlans");

            migrationBuilder.DropIndex(
                name: "IX_ServiceCategories_Slug",
                table: "ServiceCategories");

            migrationBuilder.DropIndex(
                name: "IX_Promotions_PlanId",
                table: "Promotions");

            migrationBuilder.DropIndex(
                name: "IX_NewsArticles_Slug",
                table: "NewsArticles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PlanPrices",
                table: "PlanPrices");

            migrationBuilder.DropColumn(
                name: "DiscountPercent",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "PlanId",
                table: "Promotions");

            migrationBuilder.RenameTable(
                name: "PlanPrices",
                newName: "PlanPrice");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "Promotions",
                newName: "ExpiryDate");

            migrationBuilder.RenameIndex(
                name: "IX_PlanPrices_PlanId",
                table: "PlanPrice",
                newName: "IX_PlanPrice_PlanId");

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "ServicePlans",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(150)",
                oldMaxLength: 150);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "ServicePlans",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "ServiceCategories",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(150)",
                oldMaxLength: 150);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "ServiceCategories",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "Promotions",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountPercentage",
                table: "Promotions",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "OrderRequests",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "OrderRequests",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "CustomerName",
                table: "OrderRequests",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "NewsArticles",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "NewsArticles",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(250)",
                oldMaxLength: 250);

            migrationBuilder.AddColumn<string>(
                name: "RefreshToken",
                table: "AppUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RefreshTokenExpiryTime",
                table: "AppUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlanPrice",
                table: "PlanPrice",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Promotions_Code",
                table: "Promotions",
                column: "Code",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_NewsArticles_AppUsers_AuthorId",
                table: "NewsArticles",
                column: "AuthorId",
                principalTable: "AppUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanPrice_ServicePlans_PlanId",
                table: "PlanPrice",
                column: "PlanId",
                principalTable: "ServicePlans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ServicePlans_ServiceCategories_CategoryId",
                table: "ServicePlans",
                column: "CategoryId",
                principalTable: "ServiceCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NewsArticles_AppUsers_AuthorId",
                table: "NewsArticles");

            migrationBuilder.DropForeignKey(
                name: "FK_PlanPrice_ServicePlans_PlanId",
                table: "PlanPrice");

            migrationBuilder.DropForeignKey(
                name: "FK_ServicePlans_ServiceCategories_CategoryId",
                table: "ServicePlans");

            migrationBuilder.DropIndex(
                name: "IX_Promotions_Code",
                table: "Promotions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PlanPrice",
                table: "PlanPrice");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "DiscountPercentage",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "RefreshToken",
                table: "AppUsers");

            migrationBuilder.DropColumn(
                name: "RefreshTokenExpiryTime",
                table: "AppUsers");

            migrationBuilder.RenameTable(
                name: "PlanPrice",
                newName: "PlanPrices");

            migrationBuilder.RenameColumn(
                name: "ExpiryDate",
                table: "Promotions",
                newName: "StartDate");

            migrationBuilder.RenameIndex(
                name: "IX_PlanPrice_PlanId",
                table: "PlanPrices",
                newName: "IX_PlanPrices_PlanId");

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "ServicePlans",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "ServicePlans",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "ServiceCategories",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "ServiceCategories",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountPercent",
                table: "Promotions",
                type: "decimal(5,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Promotions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "PlanId",
                table: "Promotions",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AlterColumn<string>(
                name: "Phone",
                table: "OrderRequests",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "OrderRequests",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "CustomerName",
                table: "OrderRequests",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "NewsArticles",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Slug",
                table: "NewsArticles",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlanPrices",
                table: "PlanPrices",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_ServicePlans_Slug",
                table: "ServicePlans",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceCategories_Slug",
                table: "ServiceCategories",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Promotions_PlanId",
                table: "Promotions",
                column: "PlanId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsArticles_Slug",
                table: "NewsArticles",
                column: "Slug",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_NewsArticles_AppUsers_AuthorId",
                table: "NewsArticles",
                column: "AuthorId",
                principalTable: "AppUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PlanPrices_ServicePlans_PlanId",
                table: "PlanPrices",
                column: "PlanId",
                principalTable: "ServicePlans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Promotions_ServicePlans_PlanId",
                table: "Promotions",
                column: "PlanId",
                principalTable: "ServicePlans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ServicePlans_ServiceCategories_CategoryId",
                table: "ServicePlans",
                column: "CategoryId",
                principalTable: "ServiceCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
