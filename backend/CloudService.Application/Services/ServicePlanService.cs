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
        var plans = await _unitOfWork.ServicePlans.GetAllAsync();
        
        // Chuyển Entity -> DTO trước khi trả về
        return _mapper.Map<IEnumerable<ServicePlanDto>>(plans);
    }

    public async Task<ServicePlanDto?> GetByIdAsync(Guid id)
    {
        var plan = await _unitOfWork.ServicePlans.GetByIdAsync(id);
        return plan == null ? null : _mapper.Map<ServicePlanDto>(plan);
    }

    public async Task<ServicePlanDto> CreateAsync(CreateServicePlanDto createDto)
    {
        // Chuyển DTO -> Entity
        var planEntity = _mapper.Map<ServicePlan>(createDto);
        
        // Xử lý Business Logic: Tự động sinh Slug từ Name (Ví dụ "VPS Pro" -> "vps-pro")
        planEntity.Slug = createDto.Name.ToLower().Replace(" ", "-");
        
        // Gọi Unit of Work để lưu vào DB
        await _unitOfWork.ServicePlans.AddAsync(planEntity);
        await _unitOfWork.SaveChangesAsync(); // Dòng này sẽ commit transaction

        // Trả về dữ liệu vừa lưu
        return _mapper.Map<ServicePlanDto>(planEntity);
    }
}
