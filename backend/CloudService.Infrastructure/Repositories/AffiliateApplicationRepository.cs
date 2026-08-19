using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;

namespace CloudService.Infrastructure.Repositories;

public class AffiliateApplicationRepository
    : GenericRepository<AffiliateApplication>, IAffiliateApplicationRepository
{
    public AffiliateApplicationRepository(AppDbContext context) : base(context)
    {
    }
}