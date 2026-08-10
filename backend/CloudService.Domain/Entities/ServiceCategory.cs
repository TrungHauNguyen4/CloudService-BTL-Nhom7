//Đây là các model ánh xạ trực tiếp với bảng trong Database theo yêu cầu đề bài. Tại sao phải làm? Để định nghĩa cấu trúc dữ liệu và các mối quan hệ (1-n, n-n) giữa chúng.
//Danh mục dịch vụ như VPS, Hosting
using CloudService.Domain.Common;

namespace CloudService.Domain.Entities;

public class ServiceCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty; // URL thân thiện (vd: vps-gia-re)
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation property: 1 danh mục có nhiều gói dịch vụ
    public ICollection<ServicePlan> ServicePlans { get; set; } = new List<ServicePlan>();
}
