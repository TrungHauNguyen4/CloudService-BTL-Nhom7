using CloudService.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using CloudService.Domain.Entities;

namespace CloudService.WebApi.Controllers.Customer;

[ApiController]
[Route("api/customer/profile")]
[Authorize]
public class CustomerProfileController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public CustomerProfileController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    private Guid GetUserId()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return idClaim != null ? Guid.Parse(idClaim) : Guid.Empty;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();
        var user = await _unitOfWork.AppUsers.GetByIdAsync(userId);
        
        if (user == null)
            return Unauthorized();

        var apiKeys = await _unitOfWork.ApiKeys
            .Find(k => k.CustomerId == userId)
            .Select(k => new { k.Id, k.Name, k.KeyString, k.CreatedAt, k.LastUsedAt, k.IsActive })
            .ToListAsync();

        return Ok(new
        {
            user.FullName,
            user.Email,
            user.CompanyName,
            user.Is2faEnabled,
            ApiKeys = apiKeys
        });
    }

    public class UpdateProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string? CompanyName { get; set; }
    }

    [HttpPut]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = GetUserId();
        var user = await _unitOfWork.AppUsers.GetByIdAsync(userId);
        if (user == null) return Unauthorized();

        user.FullName = dto.FullName;
        user.CompanyName = dto.CompanyName;

        await _unitOfWork.SaveChangesAsync();
        return Ok(new { message = "Cập nhật thành công" });
    }

    [HttpPost("2fa/toggle")]
    public async Task<IActionResult> Toggle2fa()
    {
        var userId = GetUserId();
        var user = await _unitOfWork.AppUsers.GetByIdAsync(userId);
        if (user == null) return Unauthorized();

        user.Is2faEnabled = !user.Is2faEnabled;
        await _unitOfWork.SaveChangesAsync();
        
        return Ok(new { is2faEnabled = user.Is2faEnabled });
    }

    [HttpPost("api-keys")]
    public async Task<IActionResult> GenerateApiKey([FromBody] ApiKeyRequest request)
    {
        var userId = GetUserId();
        var newKey = new ApiKey
        {
            CustomerId = userId,
            Name = string.IsNullOrEmpty(request.Name) ? "API Key" : request.Name,
            KeyString = "cs_" + Guid.NewGuid().ToString("N")
        };
        await _unitOfWork.ApiKeys.AddAsync(newKey);
        await _unitOfWork.SaveChangesAsync();

        return Ok(newKey);
    }
    
    public class ApiKeyRequest { public string? Name { get; set; } }
}
