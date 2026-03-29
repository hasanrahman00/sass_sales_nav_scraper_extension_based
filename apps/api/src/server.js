/**
 * Server Entry Point
 *
 * TWO AUTH SYSTEMS:
 *   Dashboard → requireAuth (JWT from cookie)
 *   Extension → requireApiKey + requireProfile (registered profile check)
 *
 * RUN: node src/server.js (or: npm run dev)
 */

require('dotenv').config();

const app = require('./app');
const logger = require('./lib/logger');
const errorHandler = require('./middleware/errorHandler');
const pool = require('./db/pool');

const PORT = process.env.PORT || 3001;

// ─── Routes ─────────────────────────────────────────────
app.use(require('./routes/health'));

// Dashboard routes (JWT auth — requireAuth):
app.use('/api/v1/auth', require('./routes/auth.routes'));
// Day 6:  app.use('/api/v1/api-keys', requireAuth, require('./routes/apikey.routes'));
// Day 10: app.use('/api/v1/enrichment', requireAuth, require('./routes/enrichment.routes'));
// Day 11: app.use('/api/v1/events', require('./routes/events.routes'));
// Day 15: app.use('/api/v1/lists', requireAuth, require('./routes/list.routes'));
// Day 17: app.use('/api/v1/billing', require('./routes/billing.routes'));
// Day 18: app.use('/api/v1/credits', requireAuth, require('./routes/credit.routes'));

// Extension routes (API key + registered profile):
// Day 7:  app.use('/api/v1/profiles', requireApiKey, require('./routes/profile.routes'));
// Day 7:  app.use('/api/v1/leads', requireApiKey, requireProfile, require('./routes/lead.routes'));

// 404
app.use((req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: `${req.method} ${req.originalUrl} not found` },
  });
});

// Error handler — LAST
app.use(errorHandler);

// ─── Start ──────────────────────────────────────────────
const server = app.listen(PORT, () => {
  logger.info('API started', { port: PORT, env: process.env.NODE_ENV || 'development' });
});

// ─── Shutdown ───────────────────────────────────────────
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down');
  server.close(async () => {
    await pool.end();   // Close all DB connections cleanly
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', {
    error: reason instanceof Error ? reason.message : String(reason),
  });
});

module.exports = app;
