/**
 * Session Routes — mounted at /api/v1/auth in server.js
 *
 * POST /refresh — silent token refresh (reads httpOnly cookie)
 * POST /logout  — clear cookie + delete token from DB
 * GET  /me      — current user from DB (requires JWT)
 */

const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const { refreshSession, invalidateSession } = require('../services/session.service');
const { setRefreshCookie, clearRefreshCookie, COOKIE_NAME } = require('../lib/cookies');
const { ERROR_CODES } = require('@vikileads/shared');
const db = require('../db/query');

// POST /refresh — 200 { token, user } + new cookie · 401
router.post('/refresh', async (req, res, next) => {
  try {
    const rawToken = req.cookies[COOKIE_NAME];
    if (!rawToken) {
      return res.status(401).json({ error: { code: ERROR_CODES.INVALID_REFRESH, message: 'No refresh token' } });
    }
    const { token, refreshToken, user } = await refreshSession(rawToken);
    setRefreshCookie(res, refreshToken);
    res.json({ token, user });
  } catch (err) { next(err); }
});

// POST /logout — 200 { message } · clears cookie
router.post('/logout', async (req, res, next) => {
  try {
    const rawToken = req.cookies[COOKIE_NAME];
    if (rawToken) await invalidateSession(rawToken);
    clearRefreshCookie(res);
    res.json({ message: 'Logged out' });
  } catch (err) { next(err); }
});

// GET /me — 200 { user } · 401
// Fetches fresh data from DB (not JWT — plan might have changed)
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, email, name, plan, email_verified, onboarding_completed, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: { code: ERROR_CODES.UNAUTHORIZED, message: 'User not found' } });
    }
    res.json({ user: rows[0] });
  } catch (err) { next(err); }
});

module.exports = router;