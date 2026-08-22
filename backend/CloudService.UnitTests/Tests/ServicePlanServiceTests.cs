using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Application.Services;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using Moq;
using Xunit;

namespace CloudService.UnitTests.Tests;

public class ServicePlanServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUoW;
    private readonly Mock<IMapper> _mockMapper;
    private readonly ServicePlanService _service;

    public ServicePlanServiceTests()
    {
        // Khởi tạo các Mock object (Làm giả dữ liệu của UnitOfWork và AutoMapper)
        _mockUoW = new Mock<IUnitOfWork> { DefaultValue = DefaultValue.Mock };
        _mockMapper = new Mock<IMapper>();
        // Tiêm các object giả này vào Service thật cần test
        _service = new ServicePlanService(_mockUoW.Object, _mockMapper.Object);
    }

    [Fact] // Test 1: Đảm bảo GetAll trả về đúng DTO
    public async Task GetAllPlans_ShouldReturnMappedDtos()
    {
        // Arrange (Chuẩn bị)
        var plans = new List<ServicePlan> { new() { Name = "VPS Basic" } };
        var dtos = new List<ServicePlanDto> { new() { Name = "VPS Basic" } };
        
        _mockUoW.Setup(u => u.ServicePlans.GetAllWithDetailsAsync()).ReturnsAsync(plans);
        _mockUoW.Setup(u => u.CustomerServices.GetAllAsync()).ReturnsAsync(new List<CustomerService>());
        _mockMapper.Setup(m => m.Map<IEnumerable<ServicePlanDto>>(plans)).Returns(dtos);

        // Act (Hành động)
        var result = await _service.GetAllAsync();

        // Assert (Kiểm tra kết quả)
        Assert.Single(result);
        Assert.Equal("VPS Basic", result.First().Name);
    }

    [Fact] // Test 2: Nếu truyền ID không tồn tại thì phải trả về Null
    public async Task GetByIdAsync_WhenNotFound_ShouldReturnNull()
    {
        _mockUoW.Setup(u => u.ServicePlans.GetByIdWithDetailsAsync(It.IsAny<Guid>()))
                .ReturnsAsync((ServicePlan?)null);
        
        var result = await _service.GetByIdAsync(Guid.NewGuid());
        
        Assert.Null(result);
    }

    [Fact] // Test 3: Nếu truyền đúng ID thì phải trả về DTO
    public async Task GetByIdAsync_WhenFound_ShouldReturnDto()
    {
        var plan = new ServicePlan { Name = "VPS Pro" };
        var dto = new ServicePlanDto { Name = "VPS Pro" };
        
        _mockUoW.Setup(u => u.ServicePlans.GetByIdWithDetailsAsync(It.IsAny<Guid>())).ReturnsAsync(plan);
        _mockMapper.Setup(m => m.Map<ServicePlanDto>(plan)).Returns(dto);

        var result = await _service.GetByIdAsync(Guid.NewGuid());
        
        Assert.NotNull(result);
        Assert.Equal("VPS Pro", result!.Name);
    }

        [Fact] // Test 4: Khi tạo mới gói, Service phải tự động sinh ra Slug (VD: "VPS Pro Max" -> "vps-pro-max")
    public async Task CreateAsync_ShouldGenerateSlug()
    {
        var createDto = new CreateServicePlanDto { Name = "VPS Pro Max", CategoryId = Guid.NewGuid() };
        var entity = new ServicePlan { Name = "VPS Pro Max" };
        
        _mockMapper.Setup(m => m.Map<ServicePlan>(createDto)).Returns(entity);
        _mockMapper.Setup(m => m.Map<ServicePlanDto>(entity)).Returns(new ServicePlanDto());
        
        // DÒNG THÊM MỚI: Giả lập hành vi thêm vào DB
        _mockUoW.Setup(u => u.ServicePlans.AddAsync(It.IsAny<ServicePlan>())).Returns(Task.CompletedTask);
        _mockUoW.Setup(u => u.SaveChangesAsync()).ReturnsAsync(1);

        await _service.CreateAsync(createDto);
        
        Assert.Equal("vps-pro-max", entity.Slug);
    }


        [Fact] // Test 5: Khi tạo mới, hàm SaveChangesAsync phải được gọi chính xác 1 lần
    public async Task CreateAsync_ShouldCallSaveChanges()
    {
        var createDto = new CreateServicePlanDto { Name = "Test", CategoryId = Guid.NewGuid() };
        
        _mockMapper.Setup(m => m.Map<ServicePlan>(createDto)).Returns(new ServicePlan());
        _mockMapper.Setup(m => m.Map<ServicePlanDto>(It.IsAny<ServicePlan>())).Returns(new ServicePlanDto());

        // DÒNG THÊM MỚI: Giả lập hành vi thêm vào DB
        _mockUoW.Setup(u => u.ServicePlans.AddAsync(It.IsAny<ServicePlan>())).Returns(Task.CompletedTask);

        await _service.CreateAsync(createDto);
        
        _mockUoW.Verify(u => u.SaveChangesAsync(), Times.Once);
    }

}
