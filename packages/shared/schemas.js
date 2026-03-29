/**
 * Validation Schemas (Zod)
 *
 * WHAT:  Defines input shape for auth endpoints.
 * WHERE: API validates req.body. Frontend can validate forms.
 *
 * READ:  const { registerSchema } = require('@vikileads/shared/schemas');
 * UPDATE: Add new schemas as you build endpoints (Day 7: ingestSchema, etc.)
 *
 * CRITICAL: .trim() must come BEFORE .email() — zod applies in order.
 *   "  Hasan@Test.COM  " → .trim() → "Hasan@Test.COM" → .email() ✅ → .toLowerCase()
 *   Without .trim(): .email() sees spaces → ❌ fails
 */

const { z } = require('zod');

const registerSchema = z.object({
  email: z.string()
    .trim()                                // 1. Remove spaces
    .email('Invalid email address')        // 2. Validate format
    .max(255)
    .transform((v) => v.toLowerCase()),    // 3. Normalize for DB
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100),
  name: z.string()
    .trim()
    .min(1, 'Name is required')
    .max(100),
});

const loginSchema = z.object({
  email: z.string()
    .trim()
    .email('Invalid email address')
    .transform((v) => v.toLowerCase()),
  password: z.string()
    .min(1, 'Password is required'),
});

module.exports = { registerSchema, loginSchema };