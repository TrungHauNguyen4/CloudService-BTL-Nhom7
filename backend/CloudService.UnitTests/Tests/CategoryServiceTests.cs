using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Application.Services;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using Moq;
using Xunit;

namespace CloudService.UnitTests.Tests;

public class CategoryServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUoW;
    private readonly Mock<IMapper> _mockMapper;
    private readonly CategoryService _service; // Đã sửa tên chuẩn với Source Code

    public CategoryServiceTests()
    {
        _mockUoW = new Mock<IUnitOfWork>();
        _mockMapper = new Mock<IMapper>();
        _service = new CategoryService(_mockUoW.Object, _mockMapper.Object);
    }

    [Fact] // Test 12: Lấy tất cả danh mục
    public async Task GetAllCategories_ShouldReturnDtos()
    {
        var categories = new List<ServiceCategory> { new() { Name = "VPS" } };
        
        // Đã sửa tên hàm cho khớp với TV2 code
        _mockUoW.Setup(u => u.ServiceCategories.GetActiveCategoriesAsync()).ReturnsAsync(categories);
        _mockMapper.Setup(m => m.Map<IEnumerable<CategoryDto>>(categories)).Returns(new List<CategoryDto>());

        await _service.GetAllAsync();
        _mockUoW.Verify(u => u.ServiceCategories.GetActiveCategoriesAsync(), Times.Once);
    }

    [Fact] // Test 13: Tạo mới danh mục sinh ra Slug
    public async Task CreateCategory_ShouldGenerateSlugAndSave()
    {
        var dto = new CreateCategoryDto { Name = "Web Hosting" }; // Sửa tên DTO
        var entity = new ServiceCategory { Name = "Web Hosting" };
        
        _mockMapper.Setup(m => m.Map<ServiceCategory>(dto)).Returns(entity);
        _mockMapper.Setup(m => m.Map<CategoryDto>(entity)).Returns(new CategoryDto());
        _mockUoW.Setup(u => u.ServiceCategories.AddAsync(It.IsAny<ServiceCategory>())).Returns(Task.CompletedTask);

        await _service.CreateAsync(dto);
        
        Assert.Equal("web-hosting", entity.Slug);
        _mockUoW.Verify(u => u.SaveChangesAsync(), Times.Once);
    }
}
