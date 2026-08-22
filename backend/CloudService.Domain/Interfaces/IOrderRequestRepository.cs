using CloudService.Domain.Entities;
using CloudService.Domain.Enums;

namespace CloudService.Domain.Interfaces;

public interface IOrderRequestRepository : IGenericRepository<OrderRequest>
{
    Task<IEnumerable<OrderRequest>> GetOrdersByCustomerIdAsync(
        Guid customerId);

    Task<IEnumerable<OrderRequest>> GetPendingOrdersAsync();

    Task<IEnumerable<OrderRequest>> GetAllWithPlanPricesAsync();

    Task<IEnumerable<OrderRequest>> GetAllByStatusAsync(
        OrderStatus? status);
}