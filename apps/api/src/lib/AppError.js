/**
 * AppError — throw clean API errors in one line
 * throw new AppError('Not enough', 402, 'INSUFFICIENT_CREDITS', { required: 50, balance: 10 });
 * Client gets: { error: { code, message, required, balance } }
 */

class AppError extends Error {
  constructor(message, statusCode, code, extras = {}) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.extras = extras;
  }
}

module.exports = AppError;
