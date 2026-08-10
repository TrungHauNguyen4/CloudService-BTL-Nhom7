//Kho chứa chung
namespace CloudService.Domain.Interfaces;

// T generic đại diện cho bất kỳ Entity nào
public interface IGenericRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
}
