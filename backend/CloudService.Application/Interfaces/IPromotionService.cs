using CloudService.Application.DTOs;
namespace CloudService.Application.Interfaces;

public interface IPromotionService
{
    Task<IEnumerable<PromotionDto>> GetAllAsync();
    Task<PromotionDto?> GetByIdAsync(Guid id);
    Task<PromotionDto?> GetByCodeAsync(string code);
    Task<PromotionDto> CreateAsync(CreatePromotionDto dto);
    Task<bool> UpdateAsync(Guid id, UpdatePromotionDto dto);
    Task<bool> DeleteAsync(Guid id);
}
