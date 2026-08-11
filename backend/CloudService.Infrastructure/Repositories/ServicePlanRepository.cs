using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Repositories;

public class ServicePlanRepository 
    : GenericRepository<ServicePlan>, IServicePlanRepository
{
    public ServicePlanRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<ServicePlan?> GetBySlugAsync(string slug)
        => await _dbSet
            .Include(p => p.Prices)
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Slug == slug);

    public async Task<IEnumerable<ServicePlan>> GetActivePlansByCategoryAsync(Guid categoryId)
        => await _dbSet
            .Where(p => p.CategoryId == categoryId && p.IsActive)
            .Include(p => p.Prices)
            .ToListAsync();
}