using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/admin/service-categories")]
[Authorize(Roles = "Admin")]
public class AdminCategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public AdminCategoriesController(
        ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    // GET: /api/admin/service-categories
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _categoryService.GetAllAsync();

        return Ok(categories);
    }

    // POST: /api/admin/service-categories
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateCategoryDto dto)
    {
        var category = await _categoryService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetAll),
            new { id = category.Id },
            category);
    }

    // PUT: /api/admin/service-categories/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] CreateCategoryDto dto)
    {
        var category =
            await _categoryService.UpdateAsync(id, dto);

        if (category == null)
        {
            return NotFound(new
            {
                message = "Không tìm thấy danh mục."
            });
        }

        return Ok(category);
    }

    // DELETE: /api/admin/service-categories/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success =
            await _categoryService.DeleteAsync(id);

        if (!success)
        {
            return NotFound(new
            {
                message = "Không tìm thấy danh mục."
            });
        }

        return NoContent();
    }
}