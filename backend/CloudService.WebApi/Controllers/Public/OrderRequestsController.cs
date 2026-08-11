using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Public;

[ApiController]
[Route("api/order-requests")]
public class OrderRequestsController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderRequestsController(IOrderService orderService)
        => _orderService = orderService;

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateOrderDto dto)
    {
        var order = await _orderService.CreateOrderAsync(dto);

        return CreatedAtAction(
            nameof(Create),
            new { id = order.Id },
            order);
    }
}