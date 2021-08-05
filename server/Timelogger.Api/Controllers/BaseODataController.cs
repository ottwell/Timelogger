using Microsoft.AspNet.OData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Timelogger.Api.Controllers
{
    public abstract class BaseODataController : ODataController
    {
        public ApiContext Context;

        public BaseODataController(ApiContext context)
        {
            Context = context;
        }



    }
}
