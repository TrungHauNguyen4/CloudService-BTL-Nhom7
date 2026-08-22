using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services;

public class AffiliateApplicationService
    : IAffiliateApplicationService
{
    private readonly IUnitOfWork _unitOfWork;

    public AffiliateApplicationService(
        IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<AffiliateApplication>> GetPendingAsync()
    {
        return await _unitOfWork
            .AffiliateApplications
            .GetPendingAsync();
    }

    public async Task<IEnumerable<AffiliateApplication>> GetAllAsync()
    {
        return await _unitOfWork
            .AffiliateApplications
            .GetAllAsync();
    }

    public async Task<AffiliateApplication?> UpdateStatusAsync(
        Guid id,
        OrderStatus status)
    {
        var affiliate = await _unitOfWork
            .AffiliateApplications
            .GetByIdAsync(id);

        if (affiliate == null)
        {
            return null;
        }

        if (status == OrderStatus.Completed && string.IsNullOrEmpty(affiliate.AffiliateCode))
        {
            var random = new Random();
            affiliate.AffiliateCode = $"CLOUD-{random.Next(10000, 99999)}";
            // Check uniqueness in real world, simple generation for now
        }

        affiliate.Status = status;
        affiliate.UpdatedAt = DateTime.UtcNow;

        _unitOfWork.AffiliateApplications.Update(affiliate);

        await _unitOfWork.SaveChangesAsync();

        return affiliate;
    }
}