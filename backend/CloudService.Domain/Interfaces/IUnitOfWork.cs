//(Pattern Unit of Work): Mục đích: Quản lý transaction. Đảm bảo nếu cập nhật nhiều bảng cùng lúc, nếu lỗi 1 bảng thì rollback toàn bộ (Data Consistency).
namespace CloudService.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IServiceCategoryRepository ServiceCategories { get; }
    IServicePlanRepository ServicePlans { get; }
    INewsArticleRepository NewsArticles { get; }
    IOrderRequestRepository OrderRequests { get; }
    IAffiliateApplicationRepository AffiliateApplications { get; } 
    IAppUserRepository AppUsers { get; }
    IAuditLogRepository AuditLogs { get; }
    IPromotionRepository Promotions { get; }
    
    IGenericRepository<CloudService.Domain.Entities.CustomerService> CustomerServices { get; }
    IGenericRepository<CloudService.Domain.Entities.Invoice> Invoices { get; }
    IGenericRepository<CloudService.Domain.Entities.ApiKey> ApiKeys { get; }
    IGenericRepository<CloudService.Domain.Entities.SystemSetting> SystemSettings { get; }
    IGenericRepository<CloudService.Domain.Entities.SupportTicket> SupportTickets { get; }

    Task<int> SaveChangesAsync(); // Lưu tất cả vào DB cùng 1 lúc
}
