const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePreferences,
} = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/preferences', updatePreferences);

module.exports = router;
