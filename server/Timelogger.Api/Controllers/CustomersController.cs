using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Timelogger.DataAccess;
using Timelogger.Entities;

namespace Timelogger.Api.Controllers
{
    
    public class CustomersController : BaseODataController
    {
        public CustomersController(IRepository repo) : base(repo) { }


        [HttpGet]
        [ODataRoute("Customers")]
        [EnableQuery]
        public async Task<ActionResult<IQueryable<Customer>>> GetAll()
        {
            var customers = await Repo.GetAll<Customer>();
            return Ok(customers);
        }
    }
}
