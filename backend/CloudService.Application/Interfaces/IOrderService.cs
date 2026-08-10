//Hợp đồng cho Service đặt hàng.
using CloudService.Application.DTOs;
using CloudService.Domain.Enums;

namespace CloudService.Application.Interfaces;

public interface IOrderService
{
    Task<OrderDto> CreateOrderAsync(CreateOrderDto dto);
    Task<IEnumerable<OrderDto>> GetPendingOrdersAsync();
    Task<bool> UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus);
}
