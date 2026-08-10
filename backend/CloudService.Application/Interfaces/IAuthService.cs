using CloudService.Application.DTOs;
namespace CloudService.Application.Interfaces;
public interface IAuthService
{
    // Hàm này sẽ trả về chuỗi Token JWT nếu đăng nhập thành công
    Task<string?> LoginAsync(LoginDto dto);
}
