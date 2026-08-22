using System.Security.Cryptography;
using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using CloudService.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CloudService.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;
    private readonly PasswordHashService _passwordHashService;

    public AuthService(
        AppDbContext context,
        JwtService jwtService,
        PasswordHashService passwordHashService)
    {
        _context = context;
        _jwtService = jwtService;
        _passwordHashService = passwordHashService;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _context.AppUsers
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
            return null;

        if (!_passwordHashService.Verify(
                dto.Password,
                user.PasswordHash))
            return null;

        var token = _jwtService.GenerateToken(user);
        var refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _context.SaveChangesAsync();

        return new AuthResponseDto 
        { 
            Token = token, 
            RefreshToken = refreshToken 
        };
    }

    public async Task<AuthResponseDto?> RefreshTokenAsync(RefreshTokenDto dto)
    {
        var user = await _context.AppUsers
            .FirstOrDefaultAsync(u => u.RefreshToken == dto.RefreshToken);

        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return null;

        var token = _jwtService.GenerateToken(user);
        var newRefreshToken = GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _context.SaveChangesAsync();

        return new AuthResponseDto 
        { 
            Token = token, 
            RefreshToken = newRefreshToken 
        };
    }

    public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto)
    {
        var user = await _context.AppUsers.FindAsync(userId);
        if (user == null) return false;

        if (!_passwordHashService.Verify(dto.OldPassword, user.PasswordHash))
            return false;

        user.PasswordHash = _passwordHashService.Hash(dto.NewPassword);
        await _context.SaveChangesAsync();
        return true;
    }

    private static string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }
}
