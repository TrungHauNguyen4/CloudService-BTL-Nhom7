using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Public;

[ApiController]
[Route("api/affiliate-applications")]
public class AffiliateController : ControllerBase
{
    private readonly IAffiliateService _service;

    public AffiliateController(IAffiliateService service)
        => _service = service;

    [HttpPost]
    public async Task<IActionResult> Submit(
        [FromBody] CreateAffiliateDto dto)
    {
        var result = await _service.SubmitApplicationAsync(dto);

        return result
            ? Ok(new { message = "Đăng ký đối tác thành công!" })
            : BadRequest();
    }
}