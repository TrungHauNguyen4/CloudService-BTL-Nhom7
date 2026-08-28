using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CategoryService(
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    // =========================
    // GET ALL
    // =========================
    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        var categories =
            await _unitOfWork.ServiceCategories
                .GetAllWithPromotionsAsync(); // Return all categories including inactive ones for Admin

        return _mapper.Map<IEnumerable<CategoryDto>>(categories);
    }

    // =========================
    // CREATE
    // =========================
    public async Task<CategoryDto> CreateAsync(
        CreateCategoryDto dto)
    {
        var category =
            _mapper.Map<ServiceCategory>(dto);

        category.Slug = TaoSlug(dto.Name);

        await _unitOfWork.ServiceCategories
            .AddAsync(category);

        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<CategoryDto>(category);
    }

    // =========================
    // UPDATE
    // =========================
    public async Task<CategoryDto?> UpdateAsync(
        Guid id,
        CreateCategoryDto dto)
    {
        var category =
            await _unitOfWork.ServiceCategories
                .GetByIdAsync(id);

        if (category == null)
        {
            return null;
        }

        category.Name = dto.Name;
        category.Description = dto.Description;
        category.Slug = TaoSlug(dto.Name);
        category.PromotionId = dto.PromotionId;
        category.IsActive = dto.IsActive;
        
        // Manual mapping for JSON string because AutoMapper isn't used for update
        category.SpecSchema = dto.SpecSchema != null ? System.Text.Json.JsonSerializer.Serialize(dto.SpecSchema, (System.Text.Json.JsonSerializerOptions)null) : null;

        _unitOfWork.ServiceCategories.Update(category);

        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<CategoryDto>(category);
    }

    // =========================
    // DELETE
    // =========================
    public async Task<bool> DeleteAsync(Guid id)
    {
        var category =
            await _unitOfWork.ServiceCategories
                .GetByIdAsync(id);

        if (category == null)
        {
            return false;
        }

        _unitOfWork.ServiceCategories.Delete(category);

        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    // =========================
    // TẠO SLUG
    // =========================
    private static string TaoSlug(string name)
    {
        return name
            .Trim()
            .ToLower()
            .Replace(" ", "-");
    }
}