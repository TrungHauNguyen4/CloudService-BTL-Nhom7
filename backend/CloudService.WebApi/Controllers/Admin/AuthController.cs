using System.Security.Claims;
using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
        => _authService = authService;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var response = await _authService.LoginAsync(dto);

        if (response == null)
        {
            return Unauthorized(new { message = "Email hoặc mật khẩu không đúng." });
        }

        return Ok(response);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshTokenDto dto)
    {
        var response = await _authService.RefreshTokenAsync(dto);

        if (response == null)
        {
            return Unauthorized(new { message = "Refresh token không hợp lệ hoặc đã hết hạn." });
        }

        return Ok(response);
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        // Extract user id from JWT token claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var success = await _authService.ChangePasswordAsync(userId, dto);
        if (!success)
            return BadRequest(new { message = "Mật khẩu cũ không đúng hoặc lỗi hệ thống." });

        return Ok(new { message = "Đổi mật khẩu thành công!" });
    }
}
