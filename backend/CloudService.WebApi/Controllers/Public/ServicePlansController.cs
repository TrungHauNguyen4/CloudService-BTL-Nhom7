using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Public;

[ApiController]
[Route("api/service-plans")]
public class ServicePlansController : ControllerBase
{
    private readonly IServicePlanService _service;

    public ServicePlansController(IServicePlanService service)
        => _service = service;

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
}