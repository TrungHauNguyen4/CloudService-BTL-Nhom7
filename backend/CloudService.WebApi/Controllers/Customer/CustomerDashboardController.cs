using CloudService.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using CloudService.Domain.Enums;

namespace CloudService.WebApi.Controllers.Customer;

[ApiController]
[Route("api/customer/dashboard")]
[Authorize]
public class CustomerDashboardController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public CustomerDashboardController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    private Guid GetUserId()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return idClaim != null ? Guid.Parse(idClaim) : Guid.Empty;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var userId = GetUserId();
        var user = await _unitOfWork.AppUsers.GetByIdAsync(userId);
        
        if (user == null)
            return Unauthorized();

        var activeServicesCount = await _unitOfWork.CustomerServices
            .Find(s => s.CustomerId == userId && s.Status == CustomerServiceStatus.Running)
            .CountAsync();

        return Ok(new
        {
            activeServers = activeServicesCount,
            creditBalance = user.CreditBalance,
            recentActivity = "Hệ thống đang hoạt động ổn định"
        });
    }
}
