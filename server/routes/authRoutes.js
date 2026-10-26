const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  changePassword,
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimiter');

// Public auth endpoints protected by rate limiting
router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/logout', logout);

// Protected auth endpoints
router.get('/me', requireAuth, getMe);
router.patch('/change-password', requireAuth, changePassword);

module.exports = router;
