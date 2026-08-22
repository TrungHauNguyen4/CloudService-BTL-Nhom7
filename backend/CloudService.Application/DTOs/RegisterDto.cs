using System.ComponentModel.DataAnnotations;

namespace CloudService.Application.DTOs;

public class RegisterDto
{
    [Required(ErrorMessage = "Tên không được để trống")]
    public string FullName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email không được để trống")]
    [EmailAddress(ErrorMessage = "Email không hợp lệ")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mật khẩu không được để trống")]
    [MinLength(6, ErrorMessage = "Mật khẩu phải từ 6 ký tự")]
    public string Password { get; set; } = string.Empty;
}
