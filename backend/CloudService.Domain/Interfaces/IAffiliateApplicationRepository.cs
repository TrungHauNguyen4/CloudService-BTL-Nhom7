using CloudService.Domain.Entities;

namespace CloudService.Domain.Interfaces;

public interface IAffiliateApplicationRepository
    : IGenericRepository<AffiliateApplication>
{
    Task<IEnumerable<AffiliateApplication>> GetPendingAsync();
}