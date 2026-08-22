using CloudService.Domain.Entities;
namespace CloudService.Domain.Interfaces;

public interface IPromotionRepository : IGenericRepository<Promotion>
{
    Task<Promotion?> GetByCodeAsync(string code);
}
