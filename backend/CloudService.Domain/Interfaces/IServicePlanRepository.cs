using CloudService.Domain.Entities;

namespace CloudService.Domain.Interfaces;

public interface IServicePlanRepository : IGenericRepository<ServicePlan>
{
    Task<ServicePlan?> GetBySlugAsync(string slug);
    Task<IEnumerable<ServicePlan>> GetActivePlansByCategoryAsync(Guid categoryId);
    Task<ServicePlan?> GetByIdWithDetailsAsync(Guid id);
    Task<IEnumerable<ServicePlan>> GetAllWithDetailsAsync();
    void AddPrice(PlanPrice price);
}
