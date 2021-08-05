using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Timelogger.Entities;

namespace Timelogger.Api.Controllers
{
    public class ProjectsController : BaseODataController
    {
        public ProjectsController(ApiContext context) : base(context) { }


        [HttpGet]
        [ODataRoute("Projects")]
        [EnableQuery]
        public async Task<ActionResult<IQueryable<Project>>> Get()
        {
            await Context.Projects.LoadAsync();
            return Ok(Context.Projects);
        }

        [HttpGet]
        [ODataRoute("Projects({key})")]
        [EnableQuery]
        public async Task<ActionResult> Get([FromODataUri]int key)
        {
            var data = await Context.Projects.FirstOrDefaultAsync(p => p.Id == key);
            return Ok(data);
        }

        [HttpPatch]
        [ODataRoute("Projects({key})")]
        public async Task<IActionResult> UpdateProject([FromODataUri]int key, [FromBody] Delta<Project> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var currentProject = await Context.Projects
                .FirstOrDefaultAsync(p => p.Id == key);

            if (currentProject == null)
            {
                return NotFound();
            }

            patch.Patch(currentProject);
            await Context.SaveChangesAsync();
            return NoContent();
        }
    }
}
