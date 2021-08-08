using FluentAssertions;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Results;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Timelogger;
using Timelogger.Api.Controllers;
using Timelogger.DataAccess;
using Timelogger.Entities;
using Timelogger.Helpers;
using Xunit;

namespace TimeLogger.ApiTest
{
    public class ApiControllerTest : IClassFixture<WebApplicationFactory<Timelogger.Api.Startup>>
    {
        private readonly HttpClient _client;

        private readonly IRepository _repo;


        public ApiControllerTest(WebApplicationFactory<Timelogger.Api.Startup> fixture)
        {
           
            IServiceCollection services = new ServiceCollection();
            services.AddSingleton<IRepository, FakeRepository>();
            var serviceProvider = services.BuildServiceProvider();
            _repo = serviceProvider.GetService<IRepository>();
            _client = fixture.CreateClient();
        }


        [Fact]
        public async Task Can_get_Customers()
        {
            var response = await _client.GetAsync("/odata/customers");
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var resultObj = JsonConvert.DeserializeObject<JObject>(await response.Content.ReadAsStringAsync());
            var customers = resultObj.GetValue("value").ToArray();
            var dbCustomers = await _repo.GetAll<Customer>();
            customers.Count().Should().Be(dbCustomers.Count());
        }

        [Fact]
        public async Task Can_get_Projects()
        {
            var response = await _client.GetAsync("/odata/projects");
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var resultObj = JsonConvert.DeserializeObject<JObject>(await response.Content.ReadAsStringAsync());
            var projects = resultObj.GetValue("value").ToArray();
            var dbProjects = await _repo.GetAll<Project>();
            projects.Count().Should().Be(dbProjects.Count());
        }

        [Fact]
        public async Task Can_Get_Project_By_Id()
        {
            var response = await _client.GetAsync("/odata/projects(2)");
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var resultObj = JsonConvert.DeserializeObject<JObject>(await response.Content.ReadAsStringAsync());
            var projectId = resultObj.GetValue("Id").Value<int>();
            projectId.Should().Be(2);
        }

        [Fact]
        public async Task Can_Get_Project_By_Filter()
        {
            var response = await _client.GetAsync("/odata/projects?$filter=Id eq 2");
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var resultObj = JsonConvert.DeserializeObject<JObject>(await response.Content.ReadAsStringAsync());
            var projects = resultObj.GetValue("value").ToArray();
            var projectId = projects[0]["Id"].Value<int>();
            projectId.Should().Be(2);
        }

        [Fact]
        public async Task Can_Get_404_For_Non_Existent_Id()
        {
            var response = await _client.GetAsync("/odata/projects(566544)");
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task Can_get_Time_Regs()
        {
            var response = await _client.GetAsync("/odata/timeregistrations");
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var resultObj = JsonConvert.DeserializeObject<JObject>(await response.Content.ReadAsStringAsync());
            var timeRegs = resultObj.GetValue("value").ToArray();
            var dbTimeRegs = await _repo.GetAll<TimeRegistration>();
            timeRegs.Count().Should().Be(dbTimeRegs.Count());
        }

        [Fact]
        public async Task Can_Create_Time_Reg()
        {
            var reg = new TimeRegistration()
            {
                Comment = "test comment",
                Date = DateTime.Now,
                ProjectId = 4,
                TimeLoggedInMinutes = 30
            };
            var json = JsonConvert.SerializeObject(reg);
            var data = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("/odata/timeregistrations", data);
            response.StatusCode.Should().Be(HttpStatusCode.Created);
        }

        [Fact]
        public async Task Can_Update_Time_Reg()
        {
            dynamic delta = new JObject();
            delta.Comment = "new test comment";
            delta["@odata.context"] = "http://localhost:3001/odata/$metadata#TimeRegistrations/$entity";
            var serialized = JsonConvert.SerializeObject(delta);
            var data = new StringContent(serialized, Encoding.UTF8, "application/json");
            var response = await _client.PatchAsync("/odata/timeregistrations(10)", data);
            response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }

        [Fact]
        public async Task Cannot_Create_Time_Reg_With_Low_Time_Value()
        {
            var reg = new TimeRegistration()
            {
                Comment = "test comment",
                Date = DateTime.Now,
                ProjectId = 4,
                TimeLoggedInMinutes = 15
            };
            var json = JsonConvert.SerializeObject(reg);
            var data = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("/odata/timeregistrations", data);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task Cannot_Update_Time_Reg_With_Low_Time_Value()
        {
            dynamic delta = new JObject();
            delta.TimeLoggedInMinutes = 10;
            delta["@odata.context"] = "http://localhost:3001/odata/$metadata#TimeRegistrations/$entity";
            var serialized = JsonConvert.SerializeObject(delta);
            var data = new StringContent(serialized, Encoding.UTF8, "application/json");
            var response = await _client.PatchAsync("/odata/timeregistrations(8)", data);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task Cannot_Add_Time_Reg_To_Complted_Project()
        {
            var reg = new TimeRegistration()
            {
                Comment = "test comment",
                Date = DateTime.Now,
                ProjectId = 6,
                TimeLoggedInMinutes = 30
            };
            var json = JsonConvert.SerializeObject(reg);
            var data = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _client.PostAsync("/odata/timeregistrations", data);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        }



    }
}
