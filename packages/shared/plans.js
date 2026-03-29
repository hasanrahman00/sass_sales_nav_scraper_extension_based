/**
 * Plans & Limits
 *
 * WHERE: API enforces. Dashboard shows badges. Extension shows slot info.
 * CHANGE: Update here → both API and frontend update automatically.
 *         API can override via MAX_PROFILES_FREE / MAX_PROFILES_UNLIMITED env vars.
 */

const PLANS = {
  FREE: 'free',
  UNLIMITED: 'unlimited',
};

const FREE_LEAD_LIMIT = 100;

// Default profile limits — API overrides from env at runtime
const PROFILE_LIMITS = {
  [PLANS.FREE]: 2,
  [PLANS.UNLIMITED]: 3,
};

module.exports = { PLANS, FREE_LEAD_LIMIT, PROFILE_LIMITS };
