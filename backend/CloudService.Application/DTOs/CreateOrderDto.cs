//khách đặt hàng, họ chỉ gửi lên các thông tin cơ bản (Tên, Email, Gói cần mua).
using CloudService.Domain.Enums;

namespace CloudService.Application.DTOs;

public class CreateOrderDto
{
    public Guid? CustomerId { get; set; }
    public Guid? PlanId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public BillingCycle BillingCycle { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public Guid? AffiliateId { get; set; }
    public string? DiscountCode { get; set; }
}
