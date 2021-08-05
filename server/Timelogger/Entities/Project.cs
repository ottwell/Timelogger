using System;
using System.Collections.Generic;

namespace Timelogger.Entities
{
    public class Project : BaseEntity
    {
        public string Name { get; set; }
        public string Status { get; set; }
        public DateTime DeadLine { get; set; }
        public virtual ICollection<TimeRegistration> TimeRegistrations { get; set; }
        public virtual Customer Customer { get; set; }
        public int CustomerId { get; set; }

    }
}
