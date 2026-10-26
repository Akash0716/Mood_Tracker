const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for authentication routes.
 * Limits repeated failed attempts to prevent brute-force attacks.
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

/**
 * General API rate limiter for standard user actions.
 */
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Request limit exceeded. Please wait a moment before trying again.',
  },
});

module.exports = {
  authRateLimiter,
  generalRateLimiter,
};
