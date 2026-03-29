/**
 * Token Utilities
 *
 * WHAT:  Creates JWTs and refresh tokens.
 * WHERE: auth.service.js (login), session.service.js (refresh — Day 4).
 *
 * READ:  const { signJWT, createRefreshToken, hashToken } = require('../lib/tokens');
 * UPDATE: Change JWT_EXPIRY or REFRESH_DAYS here.
 *
 * JWT: Contains { id, email, plan }. Expires 1h. Sent in response body.
 * Refresh: Random UUID. Expires 30d. Only SHA-256 hash stored in DB.
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_EXPIRY = '1h';
const REFRESH_DAYS = 30;

function signJWT(user) {
  return jwt.sign(
    { id: user.id, email: user.email, plan: user.plan },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

function createRefreshToken() {
  const raw = crypto.randomUUID();
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  const expiresAt = new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000);
  return { raw, hash, expiresAt };
}

function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

module.exports = { signJWT, createRefreshToken, hashToken, REFRESH_DAYS };