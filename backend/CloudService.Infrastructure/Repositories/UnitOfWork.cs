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
    public IAffiliateApplicationRepository AffiliateApplications { get; }
    public IAppUserRepository AppUsers { get; }
    public IAuditLogRepository AuditLogs { get; }
    public IPromotionRepository Promotions { get; }
    
    public IGenericRepository<CloudService.Domain.Entities.CustomerService> CustomerServices { get; }
    public IGenericRepository<CloudService.Domain.Entities.Invoice> Invoices { get; }
    public IGenericRepository<CloudService.Domain.Entities.ApiKey> ApiKeys { get; }
    public IGenericRepository<CloudService.Domain.Entities.SystemSetting> SystemSettings { get; }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;

        ServiceCategories = new ServiceCategoryRepository(context);
        ServicePlans = new ServicePlanRepository(context);
        NewsArticles = new NewsArticleRepository(context);
        OrderRequests = new OrderRequestRepository(context);
        AffiliateApplications = new AffiliateApplicationRepository(context);
        AppUsers = new AppUserRepository(context);
        AuditLogs = new AuditLogRepository(context);
        Promotions = new PromotionRepository(context);
        
        CustomerServices = new GenericRepository<CloudService.Domain.Entities.CustomerService>(context);
        Invoices = new GenericRepository<CloudService.Domain.Entities.Invoice>(context);
        ApiKeys = new GenericRepository<CloudService.Domain.Entities.ApiKey>(context);
        SystemSettings = new GenericRepository<CloudService.Domain.Entities.SystemSetting>(context);
    }

    public async Task<int> SaveChangesAsync()
        => await _context.SaveChangesAsync();

    public void Dispose()
        => _context.Dispose();
}
