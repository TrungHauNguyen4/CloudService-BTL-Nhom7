using CloudService.Application.DTOs;

namespace CloudService.Application.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllAsync();

    Task<CategoryDto> CreateAsync(
        CreateCategoryDto dto);

    Task<CategoryDto?> UpdateAsync(
        Guid id,
        CreateCategoryDto dto);

    Task<bool> DeleteAsync(
        Guid id);
}