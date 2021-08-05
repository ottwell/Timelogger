using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Timelogger.Entities;

namespace Timelogger.Api.Controllers
{
    
    public class CustomersController : BaseODataController
    {
        public CustomersController(ApiContext context) : base(context) { }


        [HttpGet]
        [ODataRoute("Customers")]
        [EnableQuery]
        public async Task<ActionResult<IQueryable<Customer>>> Get()
        {
            await Context.Customers.LoadAsync();
            return Ok(Context.Customers);
        }
    }
}
