/**
 * Request Logger — logs completed requests with duration.
 * Skips /api/health (UptimeRobot noise).
 */
const logger = require('../lib/logger');

module.exports = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    if (req.originalUrl === '/api/health') return;
    const d = { requestId: req.id, method: req.method, path: req.originalUrl,
                status: res.statusCode, duration: `${Date.now() - start}ms`, userId: req.user?.id };
    res.statusCode >= 400 ? logger.warn('Request', d) : logger.info('Request', d);
  });
  next();
};
