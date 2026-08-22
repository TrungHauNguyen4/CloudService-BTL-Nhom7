using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/admin/stats")]
[Authorize(Roles = "Admin")]
public class AdminStatsController : ControllerBase
{
    private readonly IAdminStatsService _statsService;

    public AdminStatsController(IAdminStatsService statsService)
    {
        _statsService = statsService;
    }

    // GET: /api/admin/stats/summary
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var result = await _statsService.GetSummaryAsync();

        return Ok(result);
    }

    // GET: /api/admin/stats/revenue-chart
    [HttpGet("revenue-chart")]
    public async Task<IActionResult> GetRevenueChart()
    {
        var result = await _statsService.GetRevenueChartAsync();
        return Ok(result);
    }

    // GET: /api/admin/stats/services-chart
    [HttpGet("services-chart")]
    public async Task<IActionResult> GetServicesChart()
    {
        var result = await _statsService.GetServicesChartAsync();
        return Ok(result);
    }
}