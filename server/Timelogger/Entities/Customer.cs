using System.Collections.Generic;

namespace Timelogger.Entities
{
    public class Customer : BaseEntity
    {
        public string Name { get; set; }
        public virtual ICollection<Project> Projects { get; set; }

    }
}