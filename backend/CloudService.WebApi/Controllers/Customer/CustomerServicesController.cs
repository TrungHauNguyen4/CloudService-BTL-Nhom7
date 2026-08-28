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

    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> CancelService(Guid id)
    {
        var userId = GetUserId();
        var service = await _unitOfWork.CustomerServices.GetByIdAsync(id);
        
        if (service == null || service.CustomerId != userId)
        {
            return NotFound(new { message = "Không tìm thấy dịch vụ." });
        }

        if (service.Status == CloudService.Domain.Enums.CustomerServiceStatus.Cancelled)
        {
            return BadRequest(new { message = "Dịch vụ đã được hủy trước đó." });
        }

        service.Status = CloudService.Domain.Enums.CustomerServiceStatus.Cancelled;
        service.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.CustomerServices.Update(service);
        await _unitOfWork.SaveChangesAsync();

        return Ok(new { message = "Đã hủy gói dịch vụ thành công." });
    }
}
