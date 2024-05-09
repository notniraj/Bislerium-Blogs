using AutoMapper;
using BIsleriumCW.Dtos;
using BIsleriumCW.Models;

namespace BIsleriumCW.Mappings
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile() 
        {
            CreateMap<UserRegistrationDto, ApplicationUser>();
        }
    }
}
