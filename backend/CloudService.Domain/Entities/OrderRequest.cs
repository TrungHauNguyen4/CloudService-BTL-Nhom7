//Đây là bảng lưu thông tin người dùng điền từ form "Liên hệ / Đặt dịch vụ".
using CloudService.Domain.Common;
using CloudService.Domain.Enums;

namespace CloudService.Domain.Entities;

public class OrderRequest : BaseEntity
{
    public Guid? CustomerId { get; set; } // Khách hàng có thể đã có tài khoản hoặc vãng lai
    public string ServiceName { get; set; } = string.Empty;
    public Guid? PlanId { get; set; }
    public BillingCycle BillingCycle { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public OrderStatus Status { get; set; } = OrderStatus.New;

    // Navigation properties
    public AppUser? Customer { get; set; }
    public ServicePlan? Plan { get; set; }
    
    // Tracking affiliate
    public Guid? AffiliateId { get; set; }
    
    // Khuyến mãi / Giới thiệu
    public decimal FinalPrice { get; set; }
    public decimal DiscountAmount { get; set; }
    public string? AppliedPromoCode { get; set; }
    public string? AppliedAffiliateCode { get; set; }
}
