using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
using Timelogger.Helpers;
using Microsoft.AspNet.OData.Extensions;

namespace Timelogger.Api
{
    public class Startup
    {
        private readonly IWebHostEnvironment _environment;
        public IConfigurationRoot Configuration { get; }

        public Startup(IWebHostEnvironment env)
        {
            _environment = env;

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApiContext>(opt => { opt.UseLazyLoadingProxies(); opt.UseInMemoryDatabase("e-conomic interview"); opt.EnableSensitiveDataLogging(); });
            services.AddOData();
            services.AddLogging(builder =>
            {
                builder.AddConsole();
                builder.AddDebug();
            });

            services.AddMvc(options => options.EnableEndpointRouting = false);

            if (_environment.IsDevelopment())
            {
                services.AddCors();
            }
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseCors(builder => builder
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .SetIsOriginAllowed(origin => true)
                    .AllowCredentials());

                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/error");
            }
            app.UseRouting();
            app.UseMvc();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapODataRoute("TimeLogger OData", "odata", Timelogger.OData.EdmModelBuilder.GetEntityDataModel()).Select().Expand().OrderBy().Filter();
            });


            var serviceScopeFactory = app.ApplicationServices.GetService<IServiceScopeFactory>();
            using (var scope = serviceScopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetService<ApiContext>();
                SeedingHelper.SeedDatabase(context);
            }
        }


    }
}