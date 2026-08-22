using CloudService.Domain.Common;
using CloudService.Domain.Enums;

namespace CloudService.Domain.Entities;

public class AppUser : BaseEntity
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } // Admin, Editor

    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }

    // Các bài viết do user này đăng (nếu là Editor/Admin)
    public ICollection<NewsArticle> AuthoredArticles { get; set; } = new List<NewsArticle>();
    
    // Các yêu cầu đặt dịch vụ của user này
    public ICollection<OrderRequest> Orders { get; set; } = new List<OrderRequest>();
}
