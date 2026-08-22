using CloudService.Application.DTOs;

namespace CloudService.Application.Interfaces;

public interface ICustomerAffiliateService
{
    Task<CustomerAffiliateStatsDto> GetAffiliateStatsAsync(Guid userId);
}
