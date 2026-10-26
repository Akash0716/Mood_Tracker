const express = require('express');
const router = express.Router();
const {
  getSummary,
  getMoodTrends,
  getMoodDistribution,
  getWeekdayAverages,
  getHabitProgress,
  getPrompts,
} = require('../controllers/analyticsController');
const { requireAuth } = require('../middleware/auth');

// Public prompts endpoint
router.get('/prompts', getPrompts);

// Protected analytics endpoints
router.use(requireAuth);
router.get('/summary', getSummary);
router.get('/mood-trends', getMoodTrends);
router.get('/mood-distribution', getMoodDistribution);
router.get('/weekday-averages', getWeekdayAverages);
router.get('/habit-progress', getHabitProgress);

module.exports = router;
