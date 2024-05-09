using AutoMapper;
using BIsleriumCW.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BIsleriumCW.Controllers
{
    public class BaseApiController : ControllerBase
    {
        protected readonly IRepositoryManager _repository;
        protected readonly IMapper _mapper;

        public BaseApiController(IRepositoryManager repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
    }
}
