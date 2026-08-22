using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services;

public class AuditLogService : IAuditLogService
{
    private readonly IUnitOfWork _unitOfWork;

    public AuditLogService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task LogAsync(
        Guid userId,
        string action,
        string entityType,
        string entityId,
        string? oldValue = null,
        string? newValue = null)
    {
        var auditLog = new AuditLog
        {
            UserId = userId,
            Action = action,
            EntityType = entityType,
            EntityId = entityId,
            OldValue = oldValue,
            NewValue = newValue,
            Timestamp = DateTime.UtcNow
        };

        await _unitOfWork.AuditLogs.AddAsync(auditLog);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<AuditLog>> GetAllAsync()
    {
        return await _unitOfWork.AuditLogs.GetAllAsync();
    }
}