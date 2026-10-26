const express = require('express');
const router = express.Router();
const {
  saveHabit,
  getHabits,
  getTodayHabit,
  deleteHabit,
} = require('../controllers/habitController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.post('/', saveHabit);
router.get('/', getHabits);
router.get('/today', getTodayHabit);
router.delete('/:id', deleteHabit);

module.exports = router;
