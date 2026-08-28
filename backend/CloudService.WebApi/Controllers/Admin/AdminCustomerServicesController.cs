using CloudService.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/admin/customer-services")]
[Authorize(Roles = "Admin")]
public class AdminCustomerServicesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public AdminCustomerServicesController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var services = await _unitOfWork.CustomerServices.Find(s => true)
            .Include(s => s.Customer)
            .Include(s => s.Plan)
            .Select(s => new
            {
                s.Id,
                CustomerName = s.Customer != null ? (string.IsNullOrEmpty(s.Customer.FullName) ? s.Customer.Username : s.Customer.FullName) : "N/A",
                CustomerEmail = s.Customer != null ? s.Customer.Email : "N/A",
                ServiceName = s.Name,
                PlanName = s.Plan != null ? s.Plan.Name : "N/A",
                s.IpAddress,
                s.Os,
                Status = s.Status.ToString(),
                s.CpuUsage,
                s.RamUsage,
                s.CreatedAt,
                s.ExpiresAt
            })
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        return Ok(services);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> HardDeleteService(Guid id)
    {
        var service = await _unitOfWork.CustomerServices.GetByIdAsync(id);
        
        if (service == null)
        {
            return NotFound(new { message = "Không tìm thấy dịch vụ." });
        }

        _unitOfWork.CustomerServices.Delete(service);
        await _unitOfWork.SaveChangesAsync();

        return Ok(new { message = "Đã xóa và giải phóng dịch vụ thành công." });
    }
}
