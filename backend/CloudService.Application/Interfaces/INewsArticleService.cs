using CloudService.Application.DTOs;
namespace CloudService.Application.Interfaces;
public interface INewsArticleService
{
    Task<NewsArticleDto> CreateArticleAsync(CreateNewsArticleDto dto, Guid currentUserId);
}