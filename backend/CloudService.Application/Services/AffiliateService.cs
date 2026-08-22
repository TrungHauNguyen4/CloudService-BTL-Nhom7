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
        var application = _mapper.Map<AffiliateApplication>(dto);
        application.Status = OrderStatus.New; // Mặc định là đơn mới
        
        await _unitOfWork.AffiliateApplications.AddAsync(application);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}
