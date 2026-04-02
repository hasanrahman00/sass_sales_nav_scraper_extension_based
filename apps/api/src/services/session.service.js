/**
 * Session Service — refresh (with rotation), logout, revoke all
 * Called by session.routes.js. Rotation = delete old token + issue new one.
 */

const db = require('../db/query');
const AppError = require('../lib/AppError');
const { signJWT, createRefreshToken, hashToken } = require('../lib/tokens');
const { ERROR_CODES } = require('@vikileads/shared');

async function refreshSession(rawToken, device = 'web') {
  const hash = hashToken(rawToken);
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // Lock the token row — prevents race condition
    const { rows } = await client.query(
      `SELECT rt.id, rt.expires_at,
              u.id AS user_id, u.email, u.name, u.plan
       FROM refresh_tokens rt
       JOIN users u ON u.id = rt.user_id
       WHERE rt.token_hash = $1
       FOR UPDATE`,
      [hash]
    );

    if (rows.length === 0) {
      await client.query('ROLLBACK');
      throw new AppError('Invalid refresh token', 401, ERROR_CODES.INVALID_REFRESH);
    }

    const session = rows[0];

    if (new Date(session.expires_at) < new Date()) {
      await client.query('DELETE FROM refresh_tokens WHERE id = $1', [session.id]);
      await client.query('COMMIT');
      throw new AppError('Refresh token expired', 401, ERROR_CODES.INVALID_REFRESH);
    }

    // Rotation: delete old, create new — inside same transaction
    await client.query('DELETE FROM refresh_tokens WHERE id = $1', [session.id]);

    const user = { id: session.user_id, email: session.email, name: session.name, plan: session.plan };
    const token = signJWT(user);
    const refresh = createRefreshToken();

    await client.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, device, expires_at) VALUES ($1, $2, $3, $4)',
      [user.id, refresh.hash, device, refresh.expiresAt]
    );

    await client.query('COMMIT');
    return { token, refreshToken: refresh.raw, user };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

async function invalidateSession(rawToken) {
  const hash = hashToken(rawToken);
  await db.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [hash]);
}

async function revokeAllSessions(userId) {
  await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
}

module.exports = { refreshSession, invalidateSession, revokeAllSessions };