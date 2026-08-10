using CloudService.Domain.Common;

namespace CloudService.Domain.Entities;

public class NewsArticle : BaseEntity
{
    public string Title { get; set; } = string.Empty;//Nội dung chính của bài viết.
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty; // Hướng dẫn, Khuyến mãi...
    public Guid AuthorId { get; set; }//Liên kết bài viết tới tác giả đã đăng (Admin hoặc Editor).
    public DateTime? PublishedAt { get; set; }
    public bool IsPublished { get; set; } = false;//Để hỗ trợ tính năng "Bản nháp" (Draft). Nếu true thì mới hiển thị ra ngoài trang công khai.

    // Navigation property
    public AppUser Author { get; set; } = null!;
}
