using CloudService.Domain.Common;
using CloudService.Domain.Enums;

namespace CloudService.Domain.Entities;

public class AppUser : BaseEntity
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } // Admin, Editor

    // Thêm các trường cho Customer Dashboard
    public string FullName { get; set; } = string.Empty;
    public string? CompanyName { get; set; }
    public decimal CreditBalance { get; set; } = 0;
    public bool Is2faEnabled { get; set; } = false;
    public string? TotpSecret { get; set; }

    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }

    // Các bài viết do user này đăng (nếu là Editor/Admin)
    public ICollection<NewsArticle> AuthoredArticles { get; set; } = new List<NewsArticle>();
    
    // Các yêu cầu đặt dịch vụ của user này
    public ICollection<OrderRequest> Orders { get; set; } = new List<OrderRequest>();

    // Các dịch vụ (VPS, Hosting) đang sử dụng
    public ICollection<CustomerService> Services { get; set; } = new List<CustomerService>();
    
    // Hóa đơn
    public ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    
    // API Keys
    public ICollection<ApiKey> ApiKeys { get; set; } = new List<ApiKey>();

    // Storage Volumes
    public ICollection<StorageVolume> StorageVolumes { get; set; } = new List<StorageVolume>();
}
