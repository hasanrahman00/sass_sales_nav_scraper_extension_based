/**
 * Auth Service — createUser() + loginUser()
 * Called by auth.routes.js. Never touches req/res.
 * Day 27 adds: forgotPassword(), resetPassword()
 */

const bcrypt = require('bcrypt');
const db = require('../db/query');
const AppError = require('../lib/AppError');
const { signJWT, createRefreshToken } = require('../lib/tokens');
const { ERROR_CODES } = require('@vikileads/shared');

const BCRYPT_COST = 12; // ~250ms per hash
const DUMMY_HASH = '$2b$12$000000000000000000000uVHbDWMOV3YC7eSJLR7NOHhPkaqG3Cq';

async function createUser({ email, password, name }) {
  const hash = await bcrypt.hash(password, BCRYPT_COST);
  try {
    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, plan, created_at`,
      [email, hash, name]
    );
    return rows[0];
  } catch (err) {
    if (err.code === '23505') { // PostgreSQL unique violation
      throw new AppError('Email already registered', 409, ERROR_CODES.EMAIL_EXISTS);
    }
    throw err;
  }
}

async function loginUser({ email, password, device = 'web' }) {
  const { rows } = await db.query(
    'SELECT id, email, name, plan, password_hash FROM users WHERE email = $1',
    [email]
  );

  // Always run bcrypt — prevents timing-based email enumeration
  if (rows.length === 0) {
    await bcrypt.compare(password, DUMMY_HASH); // Same ~250ms delay
    throw new AppError('Invalid email or password', 401, ERROR_CODES.INVALID_CREDENTIALS);
  }

  const user = rows[0];
  if (!(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError('Invalid email or password', 401, ERROR_CODES.INVALID_CREDENTIALS);
  }

  const token = signJWT(user);
  const refresh = createRefreshToken();

  await db.query(
    'INSERT INTO refresh_tokens (user_id, token_hash, device, expires_at) VALUES ($1, $2, $3, $4)',
    [user.id, refresh.hash, device, refresh.expiresAt]
  );

  return {
    token,
    refreshToken: refresh.raw,
    user: { id: user.id, email: user.email, name: user.name, plan: user.plan },
  };
}

module.exports = { createUser, loginUser };