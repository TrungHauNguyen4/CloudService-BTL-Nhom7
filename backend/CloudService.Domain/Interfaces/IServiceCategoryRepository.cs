//dùng để tìm danh mục theo URL
using CloudService.Domain.Entities;

namespace CloudService.Domain.Interfaces;

public interface IServiceCategoryRepository : IGenericRepository<ServiceCategory>
{
    Task<ServiceCategory?> GetBySlugAsync(string slug);
    Task<IEnumerable<ServiceCategory>> GetActiveCategoriesAsync();//lấy danh mục đang được bật
    Task<IEnumerable<ServiceCategory>> GetAllWithPromotionsAsync();
}
