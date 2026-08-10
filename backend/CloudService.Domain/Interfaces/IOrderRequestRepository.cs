using CloudService.Domain.Entities;

namespace CloudService.Domain.Interfaces;

public interface IOrderRequestRepository : IGenericRepository<OrderRequest>
{
    Task<IEnumerable<OrderRequest>> GetOrdersByCustomerIdAsync(Guid customerId);//hàm để lấy lịch sử đơn hàng của 1 khách 
    Task<IEnumerable<OrderRequest>> GetPendingOrdersAsync();// Admin lấy danh sách các đơn hàng "Đang chờ xử lý"
}
