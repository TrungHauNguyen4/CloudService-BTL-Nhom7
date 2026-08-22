using CloudService.Domain.Entities;

namespace CloudService.Domain.Interfaces;

public interface IAppUserRepository : IGenericRepository<AppUser>
{
    Task<AppUser?> GetByEmailAsync(string email);
}