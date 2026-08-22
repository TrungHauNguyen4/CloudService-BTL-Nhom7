using CloudService.Application.DTOs;

namespace CloudService.Application.Interfaces;

public interface INewsArticleService
{
    Task<NewsArticleDto> CreateArticleAsync(
        CreateNewsArticleDto dto,
        Guid currentUserId);

    Task<IEnumerable<NewsArticleDto>> GetAllArticlesAsync();

    Task<NewsArticleDto?> GetArticleByIdAsync(Guid id);

    Task<NewsArticleDto?> GetArticleBySlugAsync(string slug);

    Task<IEnumerable<NewsArticleDto>> GetPublishedArticlesAsync(
    int page,
    int pageSize);

    Task<IEnumerable<NewsArticleDto>> SearchPublishedArticlesAsync(
    string? search,
    int page,
    int pageSize);

    Task<NewsArticleDto?> UpdateArticleAsync(
        Guid id,
        CreateNewsArticleDto dto);

    Task<bool> DeleteArticleAsync(Guid id);
}