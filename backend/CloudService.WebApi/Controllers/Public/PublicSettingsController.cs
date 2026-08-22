using CloudService.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Public;

[ApiController]
[Route("api/public/settings")]
public class PublicSettingsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public PublicSettingsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var settings = await _unitOfWork.SystemSettings.GetAllAsync();
        
        var result = settings.ToDictionary(s => s.Key, s => s.Value);

        // Fetch highest active promotion
        var activePromotion = (await _unitOfWork.Promotions.GetAllAsync())
            .Where(p => p.IsActive && p.ExpiryDate >= DateTime.UtcNow)
            .OrderByDescending(p => p.DiscountPercentage)
            .FirstOrDefault();

        return Ok(new {
            settings = result,
            activePromotion = activePromotion == null ? null : new {
                code = activePromotion.Code,
                discountPercentage = activePromotion.DiscountPercentage,
                expiryDate = activePromotion.ExpiryDate
            }
        });
    }
}
