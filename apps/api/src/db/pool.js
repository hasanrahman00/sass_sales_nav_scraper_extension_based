/**
 * Database Connection Pool
 *
 * WHAT:  Creates a pool of database connections shared by all routes.
 *        Instead of opening a new connection per request (slow),
 *        routes borrow a connection from the pool, use it, return it.
 *
 * READ:  const pool = require('../db/pool');
 * WRITE: Never write to this file from routes. Just import and use.
 * UPDATE: Change max connections or timeouts here.
 *
 * HOW IT CONNECTS:
 *   Dev:  DATABASE_URL → PostgreSQL directly (port 5432)
 *   Prod: DATABASE_URL → PgBouncer (port 6432) → PostgreSQL
 *   You change the port in .env, not in this file.
 *
 * WHY max: 20?
 *   PM2 runs 4 API processes in production. 4 × 20 = 80 connections.
 *   PgBouncer multiplexes these into 100 real PostgreSQL connections.
 *   If pool is full, new queries wait up to 5 seconds, then fail.
 */

const { Pool } = require('pg');
const logger = require('../lib/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                       // Connections per API process
  idleTimeoutMillis: 30000,      // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Fail if pool full after 5s
});

// Log pool-level errors (not query errors — those bubble up normally)
pool.on('error', (err) => {
  logger.error('Database pool error', { error: err.message });
});

module.exports = pool;