const Journal = require('../models/Journal');
const Mood = require('../models/Mood');
const { getTodayString, isValidDateString } = require('../utils/normalizeDate');

// Basic HTML sanitizer for plain text/safe markdown
function sanitizeText(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
}

/**
 * @desc    Create a new journal entry
 * @route   POST /api/journals
 * @access  Private
 */
const createJournal = async (req, res, next) => {
  try {
    const { title, content, gratitudeNotes, positiveMoments, prompt, tags, entryDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title for your journal entry.',
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Journal entry content cannot be blank.',
      });
    }

    const dateVal = entryDate && isValidDateString(entryDate) ? entryDate : getTodayString();

    const cleanTitle = sanitizeText(title);
    const cleanContent = sanitizeText(content);

    const newJournal = await Journal.create({
      userId: req.user.id,
      title: cleanTitle,
      content: cleanContent,
      gratitudeNotes: Array.isArray(gratitudeNotes)
        ? gratitudeNotes.map(sanitizeText).filter(Boolean)
        : [],
      positiveMoments: Array.isArray(positiveMoments)
        ? positiveMoments.map(sanitizeText).filter(Boolean)
        : [],
      prompt: prompt ? sanitizeText(prompt) : '',
      tags: Array.isArray(tags) && tags.length > 0 ? tags : ['Personal'],
      entryDate: dateVal,
    });

    res.status(201).json({
      success: true,
      message: 'Journal entry saved beautifully. 📖',
      data: newJournal,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get journal entries with search, filter, sort & pagination
 * @route   GET /api/journals
 * @access  Private
 */
const getJournals = async (req, res, next) => {
  try {
    const { search, tag, startDate, endDate, sort = 'newest', page = 1, limit = 10 } = req.query;

    const query = { userId: req.user.id };

    // Text search in title and content
    if (search && search.trim()) {
      const searchTerm = search.trim();
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Tag filter
    if (tag && tag !== 'All') {
      query.tags = tag;
    }

    // Date range filter
    if (startDate || endDate) {
      query.entryDate = {};
      if (startDate) query.entryDate.$gte = startDate;
      if (endDate) query.entryDate.$lte = endDate;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const sortOrder = sort === 'oldest' ? { entryDate: 1, createdAt: 1 } : { entryDate: -1, createdAt: -1 };

    const [entries, totalCount] = await Promise.all([
      Journal.find(query).sort(sortOrder).skip(skip).limit(limitNum),
      Journal.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: entries,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalRecords: totalCount,
        hasMore: pageNum * limitNum < totalCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single journal entry by ID
 * @route   GET /api/journals/:id
 * @access  Private
 */
const getJournalById = async (req, res, next) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, userId: req.user.id });
    if (!journal) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found.',
      });
    }

    // Look for matching mood entry on the same date
    const matchingMood = await Mood.findOne({ userId: req.user.id, date: journal.entryDate });

    res.status(200).json({
      success: true,
      data: {
        ...journal.toObject(),
        mood: matchingMood || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get journal entry by date (used by calendar view)
 * @route   GET /api/journals/date/:date
 * @access  Private
 */
const getJournalByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const entries = await Journal.find({ userId: req.user.id, entryDate: date }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a journal entry
 * @route   PATCH /api/journals/:id
 * @access  Private
 */
const updateJournal = async (req, res, next) => {
  try {
    const { title, content, gratitudeNotes, positiveMoments, prompt, tags, entryDate } = req.body;

    const entry = await Journal.findOne({ _id: req.params.id, userId: req.user.id });
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found or unauthorized to edit.',
      });
    }

    if (title && title.trim()) entry.title = sanitizeText(title);
    if (content && content.trim()) entry.content = sanitizeText(content);
    if (Array.isArray(gratitudeNotes)) {
      entry.gratitudeNotes = gratitudeNotes.map(sanitizeText).filter(Boolean);
    }
    if (Array.isArray(positiveMoments)) {
      entry.positiveMoments = positiveMoments.map(sanitizeText).filter(Boolean);
    }
    if (typeof prompt === 'string') entry.prompt = sanitizeText(prompt);
    if (Array.isArray(tags)) entry.tags = tags;
    if (entryDate && isValidDateString(entryDate)) entry.entryDate = entryDate;

    await entry.save();

    res.status(200).json({
      success: true,
      message: 'Journal entry updated successfully.',
      data: entry,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a journal entry
 * @route   DELETE /api/journals/:id
 * @access  Private
 */
const deleteJournal = async (req, res, next) => {
  try {
    const entry = await Journal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Journal entry not found or already deleted.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Journal entry deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJournal,
  getJournals,
  getJournalById,
  getJournalByDate,
  updateJournal,
  deleteJournal,
};
