using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/admin/promotions")]
[Authorize(Roles = "Admin")]
public class AdminPromotionsController : ControllerBase
{
    private readonly IPromotionService _promotionService;

    public AdminPromotionsController(IPromotionService promotionService)
    {
        _promotionService = promotionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var promos = await _promotionService.GetAllAsync();
        return Ok(promos);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var promo = await _promotionService.GetByIdAsync(id);
        if (promo == null) return NotFound();
        return Ok(promo);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePromotionDto dto)
    {
        var existing = await _promotionService.GetByCodeAsync(dto.Code);
        if (existing != null) return BadRequest(new { message = "Mã khuyến mãi đã tồn tại" });

        var created = await _promotionService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePromotionDto dto)
    {
        var success = await _promotionService.UpdateAsync(id, dto);
        if (!success) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _promotionService.DeleteAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}
