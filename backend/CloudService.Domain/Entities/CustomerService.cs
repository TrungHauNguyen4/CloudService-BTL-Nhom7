using CloudService.Domain.Common;
using CloudService.Domain.Enums;

namespace CloudService.Domain.Entities;

public class CustomerService : BaseEntity
{
    public Guid CustomerId { get; set; }
    public Guid PlanId { get; set; }
    public string Name { get; set; } = string.Empty; // e.g., "Web Server Prod"
    public string IpAddress { get; set; } = string.Empty; // e.g., "103.19.12.55"
    public string Os { get; set; } = string.Empty; // e.g., "Ubuntu 24.04"
    public CustomerServiceStatus Status { get; set; } = CustomerServiceStatus.Running;
    
    public double CpuUsage { get; set; } = 0; // %
    public double RamUsage { get; set; } = 0; // %
    
    public DateTime? ExpiresAt { get; set; }

    // Navigation properties
    public AppUser Customer { get; set; } = null!;
    public ServicePlan Plan { get; set; } = null!;
}
