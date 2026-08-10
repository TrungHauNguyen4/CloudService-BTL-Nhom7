//Tất cả các bảng dữ liệu đều cần khóa chính (Id) và thời gian tạo (CreatedAt), thời gian cập nhật (UpdatedAt). Thay vì viết lại ở mọi bảng, ta tạo class cha (BaseEntity) để các Entity khác kế thừa, giúp code ngắn gọn (Dry principle).
namespace CloudService.Domain.Common;

public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid(); // Dùng Guid để tăng bảo mật, khó đoán ID
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
