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
            .Sum(o => o.FinalPrice);

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
                g => g.Sum(o => o.FinalPrice));

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

    public async Task<IEnumerable<ServiceChartDto>> GetServicesChartAsync()
    {
        var services = await _unitOfWork.CustomerServices.GetAllAsync();
        var plans = await _unitOfWork.ServicePlans.GetAllAsync();
        var categories = await _unitOfWork.ServiceCategories.GetAllAsync();
        
        var grouped = services
            .GroupBy(s => 
            {
                var plan = plans.FirstOrDefault(p => p.Id == s.PlanId);
                var category = plan != null ? categories.FirstOrDefault(c => c.Id == plan.CategoryId) : null;
                return category?.Name ?? "Khác";
            })
            .Select(g => new ServiceChartDto
            {
                Name = g.Key,
                Value = g.Count()
            })
            .ToList();

        // Nếu không có dữ liệu thực, trả về dữ liệu mẫu để biểu đồ vẫn hiển thị (Mock fallback)
        if (!grouped.Any())
        {
            return new List<ServiceChartDto>
            {
                new ServiceChartDto { Name = "Gói Cơ Bản", Value = 400 },
                new ServiceChartDto { Name = "Gói Pro", Value = 300 },
                new ServiceChartDto { Name = "Gói Doanh Nghiệp", Value = 300 }
            };
        }

        return grouped;
    }
}