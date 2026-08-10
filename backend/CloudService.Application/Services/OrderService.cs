//Business logic thực sự. Ví dụ khi tạo đơn hàng mới, code sẽ tự động gán order.Status = OrderStatus.New trước khi lưu vào cơ sở dữ liệu.
using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services;

public class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public OrderService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<OrderDto> CreateOrderAsync(CreateOrderDto dto)
    {
        var order = _mapper.Map<OrderRequest>(dto);
        
        // Logic nghiệp vụ: Đơn hàng mới luôn ở trạng thái "New"
        order.Status = OrderStatus.New;
        
        await _unitOfWork.OrderRequests.AddAsync(order);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<OrderDto>(order);
    }

    public async Task<IEnumerable<OrderDto>> GetPendingOrdersAsync()
    {
        var orders = await _unitOfWork.OrderRequests.GetPendingOrdersAsync();
        return _mapper.Map<IEnumerable<OrderDto>>(orders);
    }

    public async Task<bool> UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus)
    {
        var order = await _unitOfWork.OrderRequests.GetByIdAsync(orderId);
        if (order == null) return false;

        order.Status = newStatus;
        
        // TODO: (Mở rộng) Ở đây có thể thêm logic ghi Log vào bảng AuditLog
        
        _unitOfWork.OrderRequests.Update(order);
        await _unitOfWork.SaveChangesAsync();
        
        return true;
    }
}
