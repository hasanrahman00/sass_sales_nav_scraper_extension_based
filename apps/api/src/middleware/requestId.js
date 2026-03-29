/**
 * Request ID — unique ID per request for log tracing.
 */
const crypto = require('crypto');

module.exports = (req, res, next) => {
  req.id = req.headers['x-request-id'] || `req_${crypto.randomUUID().slice(0, 12)}`;
  res.setHeader('X-Request-Id', req.id);
  next();
};
