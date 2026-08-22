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

    public NewsArticleService(
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    // =========================
    // CREATE
    // =========================
    public async Task<NewsArticleDto> CreateArticleAsync(
        CreateNewsArticleDto dto,
        Guid currentUserId)
    {
        var article = _mapper.Map<NewsArticle>(dto);

        article.Slug = TaoSlug(dto.Title);
        article.AuthorId = currentUserId;

        if (article.IsPublished && article.PublishedAt == null)
        {
            article.PublishedAt = DateTime.UtcNow;
        }

        await _unitOfWork.NewsArticles.AddAsync(article);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<NewsArticleDto>(article);
    }

    // =========================
    // GET ALL
    // =========================
    public async Task<IEnumerable<NewsArticleDto>> GetAllArticlesAsync()
    {
        var articles = await _unitOfWork.NewsArticles.GetAllAsync();

        return _mapper.Map<IEnumerable<NewsArticleDto>>(articles);
    }

    // =========================
    // GET BY ID
    // =========================
    public async Task<NewsArticleDto?> GetArticleByIdAsync(Guid id)
    {
        var article = await _unitOfWork.NewsArticles.GetByIdAsync(id);

        if (article == null)
        {
            return null;
        }

        return _mapper.Map<NewsArticleDto>(article);
    }

    // =========================
    // GET BY SLUG
    // =========================
    public async Task<NewsArticleDto?> GetArticleBySlugAsync(string slug)
    {
        var article = await _unitOfWork.NewsArticles.GetBySlugAsync(slug);

        if (article == null)
        {
            return null;
        }

        return _mapper.Map<NewsArticleDto>(article);
    }

    // =========================
    // UPDATE
    // =========================
    public async Task<NewsArticleDto?> UpdateArticleAsync(
        Guid id,
        CreateNewsArticleDto dto)
    {
        var article = await _unitOfWork.NewsArticles.GetByIdAsync(id);

        if (article == null)
        {
            return null;
        }

        article.Title = dto.Title;
        article.Content = dto.Content;
        article.Category = dto.Category;
        article.Slug = TaoSlug(dto.Title);

        article.IsPublished = dto.IsPublished;

        if (article.IsPublished && article.PublishedAt == null)
        {
            article.PublishedAt = DateTime.UtcNow;
        }

        if (!article.IsPublished)
        {
            article.PublishedAt = null;
        }

        article.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.NewsArticles.Update(article);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<NewsArticleDto>(article);
    }

    // =========================
    // DELETE
    // =========================
    public async Task<bool> DeleteArticleAsync(Guid id)
    {
        var article = await _unitOfWork.NewsArticles.GetByIdAsync(id);

        if (article == null)
        {
            return false;
        }

        _unitOfWork.NewsArticles.Delete(article);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    // =========================
    // TẠO SLUG
    // =========================
    private static string TaoSlug(string title)
    {
        return title
            .Trim()
            .ToLower()
            .Replace(" ", "-");
    }

    // =========================
    public async Task<IEnumerable<NewsArticleDto>> GetPublishedArticlesAsync(
        int page,
        int pageSize)
    {
        if (page < 1)
        {
            page = 1;
        }

        if (pageSize < 1)
        {
            pageSize = 10;
        }

        if (pageSize > 100)
        {
            pageSize = 100;
        }

        var articles = await _unitOfWork.NewsArticles
            .GetPublishedArticlesAsync(page, pageSize);

        return _mapper.Map<IEnumerable<NewsArticleDto>>(articles);
    }
    public async Task<IEnumerable<NewsArticleDto>> SearchPublishedArticlesAsync(
        string? search,
        int page,
        int pageSize)
    {
        if (page < 1)
        {
            page = 1;
        }

        if (pageSize < 1)
        {
            pageSize = 10;
        }

        if (pageSize > 100)
        {
            pageSize = 100;
        }

        var articles = await _unitOfWork.NewsArticles
            .SearchPublishedArticlesAsync(
                search,
                page,
                pageSize);

        return _mapper.Map<IEnumerable<NewsArticleDto>>(articles);
    }
}