using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Domain.Entities;
namespace CloudService.Application.Mappings;
public class NewsProfile : Profile
{
    public NewsProfile()
    {
        CreateMap<NewsArticle, NewsArticleDto>();
        CreateMap<CreateNewsArticleDto, NewsArticle>()
            .ForMember(dest => dest.Slug, opt => opt.Ignore())
            .ForMember(dest => dest.AuthorId, opt => opt.Ignore());
    }
}