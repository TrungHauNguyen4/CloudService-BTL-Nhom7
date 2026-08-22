using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Repositories;

public class AuditLogRepository
    : GenericRepository<AuditLog>, IAuditLogRepository
{
    public AuditLogRepository(AppDbContext context)
        : base(context)
    {
    }

    public new async Task<IEnumerable<AuditLog>> GetAllAsync()
        => await _dbSet
            .OrderByDescending(x => x.Timestamp)
            .ToListAsync();
}