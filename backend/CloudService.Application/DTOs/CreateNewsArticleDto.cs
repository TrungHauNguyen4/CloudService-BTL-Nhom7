namespace CloudService.Application.DTOs;
public class CreateNewsArticleDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    // Chú ý: Không truyền AuthorId từ Client lên để bảo mật
}
