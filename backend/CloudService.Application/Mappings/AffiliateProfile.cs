using AutoMapper;
using CloudService.Application.DTOs;
using CloudService.Domain.Entities;

namespace CloudService.Application.Mapping;

public class AffiliateProfile : Profile
{
    public AffiliateProfile()
    {
        CreateMap<CreateAffiliateDto, AffiliateApplication>();
    }
}