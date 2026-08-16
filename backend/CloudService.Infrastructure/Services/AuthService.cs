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

    public async Task<string?> LoginAsync(LoginDto dto)
    {
        var user = await _context.AppUsers
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
            return null;

        if (!_passwordHashService.Verify(
                dto.Password,
                user.PasswordHash))
            return null;

        return _jwtService.GenerateToken(user);
    }
}