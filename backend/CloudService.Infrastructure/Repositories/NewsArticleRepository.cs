using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Repositories;

public class NewsArticleRepository
    : GenericRepository<NewsArticle>, INewsArticleRepository
{
    public NewsArticleRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<NewsArticle?> GetBySlugAsync(string slug)
        => await _dbSet
            .Include(a => a.Author)
            .FirstOrDefaultAsync(a => a.Slug == slug);

    public async Task<IEnumerable<NewsArticle>> GetPublishedArticlesAsync(
        int page,
        int pageSize)
        => await _dbSet
            .Where(a => a.IsPublished)
            .OrderByDescending(a => a.PublishedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(a => a.Author)
            .ToListAsync();
        public async Task<IEnumerable<NewsArticle>> SearchPublishedArticlesAsync(
            string? search,
            int page,
            int pageSize)
        {
            var query = _dbSet
                .Where(a => a.IsPublished)
                .Include(a => a.Author)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim();

                query = query.Where(a =>
                    a.Title.Contains(search));
            }

            return await query
                .OrderByDescending(a => a.PublishedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }
}