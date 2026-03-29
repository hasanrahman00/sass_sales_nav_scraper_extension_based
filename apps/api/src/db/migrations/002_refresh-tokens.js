/**
 * Migration 002: Refresh Tokens
 *
 * WHAT:  Hashed refresh tokens for dashboard JWT sessions.
 *        Extension uses API keys — no refresh tokens needed.
 *
 * WHY HASH: Raw token → user's cookie. Only SHA-256 hash in DB.
 * WHY ROTATION: Each refresh deletes old token, creates new one.
 *               Stolen token fails because old hash is gone.
 *
 * INDEXES: token_hash (fast lookup), user_id (fast "revoke all")
 *
 * RUN:  npm run migrate:up   UNDO: npm run migrate:down
 */

exports.up = (pgm) => {
  pgm.createTable('refresh_tokens', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE', // Delete user → all their tokens gone
    },
    token_hash: { type: 'varchar(255)', notNull: true },
    device: { type: 'varchar(50)' }, // 'web' — helps "log out all devices"
    expires_at: { type: 'timestamptz', notNull: true },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });

  pgm.createIndex('refresh_tokens', 'token_hash');
  pgm.createIndex('refresh_tokens', 'user_id');
};

exports.down = (pgm) => {
  pgm.dropTable('refresh_tokens');
};