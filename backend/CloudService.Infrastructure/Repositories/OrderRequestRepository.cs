using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Repositories;

public class OrderRequestRepository
    : GenericRepository<OrderRequest>, IOrderRequestRepository
{
    public OrderRequestRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<OrderRequest>> GetOrdersByCustomerIdAsync(Guid customerId)
        => await _dbSet
            .Where(o => o.CustomerId == customerId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

    public async Task<IEnumerable<OrderRequest>> GetPendingOrdersAsync()
        => await _dbSet
            .Where(o => o.Status == OrderStatus.New ||
                        o.Status == OrderStatus.Processing)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
}