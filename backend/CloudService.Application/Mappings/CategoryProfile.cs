using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Domain.Entities;
namespace CloudService.Application.Mappings;
public class CategoryProfile : Profile
{
    public CategoryProfile()
    {
        CreateMap<ServiceCategory, CategoryDto>();
        CreateMap<CreateCategoryDto, ServiceCategory>()
            .ForMember(dest => dest.Slug, opt => opt.Ignore());
    }
}