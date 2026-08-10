using CloudService.Domain.Entities;

namespace CloudService.Domain.Interfaces;

public interface IServicePlanRepository : IGenericRepository<ServicePlan>
{
    Task<ServicePlan?> GetBySlugAsync(string slug);
    Task<IEnumerable<ServicePlan>> GetActivePlansByCategoryAsync(Guid categoryId);
}
