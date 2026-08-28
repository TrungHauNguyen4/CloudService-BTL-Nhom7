using CloudService.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/admin/support-tickets")]
[Authorize(Roles = "Admin, Editor")]
public class AdminSupportTicketsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public AdminSupportTicketsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int limit = 20)
    {
        var query = _unitOfWork.SupportTickets.Find(t => true);
        
        var total = await query.CountAsync();
        var tickets = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToListAsync();

        return Ok(new
        {
            Total = total,
            Page = page,
            Limit = limit,
            Data = tickets
        });
    }

    public class ReplyTicketDto
    {
        public string ReplyMessage { get; set; } = string.Empty;
    }

    [HttpPost("{id}/reply")]
    public async Task<IActionResult> Reply(Guid id, [FromBody] ReplyTicketDto dto)
    {
        var ticket = await _unitOfWork.SupportTickets.GetByIdAsync(id);
        if (ticket == null) return NotFound(new { message = "Không tìm thấy ticket." });

        ticket.AdminReply = dto.ReplyMessage;
        ticket.Status = 2; // Answered
        ticket.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync();
        return Ok(new { message = "Đã trả lời thành công." });
    }

    [HttpPost("{id}/close")]
    public async Task<IActionResult> Close(Guid id)
    {
        var ticket = await _unitOfWork.SupportTickets.GetByIdAsync(id);
        if (ticket == null) return NotFound();

        ticket.Status = 3; // Closed
        ticket.UpdatedAt = DateTime.UtcNow;
        await _unitOfWork.SaveChangesAsync();
        
        return Ok(new { message = "Đã đóng ticket." });
    }
}
