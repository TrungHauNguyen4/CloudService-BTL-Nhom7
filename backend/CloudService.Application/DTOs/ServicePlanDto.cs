//Khi Frontend yêu cầu xem dữ liệu, hệ thống trả về class này. Nó giấu đi các Navigation Properties phức tạp của Entity.
namespace CloudService.Application.DTOs;

public class ServicePlanDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Specs { get; set; }
    public bool IsActive { get; set; }
}
