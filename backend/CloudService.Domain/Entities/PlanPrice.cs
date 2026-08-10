//Bảng này tách rời khỏi bảng Gói dịch vụ (ServicePlan) bởi vì 1 gói có thể có nhiều mức giá khác nhau tuỳ thuộc vào chu kỳ thanh toán (Theo tháng hoặc Theo năm).
using CloudService.Domain.Common;
using CloudService.Domain.Enums;

namespace CloudService.Domain.Entities;

public class PlanPrice : BaseEntity
{
    public Guid PlanId { get; set; }
    public BillingCycle BillingCycle { get; set; } // Enum: Monthly, Yearly
    public decimal Price { get; set; }
    public decimal OriginalPrice { get; set; }

    // Navigation property
    public ServicePlan Plan { get; set; } = null!;
}
