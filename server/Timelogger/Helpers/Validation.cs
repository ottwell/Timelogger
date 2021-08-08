using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Timelogger.Helpers
{
    public static class Validation
    {
        public static IEnumerable<ValidationResult> ValidatePatch<T>(T entity, IEnumerable<string> changedPropNames)
        {
            var innerValidationContext = new ValidationContext(entity);
            List<ValidationResult> validationResults = new List<ValidationResult>();
            foreach (var propName in changedPropNames)
            {
                innerValidationContext.MemberName = propName;
                Validator.TryValidateProperty(typeof(T).GetProperty(propName).GetValue(entity), innerValidationContext, validationResults);
            }
            return validationResults;
        }
    }
}
