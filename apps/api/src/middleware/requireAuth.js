/**
 * requireAuth — JWT verification for dashboard routes
 *
 * WHAT:  Reads "Authorization: Bearer <jwt>", verifies it,
 *        attaches { id, email, plan } to req.user.
 *
 * WHERE: Every protected dashboard route:
 *        router.get('/me', requireAuth, handler)
 *
 * ON FAILURE: 401 → client should call POST /auth/refresh
 */

const jwt = require('jsonwebtoken');
const AppError = require('../lib/AppError');
const { ERROR_CODES } = require('@vikileads/shared');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Missing auth token', 401, ERROR_CODES.UNAUTHORIZED));
  }

  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    return next(new AppError('Invalid or expired token', 401, ERROR_CODES.UNAUTHORIZED));
  }
}

module.exports = requireAuth;