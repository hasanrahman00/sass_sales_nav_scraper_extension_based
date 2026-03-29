/**
 * Auth Routes — mounted at /api/v1/auth in server.js
 *
 * Day 3: POST /register, POST /login
 * Day 4: POST /refresh, POST /logout, GET /me
 * Day 27: POST /forgot-password, POST /reset-password
 *
 * PATTERN: validate input → call service → send response
 *          Errors flow to errorHandler via next(err).
 */

const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('@vikileads/shared/schemas');
const { createUser, loginUser } = require('../services/auth.service');
const { setRefreshCookie } = require('../lib/cookies');

// POST /register — create account
// Returns: 201 { user }  Errors: 400 (validation) · 409 (email exists)
router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

// POST /login — authenticate with email + password
// Returns: 200 { token, user } + sets httpOnly refresh cookie
// Errors: 400 (validation) · 401 (wrong credentials)
router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { token, refreshToken, user } = await loginUser(req.body);
    setRefreshCookie(res, refreshToken);
    res.json({ token, user });
  } catch (err) {
    next(err);
  }
});

// Day 4: POST /refresh, POST /logout, GET /me

module.exports = router;