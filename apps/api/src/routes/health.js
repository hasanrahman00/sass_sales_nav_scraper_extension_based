/**
 * Health Check Route (updated Day 2 — now checks database)
 *
 * GET /api/health
 *
 * WHAT:  Tells you if server AND database are alive.
 * WHO:   UptimeRobot pings every 60s. Deploy scripts check after deploy.
 *
 * READ:  curl http://localhost:3001/api/health
 * RETURNS:
 *   200 { status: 'ok',       db: 'connected' }    — everything works
 *   503 { status: 'degraded', db: 'disconnected' }  — database is down
 *
 * UPDATE: Day 31 adds Redis + enricher service checks.
 */

const express = require('express');
const db = require('../db/query');

const router = express.Router();

router.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';

  try {
    await db.query('SELECT 1');
    dbStatus = 'connected';
  } catch {
    // DB is down — don't crash, just report degraded
  }

  const status = dbStatus === 'connected' ? 'ok' : 'degraded';

  res.status(status === 'ok' ? 200 : 503).json({
    status,
    db: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

module.exports = router;