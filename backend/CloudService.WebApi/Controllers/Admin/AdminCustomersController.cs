using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloudService.WebApi.Controllers.Admin;

[ApiController]
[Route("api/admin/customers")]
[Authorize(Roles = "Admin")]
public class AdminCustomersController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public AdminCustomersController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCustomers()
    {
        var users = await _unitOfWork.AppUsers.GetAllAsync();
        
        // Chỉ lấy những người dùng có Role = Customer hoặc không phải Admin (nếu cần lọc)
        // Hiện tại AppUser dùng Role. Nên ta có thể lấy toàn bộ hoặc lọc theo ý muốn
        var customers = users
            //.Where(u => u.Role != UserRole.Admin) // Tùy chọn lọc nếu muốn
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                u.Username,
                u.CreditBalance,
                u.CreatedAt,
                u.Role
            });

        return Ok(customers);
    }

    public class UpdateAccountDto
    {
        public decimal AddCredit { get; set; }
        public UserRole Role { get; set; }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAccount(Guid id, [FromBody] UpdateAccountDto dto)
    {
        var user = await _unitOfWork.AppUsers.GetByIdAsync(id);
        if (user == null) return NotFound(new { message = "Không tìm thấy người dùng" });

        // Update Role
        user.Role = dto.Role;
        
        // Add Credit
        if (dto.AddCredit != 0)
        {
            user.CreditBalance += dto.AddCredit;
        }

        user.UpdatedAt = DateTime.UtcNow;
        
        _unitOfWork.AppUsers.Update(user);
        await _unitOfWork.SaveChangesAsync();

        return Ok(new { message = "Cập nhật thành công", balance = user.CreditBalance, role = user.Role });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAccount(Guid id)
    {
        var user = await _unitOfWork.AppUsers.GetByIdAsync(id);
        if (user == null) return NotFound(new { message = "Không tìm thấy người dùng" });

        // Note: Xóa hẳn (Hard delete). Nếu vướng khóa ngoại, EF Core sẽ throw exception.
        try
        {
            _unitOfWork.AppUsers.Delete(user);
            await _unitOfWork.SaveChangesAsync();
            return Ok(new { message = "Xóa tài khoản thành công" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Không thể xóa người dùng này vì đang có dịch vụ hoặc đơn hàng liên quan.", details = ex.Message });
        }
    }
}
