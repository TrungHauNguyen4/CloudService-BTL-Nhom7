using CloudService.Domain.Interfaces;
using CloudService.Infrastructure.Data;

namespace CloudService.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public IServiceCategoryRepository ServiceCategories { get; }
    public IServicePlanRepository ServicePlans { get; }
    public INewsArticleRepository NewsArticles { get; }
    public IOrderRequestRepository OrderRequests { get; }
    public IAffiliateApplicationRepository AffiliateApplication { get; }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;

        ServiceCategories = new ServiceCategoryRepository(context);
        ServicePlans = new ServicePlanRepository(context);
        NewsArticles = new NewsArticleRepository(context);
        OrderRequests = new OrderRequestRepository(context);
        AffiliateApplication = new AffiliateApplicationRepository(context);
    }

    public async Task<int> SaveChangesAsync()
        => await _context.SaveChangesAsync();

    public void Dispose()
        => _context.Dispose();
}