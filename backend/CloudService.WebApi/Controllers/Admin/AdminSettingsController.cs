using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/admin/settings")]
[Authorize(Roles = "Admin")]
public class AdminSettingsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public AdminSettingsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var settings = (await _unitOfWork.SystemSettings.GetAllAsync()).ToList();
        
        // Ensure defaults exist
        bool added = false;
        if (!settings.Any(s => s.Key == "AffiliateDiscountRate"))
        {
            var s1 = new SystemSetting { Key = "AffiliateDiscountRate", Value = "10", Description = "Phần trăm giảm giá cho khách hàng nhập mã" };
            await _unitOfWork.SystemSettings.AddAsync(s1);
            settings.Add(s1);
            added = true;
        }
        if (!settings.Any(s => s.Key == "AffiliateCommissionRate"))
        {
            var s2 = new SystemSetting { Key = "AffiliateCommissionRate", Value = "10", Description = "Phần trăm hoa hồng cho đối tác Affiliate" };
            await _unitOfWork.SystemSettings.AddAsync(s2);
            settings.Add(s2);
            added = true;
        }
        if (!settings.Any(s => s.Key == "YearlyDiscountRate"))
        {
            var s3 = new SystemSetting { Key = "YearlyDiscountRate", Value = "16", Description = "Phần trăm giảm giá khi mua chu kỳ 1 năm" };
            await _unitOfWork.SystemSettings.AddAsync(s3);
            settings.Add(s3);
            added = true;
        }

        if (added) await _unitOfWork.SaveChangesAsync();

        return Ok(settings);
    }

    [HttpPut("{key}")]
    public async Task<IActionResult> UpdateSetting(string key, [FromBody] UpdateSettingRequest request)
    {
        var settings = await _unitOfWork.SystemSettings.GetAllAsync();
        var setting = settings.FirstOrDefault(s => s.Key == key);

        if (setting == null)
        {
            setting = new SystemSetting { Key = key, Value = request.Value, Description = "Cấu hình tự động tạo" };
            await _unitOfWork.SystemSettings.AddAsync(setting);
        }
        else
        {
            setting.Value = request.Value;
            setting.UpdatedAt = DateTime.UtcNow;
            _unitOfWork.SystemSettings.Update(setting);
        }

        await _unitOfWork.SaveChangesAsync();

        return Ok(setting);
    }
}

public class UpdateSettingRequest
{
    public string Value { get; set; } = string.Empty;
}
