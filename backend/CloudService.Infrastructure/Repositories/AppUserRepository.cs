using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Repositories;

public class AppUserRepository
    : GenericRepository<AppUser>, IAppUserRepository
{
    public AppUserRepository(AppDbContext context)
        : base(context)
    {
    }

    public async Task<AppUser?> GetByEmailAsync(string email)
    {
        return await _dbSet
            .FirstOrDefaultAsync(u => u.Email == email);
    }
}