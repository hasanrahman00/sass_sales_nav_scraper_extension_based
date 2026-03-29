/**
 * @vikileads/shared — re-exports all constants
 * USAGE: const { PLANS, ERROR_CODES } = require('@vikileads/shared');
 */
module.exports = {
  ...require('./plans'),
  ...require('./credits'),
  ...require('./statuses'),
  ...require('./errors'),
};
