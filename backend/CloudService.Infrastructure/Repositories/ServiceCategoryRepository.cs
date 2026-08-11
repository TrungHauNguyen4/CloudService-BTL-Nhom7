using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Repositories;

public class ServiceCategoryRepository
    : GenericRepository<ServiceCategory>, IServiceCategoryRepository
{
    public ServiceCategoryRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<ServiceCategory?> GetBySlugAsync(string slug)
        => await _dbSet
            .FirstOrDefaultAsync(c => c.Slug == slug);

    public async Task<IEnumerable<ServiceCategory>> GetActiveCategoriesAsync()
        => await _dbSet
            .Where(c => c.IsActive)
            .ToListAsync();
}