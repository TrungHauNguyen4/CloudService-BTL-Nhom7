using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Application.Interfaces;
using CloudService.Domain.Entities;
using CloudService.Domain.Interfaces;

namespace CloudService.Application.Services;

public class ServicePlanService : IServicePlanService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    // Dependency Injection
    public ServicePlanService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ServicePlanDto>> GetAllAsync()
    {
        // Gọi tầng Domain để lấy Entity
        var plans = await _unitOfWork.ServicePlans.GetAllWithDetailsAsync();
        
        var customerServices = await _unitOfWork.CustomerServices.GetAllAsync();
        
        // Chuyển Entity -> DTO trước khi trả về
        var dtos = _mapper.Map<IEnumerable<ServicePlanDto>>(plans).ToList();
        
        foreach (var dto in dtos)
        {
            dto.RegistrationCount = customerServices.Count(s => s.PlanId == dto.Id);
        }
        
        return dtos;
    }

    public async Task<ServicePlanDto?> GetByIdAsync(Guid id)
    {
        var plan = await _unitOfWork.ServicePlans.GetByIdWithDetailsAsync(id);
        return plan == null ? null : _mapper.Map<ServicePlanDto>(plan);
    }

    public async Task<ServicePlanDto> CreateAsync(CreateServicePlanDto createDto)
    {
        // Chuyển DTO -> Entity
        var planEntity = _mapper.Map<ServicePlan>(createDto);
        
        // Xử lý Business Logic: Tự động sinh Slug từ Name (Ví dụ "VPS Pro" -> "vps-pro")
        planEntity.Slug = createDto.Name.ToLower().Replace(" ", "-");
        
        planEntity.Prices.Add(new CloudService.Domain.Entities.PlanPrice
        {
            BillingCycle = CloudService.Domain.Enums.BillingCycle.Monthly,
            Price = createDto.MonthlyPrice,
            OriginalPrice = createDto.MonthlyPrice
        });

        // Gọi Unit of Work để lưu vào DB
        await _unitOfWork.ServicePlans.AddAsync(planEntity);
        await _unitOfWork.SaveChangesAsync(); // Dòng này sẽ commit transaction

        // Trả về dữ liệu vừa lưu
        return _mapper.Map<ServicePlanDto>(planEntity);
    }
    public async Task<ServicePlanDto?> UpdateAsync(
        Guid id,
        CreateServicePlanDto updateDto)
    {
        var plan = await _unitOfWork.ServicePlans.GetByIdWithDetailsAsync(id);

        if (plan == null)
        {
            return null;
        }

        plan.Name = updateDto.Name;
        plan.CategoryId = updateDto.CategoryId;
        plan.Specs = updateDto.Specs;
        plan.IsActive = updateDto.IsActive;

        var monthlyPrice = plan.Prices.FirstOrDefault(p => p.BillingCycle == CloudService.Domain.Enums.BillingCycle.Monthly);
        
        if (monthlyPrice != null)
        {
            monthlyPrice.Price = updateDto.MonthlyPrice;
            monthlyPrice.OriginalPrice = updateDto.MonthlyPrice;
        }
        else
        {
            var newPrice = new CloudService.Domain.Entities.PlanPrice
            {
                PlanId = plan.Id,
                BillingCycle = CloudService.Domain.Enums.BillingCycle.Monthly,
                Price = updateDto.MonthlyPrice,
                OriginalPrice = updateDto.MonthlyPrice
            };
            
            // Explicitly set the ID to empty to force EF Core to treat it as a new entity (Added)
            newPrice.Id = Guid.Empty; 

            plan.Prices.Add(newPrice);
        }

        // Cập nhật lại Slug khi đổi tên
        plan.Slug = updateDto.Name
            .Trim()
            .ToLower()
            .Replace(" ", "-");

        plan.UpdatedAt = DateTime.UtcNow;

        // _unitOfWork.ServicePlans.Update(plan); //(TRACKING)

        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<ServicePlanDto>(plan);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var plan = await _unitOfWork.ServicePlans.GetByIdAsync(id);

        if (plan == null)
        {
            return false;
        }

        _unitOfWork.ServicePlans.Delete(plan);

        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}
