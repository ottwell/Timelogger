using Microsoft.AspNet.OData;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Timelogger.Entities;

namespace Timelogger.DataAccess
{
    public interface IRepository
    {
        public Task<IQueryable<T>> GetAll<T>() where T : BaseEntity;

        public Task<T> GetById<T>(int id) where T : BaseEntity;

        public Task<T> Create<T>(T input) where T : BaseEntity;

        public Task<IEnumerable<ValidationResult>> Patch<T>(T entity, Delta<T> patch) where T : BaseEntity;
    }
}
