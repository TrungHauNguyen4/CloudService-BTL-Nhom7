using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Domain.Entities;

namespace CloudService.Application.Mappings;

public class NewsProfile : Profile
{
    public NewsProfile()
    {
        CreateMap<NewsArticle, NewsArticleDto>()
            .ForMember(
                dest => dest.AuthorName,
                opt => opt.MapFrom(src => src.Author.Username)
            );

        CreateMap<CreateNewsArticleDto, NewsArticle>()
            .ForMember(
                dest => dest.Slug,
                opt => opt.Ignore()
            )
            .ForMember(
                dest => dest.AuthorId,
                opt => opt.Ignore()
            );
    }
}