using CloudService.Application.Interfaces;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services;

public class AdminStatsService : IAdminStatsService
{
    private readonly IUnitOfWork _unitOfWork;

    public AdminStatsService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<AdminStatsSummaryDto> GetSummaryAsync()
    {
        var orders = await _unitOfWork
            .OrderRequests
            .GetAllWithPlanPricesAsync();

        var users = await _unitOfWork
            .AppUsers
            .GetAllAsync();

        var totalOrders = orders.Count();

        var totalRevenue = orders
            .Where(o => o.Status == OrderStatus.Completed)
            .Sum(o =>
            {
                var price = o.Plan.Prices
                    .FirstOrDefault(p => p.BillingCycle == o.BillingCycle);

                return price?.Price ?? 0;
            });

        // Khách hàng mới = AppUser được tạo trong tháng hiện tại
        var currentMonth = new DateTime(
            DateTime.UtcNow.Year,
            DateTime.UtcNow.Month,
            1);

        var newCustomers = users.Count(u =>
            u.CreatedAt >= currentMonth);

        return new AdminStatsSummaryDto
        {
            TotalOrders = totalOrders,
            TotalRevenue = totalRevenue,
            NewCustomers = newCustomers
        };
    }

    public async Task<IEnumerable<RevenueChartDto>> GetRevenueChartAsync()
    {
        var orders = await _unitOfWork
            .OrderRequests
            .GetAllWithPlanPricesAsync();

        var currentMonth = new DateTime(
            DateTime.UtcNow.Year,
            DateTime.UtcNow.Month,
            1);

        var startDate = currentMonth.AddMonths(-6);

        var completedOrders = orders
            .Where(o =>
                o.Status == OrderStatus.Completed &&
                o.CreatedAt >= startDate)
            .ToList();

        var revenueByMonth = completedOrders
            .GroupBy(o => new
            {
                o.CreatedAt.Year,
                o.CreatedAt.Month
            })
            .ToDictionary(
                g => new DateTime(
                    g.Key.Year,
                    g.Key.Month,
                    1),
                g => g.Sum(o =>
                {
                    var price = o.Plan.Prices
                        .FirstOrDefault(
                            p => p.BillingCycle == o.BillingCycle);

                    return price?.Price ?? 0;
                }));

        var result = new List<RevenueChartDto>();

        for (int i = 0; i < 7; i++)
        {
            var month = startDate.AddMonths(i);

            result.Add(new RevenueChartDto
            {
                Month = $"{month.Year}-{month.Month:D2}",
                Revenue = revenueByMonth.TryGetValue(
                    month,
                    out var revenue)
                    ? revenue
                    : 0
            });
        }

        return result;
    }
}