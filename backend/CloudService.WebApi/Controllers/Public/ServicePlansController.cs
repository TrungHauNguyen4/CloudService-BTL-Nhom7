using CloudService.Application.Interfaces;
using CloudService.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Public;

[ApiController]
[Route("api/service-plans")]
public class ServicePlansController : ControllerBase
{
    private readonly IServicePlanService _service;
    private readonly QrCodeService _qrCodeService;

    public ServicePlansController(IServicePlanService service, QrCodeService qrCodeService)
    {
        _service = service;
        _qrCodeService = qrCodeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var plan = await _service.GetByIdAsync(id);

        return plan == null
            ? NotFound()
            : Ok(plan);
    }

    [HttpGet("{id:guid}/qr")]
    public async Task<IActionResult> GetQrCode(Guid id)
    {
        var plan = await _service.GetByIdAsync(id);
        if (plan == null) return NotFound();

        // Giả lập thông tin thanh toán Momo/VNPay
        var paymentText = $"MOMO|0987654321|{plan.Prices.FirstOrDefault()?.MonthlyPrice ?? 0}|Thanh toan goi {plan.Name}";
        
        var qrBase64 = _qrCodeService.GenerateQrCodeBase64(paymentText);
        
        // Trả về HTML Image tag hoặc JSON chứa Base64 (tùy frontend xử lý, ở đây trả về JSON để frontend hiển thị dạng src="data:image/png;base64,...")
        return Ok(new { 
            qrImage = $"data:image/png;base64,{qrBase64}",
            planName = plan.Name,
            price = plan.Prices.FirstOrDefault()?.MonthlyPrice ?? 0
        });
    }
}
