using CloudService.Domain.Common;
using CloudService.Domain.Enums; // Dùng chung OrderStatus hoặc tạo AffiliateStatus mới

namespace CloudService.Domain.Entities;

public class AffiliateApplication : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Company { get; set; }
    public string? Website { get; set; }
    
    // Có thể tái sử dụng OrderStatus (New, Processing, Completed/Approved, Rejected)
    // hoặc tạo Enum riêng cho Affiliate
    public OrderStatus Status { get; set; } = OrderStatus.New;
    
    public string? AffiliateCode { get; set; }
    
    // Link to the user who applied
    public Guid? AppUserId { get; set; }
    public AppUser? AppUser { get; set; }
}
