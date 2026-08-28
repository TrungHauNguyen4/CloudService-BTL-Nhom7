using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace CloudService.WebApi.Controllers.Public;

[ApiController]
[Route("api/support-tickets")]
public class SupportTicketsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public SupportTicketsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public class CreateSupportTicketDto
    {
        public string CustomerName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public Guid? CustomerServiceId { get; set; }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSupportTicketDto dto)
    {
        // Try to identify logged in user
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Guid? customerId = null;
        if (!string.IsNullOrEmpty(idClaim) && Guid.TryParse(idClaim, out var parsedId))
        {
            customerId = parsedId;
            var user = await _unitOfWork.AppUsers.GetByIdAsync(customerId.Value);
            if (user != null)
            {
                dto.CustomerName = string.IsNullOrWhiteSpace(user.FullName) ? user.Username : user.FullName;
                dto.Email = user.Email;
            }
        }

        var ticket = new SupportTicket
        {
            TicketCode = "TK-" + DateTime.Now.ToString("yyMM") + "-" + Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper(),
            CustomerName = dto.CustomerName,
            Email = dto.Email,
            Subject = dto.Subject,
            Message = dto.Message,
            Status = 1, // Open
            CustomerId = customerId,
            CustomerServiceId = dto.CustomerServiceId
        };

        await _unitOfWork.SupportTickets.AddAsync(ticket);
        await _unitOfWork.SaveChangesAsync();

        return Ok(new { 
            message = "Đã gửi yêu cầu thành công.",
            ticketCode = ticket.TicketCode 
        });
    }

    [HttpGet("track/{ticketCode}")]
    public async Task<IActionResult> Track(string ticketCode)
    {
        var ticket = await _unitOfWork.SupportTickets.Find(t => t.TicketCode == ticketCode)
            .Select(t => new {
                t.TicketCode,
                t.Subject,
                t.Message,
                t.AdminReply,
                t.Status,
                t.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (ticket == null)
            return NotFound(new { message = "Không tìm thấy mã yêu cầu này." });

        return Ok(ticket);
    }
}
