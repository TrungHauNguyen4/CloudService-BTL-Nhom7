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

    public CategoryService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        var categories = await _unitOfWork.ServiceCategories.GetActiveCategoriesAsync();
        return _mapper.Map<IEnumerable<CategoryDto>>(categories);
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
    {
        var category = _mapper.Map<ServiceCategory>(dto);
        category.Slug = dto.Name.ToLower().Replace(" ", "-");
        
        await _unitOfWork.ServiceCategories.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<CategoryDto>(category);
    }
}
