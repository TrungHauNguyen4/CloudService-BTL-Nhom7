//Khi người dùng hoặc Admin gửi dữ liệu lên để Tạo mới một gói dịch vụ, họ chỉ cần gửi Name, CategoryId, Specs và IsActive
namespace CloudService.Application.DTOs;

public class CreateServicePlanDto
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Specs { get; set; }
    public bool IsActive { get; set; } = true;
}
