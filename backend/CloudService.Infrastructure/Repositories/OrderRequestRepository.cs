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

    public async Task<IEnumerable<OrderRequest>> GetOrdersByCustomerIdAsync(
        Guid customerId)
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
    
    public async Task<IEnumerable<OrderRequest>> GetAllByStatusAsync(
        OrderStatus? status)
    {
        var query = _dbSet
            .Include(o => o.Plan)
            .ThenInclude(p => p.Prices)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(o => o.Status == status.Value);
        }

        return await query
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }
    // Lấy đơn hàng kèm thông tin gói dịch vụ và giá
    public async Task<IEnumerable<OrderRequest>> GetAllWithPlanPricesAsync()
        => await _dbSet
            .Include(o => o.Plan)
                .ThenInclude(p => p.Prices)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
}