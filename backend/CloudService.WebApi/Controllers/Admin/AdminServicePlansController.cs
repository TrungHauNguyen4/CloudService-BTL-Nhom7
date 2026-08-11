using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/admin/service-plans")]
[Authorize(Roles = "Admin")]
public class AdminServicePlansController : ControllerBase
{
    private readonly IServicePlanService _planService;

    public AdminServicePlansController(
        IServicePlanService planService)
        => _planService = planService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _planService.GetAllAsync());

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateServicePlanDto dto)
    {
        var plan = await _planService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(Create),
            new { id = plan.Id },
            plan);
    }
}