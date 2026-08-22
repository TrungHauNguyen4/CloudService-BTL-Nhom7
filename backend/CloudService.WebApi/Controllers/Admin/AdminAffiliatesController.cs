using CloudService.Application.Interfaces;
using CloudService.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/admin/affiliates")]
[Authorize(Roles = "Admin,Editor")]
public class AdminAffiliatesController : ControllerBase
{
    private readonly IAffiliateApplicationService _affiliateService;

    public AdminAffiliatesController(
        IAffiliateApplicationService affiliateService)
    {
        _affiliateService = affiliateService;
    }

    // GET: /api/admin/affiliates/pending
    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        var affiliates = await _affiliateService.GetPendingAsync();

        return Ok(affiliates);
    }

    // PUT: /api/admin/affiliates/{id}/status
    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        [FromBody] UpdateAffiliateStatusRequest request)
    {
        var affiliate = await _affiliateService.UpdateStatusAsync(
            id,
            request.Status);

        if (affiliate == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy đơn đăng ký Affiliate."
            });
        }

        return Ok(affiliate);
    }
}

public class UpdateAffiliateStatusRequest
{
    public OrderStatus Status { get; set; }
}