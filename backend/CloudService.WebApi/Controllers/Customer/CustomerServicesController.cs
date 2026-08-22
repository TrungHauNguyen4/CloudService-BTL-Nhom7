using CloudService.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace CloudService.WebApi.Controllers.Customer;

[ApiController]
[Route("api/customer/services")]
[Authorize]
public class CustomerServicesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public CustomerServicesController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    private Guid GetUserId()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return idClaim != null ? Guid.Parse(idClaim) : Guid.Empty;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyServices()
    {
        var userId = GetUserId();
        var services = await _unitOfWork.CustomerServices
            .Find(s => s.CustomerId == userId)
            .Include(s => s.Plan)
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.IpAddress,
                s.Os,
                Status = s.Status.ToString(),
                s.CpuUsage,
                s.RamUsage,
                s.ExpiresAt
            })
            .ToListAsync();

        return Ok(services);
    }
}
