/**
 * Structured JSON Logger
 * Search: docker compose logs api | grep '"level":"error"'
 * USAGE: logger.info('msg', { key: 'val' })
 *        logger.forRequest(req).info('msg')  ← auto-attaches requestId + userId
 */

const isDev = process.env.NODE_ENV === 'development';

function toJSON(level, msg, ctx = {}) {
  const entry = { time: new Date().toISOString(), level, msg, ...ctx };
  for (const k of Object.keys(entry)) if (entry[k] === undefined) delete entry[k];
  return JSON.stringify(entry);
}

const logger = {
  info(msg, ctx) { console.log(toJSON('info', msg, ctx)); },
  warn(msg, ctx) { console.warn(toJSON('warn', msg, ctx)); },
  error(msg, ctx) {
    if (ctx?.error instanceof Error) {
      ctx = { ...ctx, error: ctx.error.message, stack: isDev ? ctx.error.stack : undefined };
    }
    console.error(toJSON('error', msg, ctx));
  },
  forRequest(req) {
    const base = { requestId: req?.id, userId: req?.user?.id };
    return {
      info: (msg, c) => logger.info(msg, { ...base, ...c }),
      warn: (msg, c) => logger.warn(msg, { ...base, ...c }),
      error: (msg, c) => logger.error(msg, { ...base, ...c }),
    };
  },
};

module.exports = logger;
