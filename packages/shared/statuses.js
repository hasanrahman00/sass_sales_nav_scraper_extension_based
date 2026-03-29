/**
 * Statuses
 *
 * WHERE: API writes to DB. Dashboard shows as colored badges.
 * WHY CONSTANTS: Typo 'pending' as 'pendig' = invisible bug.
 *
 * NOTE: No profile status. A registered profile either exists
 *       in the table or it doesn't. No status column needed.
 */

const LEAD_STATUS = {
  PENDING: 'pending',
  ENRICHING: 'enriching',
  VALID: 'valid',
  CATCH_ALL: 'catch_all',
  NOT_FOUND: 'not_found',
  NO_DOMAIN: 'no_domain',
  INVALID: 'invalid',
};

const JOB_STATUS = {
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

module.exports = { LEAD_STATUS, JOB_STATUS };
