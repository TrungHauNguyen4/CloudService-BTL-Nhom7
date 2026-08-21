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
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] CreateServicePlanDto dto)
    {
        var plan = await _planService.UpdateAsync(id, dto);

        if (plan == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy gói dịch vụ."
            });
        }

        return Ok(plan);
    }
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _planService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Không tìm thấy gói dịch vụ."
            });
        }

        return NoContent();
    }
}