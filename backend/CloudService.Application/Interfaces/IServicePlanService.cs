using CloudService.Application.DTOs;

namespace CloudService.Application.Interfaces;

public interface IServicePlanService
{
    Task<IEnumerable<ServicePlanDto>> GetAllAsync();

    Task<ServicePlanDto?> GetByIdAsync(Guid id);

    Task<ServicePlanDto> CreateAsync(
        CreateServicePlanDto createDto);

    Task<ServicePlanDto?> UpdateAsync(
        Guid id,
        CreateServicePlanDto updateDto);

    Task<bool> DeleteAsync(Guid id);
}