using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;

using CloudService.Application.Interfaces;

namespace CloudService.Application.Services;

public class AffiliateService : IAffiliateService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AffiliateService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<bool> SubmitApplicationAsync(CreateAffiliateDto dto)
    {
        if (dto.AppUserId.HasValue)
        {
            var existingApplications = (await _unitOfWork.AffiliateApplications.GetAllAsync())
                                        .Where(x => x.AppUserId == dto.AppUserId.Value)
                                        .ToList();
            if (existingApplications.Any())
            {
                var existing = existingApplications.First();
                if (existing.Status == OrderStatus.Rejected)
                {
                    existing.FullName = dto.FullName;
                    existing.Email = dto.Email;
                    existing.Phone = dto.Phone;
                    existing.Website = dto.Website;
                    existing.Status = OrderStatus.New;
                    existing.UpdatedAt = DateTime.UtcNow;
                    _unitOfWork.AffiliateApplications.Update(existing);
                    await _unitOfWork.SaveChangesAsync();
                    return true;
                }
                else
                {
                    return false; // Already pending or completed
                }
            }
        }

        var application = _mapper.Map<AffiliateApplication>(dto);
        application.Status = OrderStatus.New; // Mặc định là đơn mới
        
        await _unitOfWork.AffiliateApplications.AddAsync(application);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}
