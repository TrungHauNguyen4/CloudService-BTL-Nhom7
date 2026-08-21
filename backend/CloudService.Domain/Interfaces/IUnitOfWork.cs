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
    Task<int> SaveChangesAsync(); // Lưu tất cả vào DB cùng 1 lúc
}
