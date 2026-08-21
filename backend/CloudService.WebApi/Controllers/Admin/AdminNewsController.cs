using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers;

[ApiController]
[Route("api/admin/news")]
[Authorize(Roles = "Admin,Editor")]
public class AdminNewsController : ControllerBase
{
    private readonly INewsArticleService _newsArticleService;

    public AdminNewsController(INewsArticleService newsArticleService)
    {
        _newsArticleService = newsArticleService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NewsArticleDto>>> GetAll()
    {
        var articles = await _newsArticleService.GetAllArticlesAsync();

        return Ok(articles);
    }

    [HttpPost]
    public async Task<ActionResult<NewsArticleDto>> Create(
        [FromBody] CreateNewsArticleDto dto)
    {
        var userIdClaim = User.FindFirst(
            System.Security.Claims.ClaimTypes.NameIdentifier);

        if (userIdClaim == null ||
            !Guid.TryParse(userIdClaim.Value, out var currentUserId))
        {
            return Unauthorized(new
            {
                message = "Không xác định được người dùng đăng nhập."
            });
        }

        var article = await _newsArticleService.CreateArticleAsync(
            dto,
            currentUserId);

        return Ok(article);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<NewsArticleDto>> Update(
        Guid id,
        [FromBody] CreateNewsArticleDto dto)
    {
        var article = await _newsArticleService.UpdateArticleAsync(
            id,
            dto);

        if (article == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy bài viết."
            });
        }

        return Ok(article);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _newsArticleService.DeleteArticleAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Không tìm thấy bài viết."
            });
        }

        return NoContent();
    }
}