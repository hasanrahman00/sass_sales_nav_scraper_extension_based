/**
 * Express App — middleware chain.
 *
 * CORS: Only dashboard origin. Extension sends API key as header,
 * not cookies, so it doesn't trigger CORS preflight.
 */
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const requestId = require('./middleware/requestId');
const requestLogger = require('./middleware/requestLogger');

const app = express();

app.use(requestId);
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(requestLogger);

module.exports = app;
