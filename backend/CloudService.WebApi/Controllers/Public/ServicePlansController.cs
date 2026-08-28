using CloudService.Application.Interfaces;
using CloudService.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace CloudService.WebApi.Controllers.Public;

[ApiController]
[Route("api/service-plans")]
public class ServicePlansController : ControllerBase
{
    private readonly IServicePlanService _service;
    private readonly QrCodeService _qrCodeService;
    private readonly IConfiguration _configuration;

    public ServicePlansController(IServicePlanService service, QrCodeService qrCodeService, IConfiguration configuration)
    {
        _service = service;
        _qrCodeService = qrCodeService;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var plans = await _service.GetAllAsync();
        return Ok(plans.Where(p => p.IsActive));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var plan = await _service.GetByIdAsync(id);

        if (plan == null || !plan.IsActive)
            return NotFound();
            
        return Ok(plan);
    }

    [HttpGet("{id:guid}/qr")]
    public async Task<IActionResult> GetQrCode(Guid id)
    {
        var plan = await _service.GetByIdAsync(id);
        if (plan == null || !plan.IsActive) return NotFound();

        var price = plan.MonthlyPrice > 0 ? plan.MonthlyPrice : 150000;
        
        var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:3000";
        var paymentText = $"{frontendUrl}/thanh-toan?plan={plan.Id}";
        
        var qrBase64 = _qrCodeService.GenerateQrCodeBase64(paymentText);
        
        // Trả về HTML Image tag hoặc JSON chứa Base64 (tùy frontend xử lý, ở đây trả về JSON để frontend hiển thị dạng src="data:image/png;base64,...")
        return Ok(new { 
            qrImage = $"data:image/png;base64,{qrBase64}",
            planName = plan.Name,
            price = price
        });
    }
}

