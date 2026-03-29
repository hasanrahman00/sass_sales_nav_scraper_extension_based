/**
 * Cookie Helper
 *
 * WHAT:  Sets and clears the refresh token httpOnly cookie.
 * WHERE: auth.routes.js (login, refresh, logout).
 *
 * READ:  const { setRefreshCookie, clearRefreshCookie } = require('../lib/cookies');
 * UPDATE: Change cookie settings here — one place for all routes.
 *
 * httpOnly → JS can't read it (prevents XSS theft)
 * secure   → HTTPS only in production
 * sameSite → 'lax' (allows navigating to your site, not 'strict')
 * path     → '/api/v1/auth' (cookie only sent to auth endpoints)
 * maxAge   → 30 days
 */

const COOKIE_NAME = 'refreshToken';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/v1/auth',
    maxAge: THIRTY_DAYS_MS,
  };
}

function setRefreshCookie(res, token) {
  res.cookie(COOKIE_NAME, token, cookieOptions());
}

function clearRefreshCookie(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions());
}

module.exports = { setRefreshCookie, clearRefreshCookie, COOKIE_NAME };