/*Đây là nơi chứa Business Logic (Nghiệp vụ cốt lõi). Hãy mở file ServicePlanService.cs ra xem, bạn sẽ thấy luồng xử lý rất rõ ràng:

Nhận DTO từ API.
Dùng AutoMapper biến DTO thành Entity ServicePlan.
Xử lý logic: planEntity.Slug = createDto.Name.ToLower().Replace(" ", "-"); (Tự động sinh URL thân thiện).
Gọi _unitOfWork.ServicePlans.AddAsync() để thêm vào kho lưu trữ (nhưng chưa lưu thật).
Gọi _unitOfWork.SaveChangesAsync() để commit thực sự xuống Database.
Map ngược lại thành DTO rồi trả về cho API.*/

using CloudService.Application.DTOs;

namespace CloudService.Application.Interfaces;

public interface IServicePlanService
{
    Task<IEnumerable<ServicePlanDto>> GetAllAsync();
    Task<ServicePlanDto?> GetByIdAsync(Guid id);
    Task<ServicePlanDto> CreateAsync(CreateServicePlanDto createDto);
}
