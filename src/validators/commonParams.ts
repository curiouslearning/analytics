import { z } from 'zod';

/**
 * Common validators for event tracking fields.
 * These provide basic type checking and required field validation.
 */

/**
 * Creates a validator for required string fields.
 * 
 * @param fieldName - The name of the field being validated, used in error messages
 * @returns A Zod validator that ensures:
 * - The field is present (not undefined)
 * - The value is a string
 * 
 * @example
 * ```ts
 * const schema = z.object({
 *   userId: requiredString('User ID')
 * });
 * ```
 */
export const requiredString = (fieldName: string) => z.string({
  required_error: `${fieldName} is required`,
  invalid_type_error: `${fieldName} must be a string`
});

/**
 * Creates a validator for required number fields.
 * 
 * @param fieldName - The name of the field being validated, used in error messages
 * @returns A Zod validator that ensures:
 * - The field is present (not undefined)
 * - The value is a number
 * 
 * @example
 * ```ts
 * const schema = z.object({
 *   duration: requiredNumber('Duration in seconds')
 * });
 * ```
 */
export const requiredNumber = (fieldName: string) => z.number({
  required_error: `${fieldName} is required`,
  invalid_type_error: `${fieldName} must be a number`
});

/**
 * Creates a validator for required date fields.
 * 
 * @param fieldName - The name of the field being validated, used in error messages
 * @returns A Zod validator that ensures:
 * - The field is present (not undefined)
 * - The value is a string (dates are passed as strings)
 * 
 * @example
 * ```ts
 * const schema = z.object({
 *   event_date: requiredDate('Event date')
 * });
 * ```
 */
export const requiredDate = (fieldName: string) => z.string({
  required_error: `${fieldName} is required`,
  invalid_type_error: `${fieldName} must be a string`
});

/**
 * Creates a validator for required non-negative number fields.
 * Useful for fields that must be zero or positive, like durations or counts.
 * 
 * @param fieldName - The name of the field being validated, used in error messages
 * @returns A Zod validator that ensures:
 * - The field is present (not undefined)
 * - The value is a number
 * - The value is greater than or equal to zero
 * 
 * @example
 * ```ts
 * const schema = z.object({
 *   duration_ms: requiredNonNegativeNumber('Duration in milliseconds')
 * });
 * 
 * // These will pass validation
 * schema.parse({ duration_ms: 0 });
 * schema.parse({ duration_ms: 1000 });
 * 
 * // These will fail validation
 * schema.parse({ duration_ms: -1 }); // Error: Duration in milliseconds cannot be negative
 * schema.parse({}); // Error: Duration in milliseconds is required
 * ```
 */
export const requiredNonNegativeNumber = (fieldName: string) => z.number({
  required_error: `${fieldName} is required`,
  invalid_type_error: `${fieldName} must be a number`
}).nonnegative(`${fieldName} cannot be negative`);

/**
 * Creates a validator for date fields that must match a specific format.
 * Includes both format validation via regex and optional date validity checking.
 * 
 * @param fieldName - The name of the field being validated, used in error messages
 * @param format - The expected format (e.g., 'YYYYMMDD', 'YYYY-MM-DD')
 * @param regex - Regular expression to validate the format
 * @returns A Zod validator that ensures:
 * - The field is present (not undefined)
 * - The value is a string
 * - The value matches the specified format
 * - For YYYYMMDD format, validates that the date is valid
 * 
 * @example
 * ```ts
 * const schema = z.object({
 *   date: requiredDateInFormat('Event date', 'YYYYMMDD', /^\d{8}$/)
 * });
 * 
 * // These will pass validation
 * schema.parse({ date: '20240315' }); // March 15, 2024
 * 
 * // These will fail validation
 * schema.parse({ date: '2024-03-15' }); // Error: Event date must be in YYYYMMDD format
 * schema.parse({ date: '20240229' }); // Error: Invalid date (not a leap year)
 * schema.parse({}); // Error: Event date is required
 * ```
 */
export const requiredDateInFormat = (fieldName: string, format: string, regex: RegExp) => z.string({
  required_error: `${fieldName} is required`,
  invalid_type_error: `${fieldName} must be a string`
})
.regex(regex, `${fieldName} must be in ${format} format`)
.refine((date) => {
  if (format === 'YYYYMMDD') {
    const year = parseInt(date.substring(0, 4));
    const month = parseInt(date.substring(4, 6));
    const day = parseInt(date.substring(6, 8));
    
    const dateObj = new Date(year, month - 1, day);
    return dateObj.getFullYear() === year &&
           dateObj.getMonth() === month - 1 &&
           dateObj.getDate() === day;
  }
  return true;
}, 'Invalid date');