namespace CloudService.Application.DTOs;
public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    
    public Guid? PromotionId { get; set; }
    public string? PromotionCode { get; set; }
    public decimal? PromotionDiscountPercentage { get; set; }
    public List<string>? SpecSchema { get; set; }
}

