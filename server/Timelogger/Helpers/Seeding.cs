using System;
using System.Collections.Generic;
using Timelogger.Entities;
using Timelogger.Enums;

namespace Timelogger.Helpers
{
    public static class SeedingHelper
    {
        public static void SeedDatabase(ApiContext context)
        {
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();
            var customers = new List<Customer>();

            for (int x = 0; x < 4; x++)
            {
                var cus = new Customer()
                {
                    Name = $"Customer_{x + 1}",
                    Projects = new List<Project>()
                };
                for (int y = x * 4; y < (x * 4) + 4; y++)
                {
                    var proj = new Project()
                    {
                        DeadLine = DateTime.Now.AddDays(y * 5),
                        Name = $"Project_{y + 1}",
                        Status = (y + 1) % 3 == 0 ? Enum.GetName(typeof(ProjectStatus), ProjectStatus.Completed) : Enum.GetName(typeof(ProjectStatus), ProjectStatus.InProgress),
                        TimeRegistrations = new List<TimeRegistration>(),
                        Customer = cus,
                        CustomerId = cus.Id

                    };
                    for (int z = y * 4; z < (y * 4) + 4; z++)
                    {
                        var reg = new TimeRegistration()
                        {
                            Comment = $"Comment_{z + 1}",
                            TimeLoggedInMinutes = z == 0 ? 30 : z * 30,
                            Project = proj,
                            ProjectId = proj.Id,
                            Date = DateTime.Now.AddDays(z)
                        };
                        proj.TimeRegistrations.Add(reg);
                    }
                    cus.Projects.Add(proj);
                }
                customers.Add(cus);
            }
            context.Customers.AddRange(customers);
            context.SaveChanges();
        }
    }
}