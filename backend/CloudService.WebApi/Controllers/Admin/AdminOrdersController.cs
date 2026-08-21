using CloudService.Application.Interfaces;
using CloudService.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/admin/orders")]
[Authorize(Roles = "Admin,Editor")]
public class AdminOrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public AdminOrdersController(
        IOrderService orderService)
        => _orderService = orderService;

    // GET: /api/admin/orders
    // GET: /api/admin/orders?status=1
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] OrderStatus? status)
    {
        var orders = await _orderService.GetAllOrdersAsync(status);

        return Ok(orders);
    }

    // GET: /api/admin/orders/pending
    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
        => Ok(await _orderService.GetPendingOrdersAsync());

    // PUT: /api/admin/orders/{id}/status
    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        [FromBody] OrderStatus newStatus)
    {
        var success =
            await _orderService.UpdateOrderStatusAsync(
                id,
                newStatus);

        return success
            ? Ok(new { message = "Cập nhật thành công." })
            : NotFound();
    }
}