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

    public async Task<ServicePlan?> GetByIdWithDetailsAsync(Guid id)
        => await _dbSet
            .Include(p => p.Prices)
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<IEnumerable<ServicePlan>> GetAllWithDetailsAsync()
        => await _dbSet
            .Include(p => p.Prices)
            .Include(p => p.Category)
            .ToListAsync();

    public void AddPrice(PlanPrice price)
        => _context.Set<PlanPrice>().Add(price);
}