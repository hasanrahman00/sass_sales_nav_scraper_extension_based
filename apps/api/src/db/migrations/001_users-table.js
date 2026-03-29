/**
 * Migration 001: Users Table
 *
 * WHAT:  The core account table. Every other table references this.
 *
 * COLUMNS:
 *   id         → UUID (auto-generated, not sequential — harder to guess)
 *   email      → Unique. Login identifier. Lowercase enforced in app code.
 *   password_hash → bcrypt hash (cost 12). Raw password NEVER stored.
 *   name       → Display name in dashboard and extension popup.
 *   plan       → 'free' or 'unlimited'. Changed by Dodo webhook.
 *   dodo_customer_id → Set when user first buys something via Dodo.
 *   email_verified   → True after clicking verification email link.
 *   onboarding_completed → True after finishing 3-step onboarding.
 *
 * RUN:   npm run migrate:up     (creates this table)
 * UNDO:  npm run migrate:down   (drops this table — dev only!)
 */

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    name: { type: 'varchar(100)' },
    plan: { type: 'varchar(20)', notNull: true, default: "'free'" },
    dodo_customer_id: { type: 'varchar(255)' },
    email_verified: { type: 'boolean', notNull: true, default: false },
    onboarding_completed: { type: 'boolean', notNull: true, default: false },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};