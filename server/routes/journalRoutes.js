const express = require('express');
const router = express.Router();
const {
  createJournal,
  getJournals,
  getJournalById,
  getJournalByDate,
  updateJournal,
  deleteJournal,
} = require('../controllers/journalController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.post('/', createJournal);
router.get('/', getJournals);
router.get('/date/:date', getJournalByDate);
router.get('/:id', getJournalById);
router.patch('/:id', updateJournal);
router.delete('/:id', deleteJournal);

module.exports = router;
