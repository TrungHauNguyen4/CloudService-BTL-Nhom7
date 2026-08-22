using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services;

public class CustomerAffiliateService : ICustomerAffiliateService
{
    private readonly IUnitOfWork _unitOfWork;

    public CustomerAffiliateService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CustomerAffiliateStatsDto> GetAffiliateStatsAsync(Guid userId)
    {
        var applications = await _unitOfWork.AffiliateApplications.GetAllAsync();
        var application = applications.FirstOrDefault(x => x.AppUserId == userId);

        var dto = new CustomerAffiliateStatsDto();

        if (application == null)
        {
            dto.IsAffiliate = false;
            return dto;
        }

        dto.IsAffiliate = application.Status == OrderStatus.Completed || application.Status == OrderStatus.Processing || application.Status == OrderStatus.New || application.Status == OrderStatus.Rejected;
        dto.AffiliateStatus = application.Status;
        dto.AffiliateLink = $"http://localhost:3000/?ref={userId}";

        // Auto-generate code if they were approved previously but missing a code
        if (application.Status == OrderStatus.Completed && string.IsNullOrEmpty(application.AffiliateCode))
        {
            var random = new Random();
            application.AffiliateCode = $"CLOUD-{random.Next(10000, 99999)}";
            _unitOfWork.AffiliateApplications.Update(application);
            await _unitOfWork.SaveChangesAsync();
        }

        dto.AffiliateCode = application.AffiliateCode ?? "";

        // Fetch settings
        var settings = await _unitOfWork.SystemSettings.GetAllAsync();
        dto.CommissionRate = settings.FirstOrDefault(s => s.Key == "AffiliateCommissionRate")?.Value ?? "10";
        dto.DiscountRate = settings.FirstOrDefault(s => s.Key == "AffiliateDiscountRate")?.Value ?? "10";

        if (application.Status == OrderStatus.Completed || application.Status == OrderStatus.Rejected)
        {
            var allOrders = await _unitOfWork.OrderRequests.GetAllAsync();
            var referredOrders = allOrders
                .Where(o => (o.AffiliateId == userId || (o.AppliedAffiliateCode != null && o.AppliedAffiliateCode == application.AffiliateCode)) && o.Status == OrderStatus.Completed)
                .ToList();

            dto.TotalOrders = referredOrders.Count;
            
            decimal totalCommission = 0;
            if (decimal.TryParse(dto.CommissionRate, out var commRate))
            {
                foreach(var order in referredOrders)
                {
                    totalCommission += order.FinalPrice > 0 ? order.FinalPrice * (commRate / 100) : 0;
                }
            }
            
            dto.TotalCommission = totalCommission;
        }

        return dto;
    }
}
