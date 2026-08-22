using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Public;

[ApiController]
[Route("api/public/news")]
public class NewsArticlesController : ControllerBase
{
    private readonly INewsArticleService _newsArticleService;

    public NewsArticlesController(
        INewsArticleService newsArticleService)
    {
        _newsArticleService = newsArticleService;
    }

    // GET: api/public/news?page=1&pageSize=10
    [HttpGet]
    public async Task<ActionResult<IEnumerable<NewsArticleDto>>> GetPublishedNews(
        [FromQuery] string? search = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var articles = await _newsArticleService
            .SearchPublishedArticlesAsync(
                search,
                page,
                pageSize);

        return Ok(articles);
    }

    // GET: api/public/news/{slug}
    [HttpGet("{slug}")]
    public async Task<ActionResult<NewsArticleDto>> GetBySlug(
        string slug)
    {
        var article = await _newsArticleService
            .GetArticleBySlugAsync(slug);

        if (article == null || !article.IsPublished)
        {
            return NotFound(new
            {
                message = "Không tìm thấy bài viết."
            });
        }

        return Ok(article);
    }
}