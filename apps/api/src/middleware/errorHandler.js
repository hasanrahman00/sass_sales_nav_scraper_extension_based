/**
 * Error Handler (LAST middleware)
 * 500 → "Something went wrong" (hide). 4xx → real message + extras.
 */
const logger = require('../lib/logger');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const isServer = status >= 500;

  (isServer ? logger.error : logger.warn)(err.message, {
    requestId: req.id, userId: req.user?.id, method: req.method,
    path: req.originalUrl, statusCode: status, code: err.code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  res.status(status).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: isServer ? 'Something went wrong' : err.message,
      ...(err.extras || {}),
    },
  });
};
