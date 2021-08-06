using System;
using System.ComponentModel.DataAnnotations;

namespace Timelogger.Entities
{
    public class TimeRegistration : BaseEntity
    {
        public string Comment { get; set; }

        [Range(30, int.MaxValue)]
        public int TimeLoggedInMinutes { get; set; }

        public virtual Project Project { get; set; }

        public int ProjectId { get; set; }

        public DateTime Date { get; set; }
    }
}
