using System.Security.Claims;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Customer;

[ApiController]
[Route("api/customer/affiliate")]
[Authorize] // Yêu cầu đăng nhập
public class CustomerAffiliateController : ControllerBase
{
    private readonly ICustomerAffiliateService _affiliateService;

    public CustomerAffiliateController(ICustomerAffiliateService affiliateService)
    {
        _affiliateService = affiliateService;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
        {
            return Unauthorized(new { message = "Không xác định được người dùng." });
        }

        var stats = await _affiliateService.GetAffiliateStatsAsync(userId);
        return Ok(stats);
    }
}
