using CloudService.Application.DTOs;
namespace CloudService.Application.Interfaces;
public interface IAuthService
{
    Task<bool> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto?> LoginAsync(LoginDto dto);
    Task<AuthResponseDto?> RefreshTokenAsync(RefreshTokenDto dto);
    Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto);
}
