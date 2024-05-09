using AutoMapper;
using BIsleriumCW.Data;
using BIsleriumCW.Interfaces;
using BIsleriumCW.Models;
using Microsoft.AspNetCore.Identity;

namespace BIsleriumCW.Services
{
    public class RepositoryManager : IRepositoryManager
    {
        private BisleriumDbContext _dbContext;

        private IUserAuthenticationRepository _userAuthenticationRepository;
        private UserManager<ApplicationUser> _userManager;
        private RoleManager<IdentityRole> _roleManager;
        private IMapper _mapper;
        private IConfiguration _configuration;
        private IHttpContextAccessor _httpContextAccessor;

        public RepositoryManager(BisleriumDbContext bisleriumDbContext, UserManager<ApplicationUser> userManager, IMapper mapper, IConfiguration configuration, RoleManager<IdentityRole> roleManager, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = bisleriumDbContext;
            _userManager = userManager;
            _mapper = mapper;
            _configuration = configuration;
            _roleManager = roleManager;
            _httpContextAccessor = httpContextAccessor;
        }
        public IUserAuthenticationRepository UserAuthentication
        {
            get
            {
                if (_userAuthenticationRepository is null)
                    _userAuthenticationRepository = new UserAuthenticationRepository(_userManager, _mapper, _configuration, _roleManager, _httpContextAccessor);
                return _userAuthenticationRepository;
            }
        }
        public Task SaveAsync() => _dbContext.SaveChangesAsync();
    }
}