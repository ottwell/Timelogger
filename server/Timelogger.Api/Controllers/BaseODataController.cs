using Microsoft.AspNet.OData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Timelogger.DataAccess;

namespace Timelogger.Api.Controllers
{
    public abstract class BaseODataController : ODataController
    {
        public IRepository Repo;
        
        public BaseODataController(IRepository repo)
        {
            Repo = repo;
        }



    }
}
