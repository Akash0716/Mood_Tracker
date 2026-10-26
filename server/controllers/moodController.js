const Mood = require('../models/Mood');
const { getTodayString, isValidDateString, isFutureDate } = require('../utils/normalizeDate');

const MOOD_SCORES = {
  very_sad: 1,
  sad: 2,
  neutral: 3,
  happy: 4,
  very_happy: 5,
};

/**
 * @desc    Create a new mood check-in
 * @route   POST /api/moods
 * @access  Private
 */
const createMood = async (req, res, next) => {
  try {
    const { date, mood, score, emotions, notes, factors } = req.body;

    const entryDate = date || getTodayString();

    if (!isValidDateString(entryDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Expected YYYY-MM-DD.',
      });
    }

    if (isFutureDate(entryDate)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot record a mood check-in for a future date.',
      });
    }

    // Default score based on mood if not explicitly provided
    const calculatedScore = score || MOOD_SCORES[mood] || 3;

    // Check for existing record for today/date
    const existing = await Mood.findOne({ userId: req.user.id, date: entryDate });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `You have already completed your mood check-in for ${entryDate}. You can update your existing check-in instead.`,
        existingId: existing._id,
      });
    }

    const newMood = await Mood.create({
      userId: req.user.id,
      date: entryDate,
      mood,
      score: calculatedScore,
      emotions: Array.isArray(emotions) ? emotions : [],
      notes: notes ? notes.trim() : '',
      factors: Array.isArray(factors) ? factors : [],
    });

    res.status(201).json({
      success: true,
      message: 'Mood check-in recorded successfully! 🌱',
      data: newMood,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get mood records with filtering & pagination
 * @route   GET /api/moods
 * @access  Private
 */
const getMoods = async (req, res, next) => {
  try {
    const { startDate, endDate, mood, emotion, page = 1, limit = 20 } = req.query;

    const query = { userId: req.user.id };

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    // Mood filter
    if (mood) {
      query.mood = mood;
    }

    // Emotion filter
    if (emotion) {
      query.emotions = emotion;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [moods, totalCount] = await Promise.all([
      Mood.find(query).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limitNum),
      Mood.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: moods,
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
 * @desc    Get single mood check-in by ID
 * @route   GET /api/moods/:id
 * @access  Private
 */
const getMoodById = async (req, res, next) => {
  try {
    const mood = await Mood.findOne({ _id: req.params.id, userId: req.user.id });
    if (!mood) {
      return res.status(404).json({
        success: false,
        message: 'Mood record not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: mood,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a mood check-in
 * @route   PATCH /api/moods/:id
 * @access  Private
 */
const updateMood = async (req, res, next) => {
  try {
    const { mood, score, emotions, notes, factors } = req.body;

    const existingRecord = await Mood.findOne({ _id: req.params.id, userId: req.user.id });
    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: 'Mood record not found or unauthorized to edit.',
      });
    }

    if (mood) {
      existingRecord.mood = mood;
      existingRecord.score = score || MOOD_SCORES[mood] || existingRecord.score;
    } else if (score !== undefined) {
      existingRecord.score = score;
    }

    if (Array.isArray(emotions)) {
      existingRecord.emotions = emotions;
    }

    if (typeof notes === 'string') {
      existingRecord.notes = notes.trim();
    }

    if (Array.isArray(factors)) {
      existingRecord.factors = factors;
    }

    await existingRecord.save();

    res.status(200).json({
      success: true,
      message: 'Mood entry updated successfully.',
      data: existingRecord,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a mood check-in
 * @route   DELETE /api/moods/:id
 * @access  Private
 */
const deleteMood = async (req, res, next) => {
  try {
    const mood = await Mood.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!mood) {
      return res.status(404).json({
        success: false,
        message: 'Mood entry not found or already deleted.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mood entry deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get today's mood check-in for the user
 * @route   GET /api/moods/today
 * @access  Private
 */
const getTodayMood = async (req, res, next) => {
  try {
    const today = getTodayString();
    const mood = await Mood.findOne({ userId: req.user.id, date: today });

    res.status(200).json({
      success: true,
      checkedInToday: !!mood,
      data: mood || null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMood,
  getMoods,
  getMoodById,
  updateMood,
  deleteMood,
  getTodayMood,
};
