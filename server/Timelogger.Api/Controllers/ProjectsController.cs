using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Timelogger.DataAccess;
using Timelogger.Entities;

namespace Timelogger.Api.Controllers
{
    public class ProjectsController : BaseODataController
    {
        public ProjectsController(IRepository repo) : base(repo) { }


        [HttpGet]
        [ODataRoute("Projects")]
        [EnableQuery]
        public async Task<ActionResult<IQueryable<Project>>> Get()
        {
            var projects = await Repo.GetAll<Project>();
            return Ok(projects);
        }

        [HttpGet]
        [ODataRoute("Projects({key})")]
        [EnableQuery]
        public async Task<ActionResult<Project>> GetById([FromODataUri]int key)
        {

            var project = await Repo.GetById<Project>(key);
            if (project == null)
            {
                return NotFound();
            }
            return Ok(project);
        }

    }
}
