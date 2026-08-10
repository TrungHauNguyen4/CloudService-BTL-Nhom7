using CloudService.Application.DTOs;

namespace CloudService.Application.Interfaces;

public interface IAffiliateService
{
    Task<bool> SubmitApplicationAsync(CreateAffiliateDto dto);
}
