using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Application.Services;
using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;
using Moq;
using Xunit;

namespace CloudService.UnitTests.Tests;

public class AffiliateServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUoW;
    private readonly Mock<IMapper> _mockMapper;
    private readonly AffiliateService _service;

    public AffiliateServiceTests()
    {
        _mockUoW = new Mock<IUnitOfWork>();
        _mockMapper = new Mock<IMapper>();
        _service = new AffiliateService(_mockUoW.Object, _mockMapper.Object);
    }

    [Fact] // Test 14: Đăng ký Affiliate mới sẽ có trạng thái OrderStatus.New
    public async Task SubmitApplication_ShouldSetStatusNew()
    {
        var dto = new CreateAffiliateDto { FullName = "B", Email = "b@test.com" }; // Đã sửa tên DTO
        var entity = new AffiliateApplication();
        
        _mockMapper.Setup(m => m.Map<AffiliateApplication>(dto)).Returns(entity);
        _mockUoW.Setup(u => u.AffiliateApplication.AddAsync(It.IsAny<AffiliateApplication>())).Returns(Task.CompletedTask); // Đã sửa tên Repo

        var result = await _service.SubmitApplicationAsync(dto);
        
        Assert.True(result);
        Assert.Equal(OrderStatus.New, entity.Status);
    }

    [Fact] // Test 15: Đăng ký Affiliate phải gọi lệnh SaveChanges
    public async Task SubmitApplication_ShouldCallSaveChanges()
    {
        var dto = new CreateAffiliateDto { FullName = "B", Email = "b@test.com" };
        var entity = new AffiliateApplication();
        
        _mockMapper.Setup(m => m.Map<AffiliateApplication>(dto)).Returns(entity);
        _mockUoW.Setup(u => u.AffiliateApplication.AddAsync(It.IsAny<AffiliateApplication>())).Returns(Task.CompletedTask);

        await _service.SubmitApplicationAsync(dto);
        
        _mockUoW.Verify(u => u.SaveChangesAsync(), Times.Once);
    }
}
