using CloudService.Domain.Common;
using CloudService.Domain.Enums;

namespace CloudService.Domain.Entities;

public class Invoice : BaseEntity
{
    public Guid CustomerId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty; // e.g. "INV-2026-0001"
    public decimal Amount { get; set; }
    public InvoiceStatus Status { get; set; } = InvoiceStatus.Unpaid;
    
    public DateTime IssueDate { get; set; } = DateTime.UtcNow;
    public DateTime DueDate { get; set; }
    public DateTime? PaidDate { get; set; }
    
    // Khóa ngoại đến dịch vụ được thanh toán
    public Guid? ServiceId { get; set; }
    
    // Navigation properties
    public AppUser Customer { get; set; } = null!;
    public CustomerService? Service { get; set; }
}
