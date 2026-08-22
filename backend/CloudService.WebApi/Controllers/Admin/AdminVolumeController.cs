using CloudService.Application.DTOs;
using CloudService.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/admin/volumes")]
[Authorize(Roles = "Admin")]
public class AdminVolumeController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminVolumeController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllVolumes()
    {
        var volumes = await _context.StorageVolumes
            .Include(v => v.Customer)
            .OrderByDescending(v => v.CreatedAt)
            .Select(v => new
            {
                v.Id,
                v.Name,
                v.Type,
                v.SizeGB,
                v.Region,
                v.Status,
                v.CreatedAt,
                CustomerName = v.Customer!.FullName,
                CustomerEmail = v.Customer.Email
            })
            .ToListAsync();

        return Ok(volumes);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVolume(Guid id)
    {
        var volume = await _context.StorageVolumes.FindAsync(id);
        if (volume == null)
            return NotFound(new { message = "Không tìm thấy Volume" });

        _context.StorageVolumes.Remove(volume);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Xóa Volume thành công" });
    }
}
