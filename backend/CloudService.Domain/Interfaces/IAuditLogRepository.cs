using CloudService.Domain.Entities;

namespace CloudService.Domain.Interfaces;

public interface IAuditLogRepository
{
    Task<IEnumerable<AuditLog>> GetAllAsync();

    Task AddAsync(AuditLog auditLog);
}