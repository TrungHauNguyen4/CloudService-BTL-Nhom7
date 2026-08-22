using CloudService.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace CloudService.WebApi.Controllers.Customer;

[ApiController]
[Route("api/customer/invoices")]
[Authorize]
public class CustomerInvoicesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public CustomerInvoicesController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    private Guid GetUserId()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return idClaim != null ? Guid.Parse(idClaim) : Guid.Empty;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyInvoices()
    {
        var userId = GetUserId();
        var invoices = await _unitOfWork.Invoices
            .Find(i => i.CustomerId == userId)
            .Include(i => i.Service)
            .Select(i => new
            {
                i.Id,
                i.InvoiceNumber,
                i.Amount,
                Status = i.Status.ToString(),
                i.IssueDate,
                i.DueDate,
                i.PaidDate,
                ServiceName = i.Service != null ? i.Service.Name : "Dịch vụ đã xóa"
            })
            .OrderByDescending(i => i.IssueDate)
            .ToListAsync();

        return Ok(invoices);
    }
}
