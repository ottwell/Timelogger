using Microsoft.AspNet.OData;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Timelogger.Entities;
using Timelogger.Helpers;

namespace Timelogger.DataAccess
{
    public class Repository : IRepository, IDisposable
    {
        private readonly ApiContext _context;

        private bool _disposed;

        public Repository(ApiContext context)
        {
            _context = context;
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
            if(validationErrors.Count() == 0)
            {
                await _context.SaveChangesAsync();
            }
            return validationErrors;
        }



        public void Dispose()
        {
            if (_disposed)
                return;
            _disposed = true;
        }
    }
}
