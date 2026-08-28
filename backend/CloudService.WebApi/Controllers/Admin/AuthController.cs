using System.Security.Claims;
using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using CloudService.Domain.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Enums;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUnitOfWork _unitOfWork;

    public AuthController(IAuthService authService, IUnitOfWork unitOfWork)
    {
        _authService = authService;
        _unitOfWork = unitOfWork;
    }

    public class ForgotPasswordDto
    {
        public string Email { get; set; } = string.Empty;
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email))
            return BadRequest(new { message = "Email không hợp lệ." });

        var users = await _unitOfWork.AppUsers.GetAllAsync();
        var user = users.FirstOrDefault(u => u.Email == dto.Email);
        
        if (user == null)
            return Ok(new { message = "Nếu email hợp lệ, bạn sẽ nhận được thông báo cấp lại mật khẩu." });

        var ticket = new SupportTicket
        {
            Id = Guid.NewGuid(),
            TicketCode = $"TK-{DateTime.UtcNow:yyMMdd}-{Random.Shared.Next(1000, 9999)}",
            CustomerId = user.Id,
            CustomerName = user.FullName ?? user.Username,
            Email = user.Email,
            Subject = "Yêu cầu cấp lại mật khẩu",
            Message = $"Khách hàng {user.FullName} ({user.Email}) vừa yêu cầu cấp lại mật khẩu do quên mật khẩu.",
            Status = 1, // 1 = Open
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.SupportTickets.AddAsync(ticket);
        await _unitOfWork.SaveChangesAsync();

        return Ok(new { message = "Nếu email hợp lệ, bạn sẽ nhận được thông báo cấp lại mật khẩu." });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var success = await _authService.RegisterAsync(dto);
        if (!success)
            return BadRequest(new { message = "Email này đã được sử dụng." });

        return Ok(new { message = "Đăng ký thành công!" });
    }

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
