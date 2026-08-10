using CloudService.Domain.Entities;

namespace CloudService.Domain.Interfaces;

public interface INewsArticleRepository : IGenericRepository<NewsArticle>
{
    Task<NewsArticle?> GetBySlugAsync(string slug);
    Task<IEnumerable<NewsArticle>> GetPublishedArticlesAsync(int page, int pageSize);//phân trang
}
