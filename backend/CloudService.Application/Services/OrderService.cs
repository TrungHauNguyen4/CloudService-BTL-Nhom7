//Business logic thực sự. Ví dụ khi tạo đơn hàng mới, code sẽ tự động gán order.Status = OrderStatus.New trước khi lưu vào cơ sở dữ liệu.
using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Enums;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services;

public class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public OrderService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<OrderDto> CreateOrderAsync(CreateOrderDto dto)
    {
        var order = _mapper.Map<OrderRequest>(dto);
        
        // Cập nhật thông tin khách hàng từ DB nếu có CustomerId
        if (dto.CustomerId.HasValue)
        {
            var user = await _unitOfWork.AppUsers.GetByIdAsync(dto.CustomerId.Value);
            if (user != null)
            {
                order.CustomerName = string.IsNullOrWhiteSpace(user.FullName) ? user.Username : user.FullName;
                order.Email = user.Email;
            }
        }
        
        var basePrice = 150000m;
        // Fetch actual plan price if PlanId is provided
        if (dto.PlanId.HasValue)
        {
            var plan = await _unitOfWork.ServicePlans.GetByIdWithDetailsAsync(dto.PlanId.Value);
            
            if (plan != null && !plan.IsActive)
            {
                throw new Exception("Gói dịch vụ đã ngừng hoạt động và không thể đặt hàng.");
            }
            
            if (plan != null && plan.Prices != null && plan.Prices.Any())
            {
                var monthlyPriceObj = plan.Prices.FirstOrDefault(p => p.BillingCycle == BillingCycle.Monthly);
                if (monthlyPriceObj != null)
                {
                    basePrice = monthlyPriceObj.Price;
                }
                else
                {
                    basePrice = plan.Prices.First().Price;
                }
            }
        }
        
        if (dto.BillingCycle == BillingCycle.Yearly)
        {
            var settings = await _unitOfWork.SystemSettings.GetAllAsync();
            var yearlyDiscountStr = settings.FirstOrDefault(s => s.Key == "YearlyDiscountRate")?.Value ?? "16";
            if (!decimal.TryParse(yearlyDiscountStr, out var yearlyDiscount)) yearlyDiscount = 16m;
            basePrice = (basePrice * 12) * (1m - yearlyDiscount / 100m);
        }
        
        order.FinalPrice = basePrice;
        
        // Process DiscountCode
        if (!string.IsNullOrWhiteSpace(dto.DiscountCode))
        {
            // Check Promotion
            var promotions = await _unitOfWork.Promotions.GetAllAsync();
            var promo = promotions.FirstOrDefault(p => p.Code == dto.DiscountCode && p.IsActive && p.ExpiryDate >= DateTime.UtcNow);
            
            if (promo != null)
            {
                order.AppliedPromoCode = promo.Code;
                order.DiscountAmount = basePrice * (promo.DiscountPercentage / 100);
                order.FinalPrice = basePrice - order.DiscountAmount;
            }
            else
            {
                // Check Affiliate Code
                var affiliates = await _unitOfWork.AffiliateApplications.GetAllAsync();
                var affiliate = affiliates.FirstOrDefault(a => a.AffiliateCode == dto.DiscountCode && a.Status == OrderStatus.Completed);
                
                if (affiliate != null)
                {
                    var settings = await _unitOfWork.SystemSettings.GetAllAsync();
                    var setting = settings.FirstOrDefault(s => s.Key == "AffiliateDiscountRate");
                    var discountStr = setting?.Value ?? "10";
                    if (!decimal.TryParse(discountStr, out var discountPercentage)) discountPercentage = 10;

                    order.AppliedAffiliateCode = affiliate.AffiliateCode;
                    order.AffiliateId = affiliate.Id;
                    order.DiscountAmount = basePrice * (discountPercentage / 100);
                    order.FinalPrice = basePrice - order.DiscountAmount;
                }
            }
        }
        
        // Tự động cấp phát nếu là khách hàng đã đăng nhập (có CustomerId)
        if (dto.CustomerId.HasValue && dto.PlanId.HasValue)
        {
            order.Status = OrderStatus.Completed;
            
            // 1. Khởi tạo Máy chủ ảo (CustomerService)
            var customerService = new CustomerService
            {
                Id = Guid.NewGuid(),
                CustomerId = dto.CustomerId.Value,
                PlanId = dto.PlanId.Value,
                Name = dto.ServiceName,
                IpAddress = $"103.19.{Random.Shared.Next(1, 255)}.{Random.Shared.Next(1, 255)}",
                Os = "Ubuntu 24.04 LTS",
                Status = CustomerServiceStatus.Running,
                CpuUsage = Random.Shared.Next(1, 15),
                RamUsage = Random.Shared.Next(10, 45),
                ExpiresAt = dto.BillingCycle == BillingCycle.Monthly ? DateTime.UtcNow.AddMonths(1) : DateTime.UtcNow.AddYears(1)
            };
            await _unitOfWork.CustomerServices.AddAsync(customerService);

            // 2. Tạo Hóa đơn (Invoice)
            var amount = order.FinalPrice;

            var invoice = new Invoice
            {
                InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{Random.Shared.Next(1000, 9999)}",
                CustomerId = dto.CustomerId.Value,
                Amount = amount,
                Status = InvoiceStatus.Paid,
                IssueDate = DateTime.UtcNow,
                DueDate = DateTime.UtcNow.AddDays(7),
                PaidDate = DateTime.UtcNow,
                ServiceId = customerService.Id
            };
            await _unitOfWork.Invoices.AddAsync(invoice);
        }
        else
        {
            // Đơn hàng vãng lai (Liên hệ), đưa vào chờ duyệt
            order.Status = OrderStatus.New;
        }
        
        await _unitOfWork.OrderRequests.AddAsync(order);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<OrderDto>(order);
    }

    public async Task<IEnumerable<OrderDto>> GetPendingOrdersAsync()
    {
        var orders = await _unitOfWork.OrderRequests.GetPendingOrdersAsync();
        return _mapper.Map<IEnumerable<OrderDto>>(orders);
    }

    public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync(
        OrderStatus? status)
    {
        var orders = await _unitOfWork
            .OrderRequests
            .GetAllByStatusAsync(status);

        return _mapper.Map<IEnumerable<OrderDto>>(orders);
    }

    public async Task<bool> UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus)
    {
        var order = await _unitOfWork.OrderRequests.GetByIdAsync(orderId);
        if (order == null) return false;

        order.Status = newStatus;
        
        // TODO: (Mở rộng) Ở đây có thể thêm logic ghi Log vào bảng AuditLog
        
        _unitOfWork.OrderRequests.Update(order);
        await _unitOfWork.SaveChangesAsync();
        
        return true;
    }
}
