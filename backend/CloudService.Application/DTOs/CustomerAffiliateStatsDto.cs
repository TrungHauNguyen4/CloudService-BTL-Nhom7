using CloudService.Domain.Enums;

namespace CloudService.Application.DTOs;

public class CustomerAffiliateStatsDto
{
    public bool IsAffiliate { get; set; }
    public OrderStatus? AffiliateStatus { get; set; }
    public int TotalClicks { get; set; } = 0; // Tương lai có thể làm bảng tracking
    public int TotalOrders { get; set; }
    public decimal TotalCommission { get; set; }
    public string AffiliateLink { get; set; } = string.Empty;
    public string AffiliateCode { get; set; } = string.Empty;
    public string CommissionRate { get; set; } = "10";
    public string DiscountRate { get; set; } = "10";
}
