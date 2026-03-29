/**
 * Zod Validation Middleware
 *
 * WHAT:  Validates req.body against a zod schema.
 * WHERE: Route middleware: router.post('/register', validate(registerSchema), handler)
 *
 * READ:  const validate = require('../middleware/validate');
 *
 * ON SUCCESS: req.body replaced with parsed data (trimmed, lowercased, etc.)
 * ON FAILURE: 400 { error: { code: 'VALIDATION_ERROR', details: { email: '...' } } }
 */

const AppError = require('../lib/AppError');
const { ERROR_CODES } = require('@vikileads/shared');

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // Convert zod issues to { field: message } object
      const details = {};
      for (const issue of result.error.issues) {
        details[issue.path.join('.')] = issue.message;
      }
      return next(
        new AppError('Validation failed', 400, ERROR_CODES.VALIDATION_ERROR, { details })
      );
    }

    req.body = result.data; // Replace with cleaned data
    next();
  };
}

module.exports = validate;