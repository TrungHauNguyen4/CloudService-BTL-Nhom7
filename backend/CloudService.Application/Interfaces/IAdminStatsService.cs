namespace CloudService.Application.Interfaces;

public interface IAdminStatsService
{
    Task<AdminStatsSummaryDto> GetSummaryAsync();
    Task<IEnumerable<RevenueChartDto>> GetRevenueChartAsync();
    Task<IEnumerable<ServiceChartDto>> GetServicesChartAsync();
}

public class AdminStatsSummaryDto
{
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public int NewCustomers { get; set; }
}

public class RevenueChartDto
{
    public string Month { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
}

public class ServiceChartDto
{
    public string Name { get; set; } = string.Empty;
    public int Value { get; set; }
}