using CloudService.Application.DTOs;
using CloudService.Domain.Entities;
using CloudService.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CloudService.WebApi.Controllers.Customer;

[ApiController]
[Route("api/customer/volumes")]
[Authorize]
public class CustomerVolumeController : ControllerBase
{
    private readonly AppDbContext _context;

    public CustomerVolumeController(AppDbContext context)
    {
        _context = context;
    }

    private Guid GetUserId()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return idClaim != null ? Guid.Parse(idClaim) : Guid.Empty;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyVolumes()
    {
        var userId = GetUserId();
        var volumes = await _context.StorageVolumes
            .Where(v => v.CustomerId == userId)
            .OrderByDescending(v => v.CreatedAt)
            .Select(v => new StorageVolumeDto
            {
                Id = v.Id,
                Name = v.Name,
                Type = v.Type,
                SizeGB = v.SizeGB,
                Region = v.Region,
                Status = v.Status,
                CreatedAt = v.CreatedAt
            })
            .ToListAsync();

        return Ok(volumes);
    }

    [HttpPost]
    public async Task<IActionResult> CreateVolume([FromBody] CreateVolumeDto dto)
    {
        var userId = GetUserId();
        
        var volume = new StorageVolume
        {
            Name = dto.Name,
            Type = dto.Type,
            SizeGB = dto.SizeGB,
            Region = dto.Region,
            Status = "Available",
            CustomerId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.StorageVolumes.Add(volume);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Tạo Volume thành công", id = volume.Id });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVolume(Guid id)
    {
        var userId = GetUserId();
        var volume = await _context.StorageVolumes.FirstOrDefaultAsync(v => v.Id == id && v.CustomerId == userId);

        if (volume == null)
            return NotFound(new { message = "Không tìm thấy Volume hoặc bạn không có quyền xóa." });

        _context.StorageVolumes.Remove(volume);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Xóa Volume thành công" });
    }
}
