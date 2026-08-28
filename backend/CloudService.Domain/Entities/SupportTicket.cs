using CloudService.Domain.Common;

namespace CloudService.Domain.Entities;

public class SupportTicket : BaseEntity
{
    public string TicketCode { get; set; } = string.Empty; // e.g. TK-12345
    public string CustomerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? AdminReply { get; set; }
    
    // Status: 1 = Open, 2 = Answered, 3 = Closed
    public int Status { get; set; } = 1;

    // To link to logged-in customer (optional)
    public Guid? CustomerId { get; set; }
    public AppUser? Customer { get; set; }

    // To link to specific service (optional)
    public Guid? CustomerServiceId { get; set; }
    public CustomerService? CustomerService { get; set; }
}
