using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using Timelogger.DataAccess;
using Timelogger.Entities;
using Timelogger.Enums;

namespace Timelogger.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimeRegistrationsController : BaseODataController
    {
        public TimeRegistrationsController(IRepository repo) : base(repo) { }

        [HttpGet]
        [ODataRoute("TimeRegistrations")]
        [EnableQuery]
        public async Task<ActionResult<IQueryable<TimeRegistration>>> Get()
        {
            var timeRegs = await Repo.GetAll<TimeRegistration>();
            return Ok(timeRegs);
        }

        [HttpPost]
        [ODataRoute("TimeRegistrations")]
        public async Task<IActionResult> CreateTimeRegistration([FromBody] TimeRegistration timeRegistration)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var project = await Repo.GetById<Project>(timeRegistration.ProjectId);
            if (project.Status == Enum.GetName(typeof(ProjectStatus), ProjectStatus.Completed))
            {
                ModelState.AddModelError("ProjectClosed", "this project is completed and therefore cannot recieve new time registrations");
                return BadRequest(ModelState);
            }
            var timeReg = await Repo.Create(timeRegistration);
            return Created(timeReg);
        }

        [HttpPatch]
        [ODataRoute("TimeRegistrations({key})")]
        public async Task<IActionResult> UpdateTimeRegistration([FromODataUri] int key, [FromBody] Delta<TimeRegistration> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentTimeRegistration = await Repo.GetById<TimeRegistration>(key);
            if (currentTimeRegistration == null)
            {
                return NotFound();
            }
            var validationErrors = await Repo.Patch<TimeRegistration>(currentTimeRegistration, patch);
            if (validationErrors.Count() > 0)
            {
                foreach (var error in validationErrors)
                {
                    ModelState.AddModelError(error.MemberNames.First(), error.ErrorMessage);
                    return BadRequest(ModelState);
                }
                
            }
            return NoContent();
        }
    }
}
