using CloudService.Domain.Entities;
using CloudService.Domain.Enums;

namespace CloudService.Application.Interfaces;

public interface IAffiliateApplicationService
{
    Task<IEnumerable<AffiliateApplication>> GetPendingAsync();
    Task<IEnumerable<AffiliateApplication>> GetAllAsync();

    Task<AffiliateApplication?> UpdateStatusAsync(
        Guid id,
        OrderStatus status);
}