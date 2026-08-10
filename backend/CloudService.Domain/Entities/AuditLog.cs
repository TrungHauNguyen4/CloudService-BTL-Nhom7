using System;

namespace CloudService.Domain.Entities;

public class AuditLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string Action { get; set; } = string.Empty; // Ví dụ: Update
    public string EntityType { get; set; } = string.Empty; // Ví dụ: PlanPrice
    public string EntityId { get; set; } = string.Empty;
    public string? OldValue { get; set; } // Lưu dưới dạng JSON
    public string? NewValue { get; set; } // Lưu dưới dạng JSON
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
