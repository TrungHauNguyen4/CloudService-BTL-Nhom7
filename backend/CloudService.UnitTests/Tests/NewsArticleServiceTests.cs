using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Application.Services;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using Moq;
using Xunit;

namespace CloudService.UnitTests.Tests;

public class NewsArticleServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUoW;
    private readonly Mock<IMapper> _mockMapper;
    private readonly NewsArticleService _service;

    public NewsArticleServiceTests()
    {
        _mockUoW = new Mock<IUnitOfWork>();
        _mockMapper = new Mock<IMapper>();
        _service = new NewsArticleService(_mockUoW.Object, _mockMapper.Object);
    }

    [Fact] // Test 16: Tạo bài viết mới sinh ra Slug và gán AuthorId
    public async Task CreateArticle_ShouldGenerateSlugAndAssignAuthor()
    {
        var dto = new CreateNewsArticleDto { Title = "Tin Hot" };
        var entity = new NewsArticle { Title = "Tin Hot" };
        var authorId = Guid.NewGuid();

        _mockMapper.Setup(m => m.Map<NewsArticle>(dto)).Returns(entity);
        _mockMapper.Setup(m => m.Map<NewsArticleDto>(entity)).Returns(new NewsArticleDto());
        _mockUoW.Setup(u => u.NewsArticles.AddAsync(It.IsAny<NewsArticle>())).Returns(Task.CompletedTask);

        await _service.CreateArticleAsync(dto, authorId);
        
        Assert.Equal("tin-hot", entity.Slug);
        Assert.Equal(authorId, entity.AuthorId);
        _mockUoW.Verify(u => u.SaveChangesAsync(), Times.Once);
    }
}
