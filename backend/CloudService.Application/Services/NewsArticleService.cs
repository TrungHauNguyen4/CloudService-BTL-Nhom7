using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services;
public class NewsArticleService : INewsArticleService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public NewsArticleService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<NewsArticleDto> CreateArticleAsync(CreateNewsArticleDto dto, Guid currentUserId)
    {
        var article = _mapper.Map<NewsArticle>(dto);
        article.Slug = dto.Title.ToLower().Replace(" ", "-");
        article.AuthorId = currentUserId; // Gán cứng ID người dùng đang login
        article.PublishedAt = DateTime.UtcNow;
        
        await _unitOfWork.NewsArticles.AddAsync(article);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<NewsArticleDto>(article);
    }
}
