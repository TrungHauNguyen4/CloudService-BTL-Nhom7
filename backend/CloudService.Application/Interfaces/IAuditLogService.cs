using CloudService.Domain.Entities;

namespace CloudService.Application.Interfaces;

public interface IAuditLogService
{
    Task LogAsync(
        Guid userId,
        string action,
        string entityType,
        string entityId,
        string? oldValue = null,
        string? newValue = null);

    Task<IEnumerable<AuditLog>> GetAllAsync();
}