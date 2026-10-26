const express = require('express');
const router = express.Router();
const {
  createMood,
  getMoods,
  getMoodById,
  updateMood,
  deleteMood,
  getTodayMood,
} = require('../controllers/moodController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.post('/', createMood);
router.get('/', getMoods);
router.get('/today', getTodayMood);
router.get('/:id', getMoodById);
router.patch('/:id', updateMood);
router.delete('/:id', deleteMood);

module.exports = router;
