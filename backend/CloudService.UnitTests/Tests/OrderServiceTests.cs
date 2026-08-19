using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Application.Services;
using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;
using Moq;
using Xunit;

namespace CloudService.UnitTests.Tests;

public class OrderServiceTests
{
    private readonly Mock<IUnitOfWork> _mockUoW;
    private readonly Mock<IMapper> _mockMapper;
    private readonly OrderService _service;

    public OrderServiceTests()
    {
        _mockUoW = new Mock<IUnitOfWork>();
        _mockMapper = new Mock<IMapper>();
        _service = new OrderService(_mockUoW.Object, _mockMapper.Object);
    }

    [Fact] // Test 6: Đơn hàng mới khi tạo phải luôn có trạng thái mặc định là New
    public async Task CreateOrder_ShouldSetStatusToNew()
    {
        var dto = new CreateOrderDto { PlanId = Guid.NewGuid(), ServiceName = "VPS", CustomerName = "Nguyễn A", Email = "a@test.com", Phone = "012" };
        var entity = new OrderRequest();
        
        _mockMapper.Setup(m => m.Map<OrderRequest>(dto)).Returns(entity);
        _mockMapper.Setup(m => m.Map<OrderDto>(entity)).Returns(new OrderDto());
        _mockUoW.Setup(u => u.OrderRequests.AddAsync(It.IsAny<OrderRequest>())).Returns(Task.CompletedTask);

        await _service.CreateOrderAsync(dto);
        
        Assert.Equal(OrderStatus.New, entity.Status);
    }

    [Fact] // Test 7: Phải gọi lưu CSDL (SaveChanges) 1 lần khi tạo đơn
    public async Task CreateOrder_ShouldCallSaveChanges()
    {
        var dto = new CreateOrderDto { PlanId = Guid.NewGuid(), ServiceName = "VPS" };
        _mockMapper.Setup(m => m.Map<OrderRequest>(dto)).Returns(new OrderRequest());
        _mockMapper.Setup(m => m.Map<OrderDto>(It.IsAny<OrderRequest>())).Returns(new OrderDto());
        _mockUoW.Setup(u => u.OrderRequests.AddAsync(It.IsAny<OrderRequest>())).Returns(Task.CompletedTask);

        await _service.CreateOrderAsync(dto);
        
        _mockUoW.Verify(u => u.SaveChangesAsync(), Times.Once);
    }

    [Fact] // Test 8: Lấy danh sách đơn hàng đang chờ xử lý
    public async Task GetPendingOrders_ShouldCallRepository()
    {
        var orders = new List<OrderRequest>();
        _mockUoW.Setup(u => u.OrderRequests.GetPendingOrdersAsync()).ReturnsAsync(orders);
        _mockMapper.Setup(m => m.Map<IEnumerable<OrderDto>>(orders)).Returns(new List<OrderDto>());

        await _service.GetPendingOrdersAsync();
        
        _mockUoW.Verify(u => u.OrderRequests.GetPendingOrdersAsync(), Times.Once);
    }

    [Fact] // Test 9: Khi cập nhật trạng thái đơn hàng, nếu truyền ID sai thì trả về False
    public async Task UpdateOrderStatus_WhenNotFound_ReturnFalse()
    {
        _mockUoW.Setup(u => u.OrderRequests.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((OrderRequest?)null);
        
        var result = await _service.UpdateOrderStatusAsync(Guid.NewGuid(), OrderStatus.Completed);
        
        Assert.False(result);
    }

    [Fact] // Test 10: Nếu đúng ID, đơn hàng sẽ được cập nhật sang trạng thái mới (VD: Completed)
    public async Task UpdateOrderStatus_WhenFound_ReturnTrueAndUpdate()
    {
        var order = new OrderRequest { Status = OrderStatus.New };
        _mockUoW.Setup(u => u.OrderRequests.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(order);

        var result = await _service.UpdateOrderStatusAsync(Guid.NewGuid(), OrderStatus.Completed);
        
        Assert.True(result);
        Assert.Equal(OrderStatus.Completed, order.Status);
    }

    [Fact] // Test 11: Kiểm tra xem tầng Repository có được gọi Update không
    public async Task UpdateOrderStatus_ShouldCallUpdate()
    {
        var order = new OrderRequest();
        _mockUoW.Setup(u => u.OrderRequests.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync(order);

        await _service.UpdateOrderStatusAsync(Guid.NewGuid(), OrderStatus.Processing);
        
        _mockUoW.Verify(u => u.OrderRequests.Update(order), Times.Once);
    }
}
