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
using Timelogger.Enums;

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
            var project = await Context.Projects.FirstOrDefaultAsync(p => p.Id == timeRegistration.ProjectId);
            if (project.Status == Enum.GetName(typeof(ProjectStatus), ProjectStatus.Completed))
            {
                ModelState.AddModelError("ProjectClosed", "this project is completed and therefore cannot recieve new time registrations");
                return BadRequest(ModelState);
            }
            Context.TimeRegistrations.Add(timeRegistration);
            await Context.SaveChangesAsync();
            return Created(timeRegistration);
        }

        [HttpPatch]
        [ODataRoute("TimeRegistrations({key})")]
        public async Task<IActionResult> UpdateTimeRegistration([FromODataUri] int key, [FromBody] Delta<TimeRegistration> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentTimeRegistration = await Context.TimeRegistrations
                .FirstOrDefaultAsync(t => t.Id == key);

            if (currentTimeRegistration == null)
            {
                return NotFound();
            }

            patch.Patch(currentTimeRegistration);
            await Context.SaveChangesAsync();
            return NoContent();
        }
    }
}
