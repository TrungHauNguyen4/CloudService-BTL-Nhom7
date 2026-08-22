using CloudService.Domain.Common;

namespace CloudService.Domain.Entities;

public class Promotion : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public decimal DiscountPercentage { get; set; }
    public DateTime ExpiryDate { get; set; }
    public bool IsActive { get; set; } = true;
}
