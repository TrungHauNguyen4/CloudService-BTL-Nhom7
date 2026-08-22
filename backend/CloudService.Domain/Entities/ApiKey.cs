using CloudService.Domain.Common;

namespace CloudService.Domain.Entities;

public class ApiKey : BaseEntity
{
    public Guid CustomerId { get; set; }
    public string Name { get; set; } = string.Empty; // e.g. "Prod_Key"
    public string KeyString { get; set; } = string.Empty; // e.g. "cs_live_xxxx"
    public DateTime? LastUsedAt { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Navigation property
    public AppUser Customer { get; set; } = null!;
}
