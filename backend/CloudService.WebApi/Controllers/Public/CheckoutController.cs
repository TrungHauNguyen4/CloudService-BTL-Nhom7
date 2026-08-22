using CloudService.Application.Interfaces;
using CloudService.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CloudService.WebApi.Controllers.Public;

[ApiController]
[Route("api/checkout")]
public class CheckoutController : ControllerBase
{
    private readonly AppDbContext _context;

    public CheckoutController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("validate-code")]
    public async Task<IActionResult> ValidateCode([FromQuery] string code)
    {
        if (string.IsNullOrWhiteSpace(code))
        {
            return BadRequest(new { message = "Mã không được để trống" });
        }

        // 1. Kiểm tra Mã Khuyến Mãi (Promotion)
        var promotion = await _context.Promotions
            .FirstOrDefaultAsync(p => p.Code == code && p.IsActive && p.ExpiryDate >= DateTime.UtcNow);
        
        if (promotion != null)
        {
            return Ok(new
            {
                type = "promotion",
                code = promotion.Code,
                discountPercentage = promotion.DiscountPercentage,
                message = $"Áp dụng mã khuyến mãi thành công! Bạn được giảm {promotion.DiscountPercentage}%"
            });
        }

        // 2. Kiểm tra Mã Giới Thiệu (Affiliate)
        var affiliate = await _context.AffiliateApplications
            .FirstOrDefaultAsync(a => a.AffiliateCode == code && a.Status == CloudService.Domain.Enums.OrderStatus.Completed); // Completed means Approved
        
        if (affiliate != null)
        {
            // Lấy cấu hình giảm giá từ SystemSettings
            var setting = await _context.SystemSettings.FirstOrDefaultAsync(s => s.Key == "AffiliateDiscountRate");
            var discountStr = setting?.Value ?? "10"; // Default 10%
            if (!decimal.TryParse(discountStr, out var discountPercentage))
            {
                discountPercentage = 10;
            }

            return Ok(new
            {
                type = "affiliate",
                code = affiliate.AffiliateCode,
                affiliateId = affiliate.Id,
                discountPercentage = discountPercentage,
                message = $"Áp dụng mã giới thiệu thành công! Bạn được giảm {discountPercentage}%"
            });
        }

        return NotFound(new { message = "Mã không hợp lệ hoặc đã hết hạn." });
    }
}
