// 1 Entity ServicePlan với 100 trường, bạn muốn copy dữ liệu sang ServicePlanDto cũng có 100 trường. Thay vì gán tay từng dòng dto.Name = entity.Name, file Profile này sẽ cấu hình để chúng tự động sao chép (map) cho nhau.
using AutoMapper;//Sử dụng thư viện AutoMapper
using CloudService.Application.DTOs;
using CloudService.Domain.Entities;

namespace CloudService.Application.Mappings;

public class ServicePlanProfile : Profile
{
    public ServicePlanProfile()
    {
        // Entity -> DTO (Đọc dữ liệu)
        CreateMap<ServicePlan, ServicePlanDto>();
        
        // DTO -> Entity (Ghi dữ liệu)
        CreateMap<CreateServicePlanDto, ServicePlan>()
            .ForMember(dest => dest.Slug, opt => opt.Ignore()); // Slug được xử lý thủ công trong Service, không map tự động
    }
}
