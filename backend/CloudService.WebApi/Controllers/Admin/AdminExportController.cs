using CloudService.Infrastructure.Data;
using CloudService.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/admin/export")]
[Authorize(Roles = "Admin")]
public class AdminExportController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ExcelExportService _excelService;

    public AdminExportController(
        AppDbContext context,
        ExcelExportService excelService)
    {
        _context = context;
        _excelService = excelService;
    }

    [HttpGet("orders")]
    public async Task<IActionResult> ExportOrders()
    {
        var orders = await _context
            .OrderRequests
            .ToListAsync();

        var bytes =
            _excelService.ExportOrdersToExcel(orders);

        return File(
            bytes,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"DonHang_{DateTime.Now:yyyyMMdd}.xlsx");
    }
}