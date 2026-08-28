using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Domain.Entities;
namespace CloudService.Application.Mappings;
public class CategoryProfile : Profile
{
    public CategoryProfile()
    {
        CreateMap<ServiceCategory, CategoryDto>()
            .ForMember(dest => dest.PromotionCode, opt => opt.MapFrom(src => src.Promotion != null ? src.Promotion.Code : null))
            .ForMember(dest => dest.PromotionDiscountPercentage, opt => opt.MapFrom(src => src.Promotion != null ? (decimal?)src.Promotion.DiscountPercentage : null))
            .ForMember(dest => dest.SpecSchema, opt => opt.MapFrom(src => string.IsNullOrEmpty(src.SpecSchema) ? null : System.Text.Json.JsonSerializer.Deserialize<List<string>>(src.SpecSchema, (System.Text.Json.JsonSerializerOptions)null)));
            
        CreateMap<CreateCategoryDto, ServiceCategory>()
            .ForMember(dest => dest.Slug, opt => opt.Ignore())
            .ForMember(dest => dest.SpecSchema, opt => opt.MapFrom(src => src.SpecSchema != null ? System.Text.Json.JsonSerializer.Serialize(src.SpecSchema, (System.Text.Json.JsonSerializerOptions)null) : null));
    }
}