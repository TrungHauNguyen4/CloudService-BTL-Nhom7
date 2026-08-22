using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Repositories;

public class AffiliateApplicationRepository
    : GenericRepository<AffiliateApplication>, IAffiliateApplicationRepository
{
    public AffiliateApplicationRepository(AppDbContext context)
        : base(context)
    {
    }

    public async Task<IEnumerable<AffiliateApplication>> GetPendingAsync()
    {
        return await _dbSet
            .Where(a => a.Status == OrderStatus.New)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }
}