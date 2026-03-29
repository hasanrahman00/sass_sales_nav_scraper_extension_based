/**
 * GET /api/health — is the server alive?
 * Day 2: adds DB check. Day 31: adds Redis + enricher checks.
 */
const express = require('express');
const router = express.Router();

router.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

module.exports = router;
