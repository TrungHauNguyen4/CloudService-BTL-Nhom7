//Thông tin trả về cho Admin xem (ẩn bớt các Navigation phức tạp).
using CloudService.Domain.Enums;

namespace CloudService.Application.DTOs;

public class OrderDto
{
    public Guid Id { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public BillingCycle BillingCycle { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public decimal FinalPrice { get; set; }
    public string? Phone { get; set; }
    public string? AppliedPromoCode { get; set; }
    public string? AppliedAffiliateCode { get; set; }
}
