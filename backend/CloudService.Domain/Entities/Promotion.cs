//Chương trình Khuyến Mãi
using CloudService.Domain.Common;

namespace CloudService.Domain.Entities;

public class Promotion : BaseEntity
{
    public Guid PlanId { get; set; }
    public decimal DiscountPercent { get; set; } // Ví dụ: giảm giá 20 cho 20%
    public DateTime StartDate { get; set; }//khuyến mãi có thời hạn 
    public DateTime EndDate { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation property
    public ServicePlan Plan { get; set; } = null!;
}
