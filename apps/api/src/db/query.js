/**
 * Database Query Helper
 *
 * WHAT:  Wraps pool.query() with slow query logging + error context.
 *
 * READ:  const db = require('../db/query');
 *        const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
 * WRITE: const client = await db.getClient();  // For transactions (BEGIN/COMMIT)
 * UPDATE: Change SLOW_QUERY_MS to adjust the logging threshold.
 */

const pool = require('./pool');
const logger = require('../lib/logger');

const SLOW_QUERY_MS = 500;

const db = {
  async query(text, params) {
    const start = Date.now();
    try {
      const result = await pool.query(text, params);
      const ms = Date.now() - start;
      if (ms > SLOW_QUERY_MS) {
        logger.warn('Slow query', { duration: `${ms}ms`, query: text.slice(0, 100) });
      }
      return result;
    } catch (err) {
      err.query = text.slice(0, 100); // Attach query context to the error
      throw err;
    }
  },

  // Get a client for transactions (BEGIN/COMMIT/ROLLBACK)
  async getClient() { return pool.connect(); },

  // Direct pool access (for pg-cursor streaming on Day 15)
  pool,
};

module.exports = db;