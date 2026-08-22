using CloudService.Domain.Common;

namespace CloudService.Domain.Entities;

public class StorageVolume : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "Block Storage (NVMe)";
    public int SizeGB { get; set; } = 10;
    public string Region { get; set; } = "VN-HCM-1";
    public string Status { get; set; } = "Available"; // Available, Attached, Error
    
    // Khóa ngoại liên kết với AppUser (Khách hàng sở hữu Volume)
    public Guid CustomerId { get; set; }
    public AppUser? Customer { get; set; }
}
