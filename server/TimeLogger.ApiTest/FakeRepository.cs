using Microsoft.AspNet.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Timelogger;
using Timelogger.DataAccess;
using Timelogger.Entities;
using Timelogger.Helpers;

namespace TimeLogger.ApiTest
{
    public class FakeRepository : IRepository
    {
        private readonly ApiContext _context;


        public FakeRepository()
        {
            var contextOptions = new DbContextOptionsBuilder<ApiContext>()
             .UseInMemoryDatabase(databaseName: "Test")
             .Options;
            _context = new ApiContext(contextOptions);
            SeedingHelper.SeedDatabase(_context);
        }

        public async Task<IQueryable<T>> GetAll<T>() where T : BaseEntity
        {
            await _context.Set<T>().LoadAsync();
            return _context.Set<T>();
        }

        public async Task<T> GetById<T>(int id) where T : BaseEntity
        {
            return await _context.Set<T>().FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<T> Create<T>(T input) where T : BaseEntity
        {
            _context.Set<T>().Add(input);
            await _context.SaveChangesAsync();
            return input;
        }

        public async Task<IEnumerable<ValidationResult>> Patch<T>(T entity, Delta<T> patch) where T : BaseEntity
        {
            patch.Patch(entity);
            var validationErrors = Validation.ValidatePatch(entity, patch.GetChangedPropertyNames());
            if (validationErrors.Count() == 0)
            {
                await _context.SaveChangesAsync();
            }
            return validationErrors;
        }

    }
}
