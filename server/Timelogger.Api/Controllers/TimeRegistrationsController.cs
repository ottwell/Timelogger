using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Timelogger.Entities;

namespace Timelogger.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimeRegistrationsController : BaseODataController
    {
        public TimeRegistrationsController(ApiContext context) : base(context) { }

        [HttpGet]
        [ODataRoute("TimeRegistrations")]
        [EnableQuery]
        public async Task<ActionResult<IQueryable<TimeRegistration>>> Get()
        {
            await Context.TimeRegistrations.LoadAsync();
            return Ok(Context.TimeRegistrations);
        }

        [HttpPost]
        [ODataRoute("TimeRegistrations")]
        public async Task<IActionResult> CreateTimeRegistration([FromBody] TimeRegistration timeRegistration)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            Context.TimeRegistrations.Add(timeRegistration);
            await Context.SaveChangesAsync();
            return Created(timeRegistration);
        }
    }
}
