//Cấu hình AutoMapper. Đặc biệt ở đây tôi cấu hình bỏ qua trường Status (opt.Ignore()) khi nhận dữ liệu từ Client. Việc này để chống hack (ngăn việc khách hàng cố tình gửi Status = Completed từ API).
using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Domain.Entities;

namespace CloudService.Application.Mappings;

public class OrderProfile : Profile
{
    public OrderProfile()
    {
        CreateMap<OrderRequest, OrderDto>();
        
        // Bỏ qua trường Status khi map từ Client lên vì Status do backend tự set
        CreateMap<CreateOrderDto, OrderRequest>()
            .ForMember(dest => dest.Status, opt => opt.Ignore());
    }
}
