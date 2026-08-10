//Gói dịch vụ cụ thể
using CloudService.Domain.Common;

namespace CloudService.Domain.Entities;

public class ServicePlan : BaseEntity
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Specs { get; set; } // RAM, CPU, SSD...
    public string? QrCodeUrl { get; set; } // Mã QR truy cập nhanh
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ServiceCategory Category { get; set; } = null!;
    public ICollection<PlanPrice> Prices { get; set; } = new List<PlanPrice>();
}
