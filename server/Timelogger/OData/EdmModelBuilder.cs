using Microsoft.AspNet.OData.Builder;
using Microsoft.OData.Edm;
using System;
using System.Collections.Generic;
using System.Text;
using Timelogger.Entities;

namespace Timelogger.OData
{
    public static class EdmModelBuilder
    {
        public static IEdmModel GetEntityDataModel()
        {
            var builder = new ODataConventionModelBuilder();
            builder.EntitySet<Customer>("Customers").HasManyBinding(c => c.Projects, "Projects");
            builder.EntitySet<Project>("Projects").HasManyBinding(p => p.TimeRegistrations, "TimeRegistrations");
            builder.EntitySet<TimeRegistration>("TimeRegistrations");
            return builder.GetEdmModel();
        }
    }
}
