const Habit = require('../models/Habit');
const User = require('../models/User');
const { getTodayString, isValidDateString } = require('../utils/normalizeDate');

/**
 * @desc    Log or update daily wellness habits
 * @route   POST /api/habits
 * @access  Private
 */
const saveHabit = async (req, res, next) => {
  try {
    const {
      date,
      sleepHours = 0,
      waterGlasses = 0,
      exerciseMinutes = 0,
      meditationMinutes = 0,
      customGoals = [],
      notes = '',
    } = req.body;

    const habitDate = date && isValidDateString(date) ? date : getTodayString();

    // Sanitize values
    const safeSleep = Math.max(0, Math.min(24, parseFloat(sleepHours) || 0));
    const safeWater = Math.max(0, Math.min(40, parseInt(waterGlasses, 10) || 0));
    const safeExercise = Math.max(0, Math.min(600, parseInt(exerciseMinutes, 10) || 0));
    const safeMeditation = Math.max(0, Math.min(360, parseInt(meditationMinutes, 10) || 0));

    const updatedHabit = await Habit.findOneAndUpdate(
      { userId: req.user.id, date: habitDate },
      {
        $set: {
          sleepHours: safeSleep,
          waterGlasses: safeWater,
          exerciseMinutes: safeExercise,
          meditationMinutes: safeMeditation,
          customGoals: Array.isArray(customGoals) ? customGoals : [],
          notes: typeof notes === 'string' ? notes.trim() : '',
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Daily wellness habits saved successfully! 💧',
      data: updatedHabit,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get habit records with date filtering
 * @route   GET /api/habits
 * @access  Private
 */
const getHabits = async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 30, page = 1 } = req.query;

    const query = { userId: req.user.id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(90, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [habits, totalCount] = await Promise.all([
      Habit.find(query).sort({ date: -1 }).skip(skip).limit(limitNum),
      Habit.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: habits,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalRecords: totalCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get today's habit record and user targets
 * @route   GET /api/habits/today
 * @access  Private
 */
const getTodayHabit = async (req, res, next) => {
  try {
    const today = getTodayString();
    const [habit, user] = await Promise.all([
      Habit.findOne({ userId: req.user.id, date: today }),
      User.findById(req.user.id),
    ]);

    const targets = user?.preferences?.wellnessGoals || {
      sleepHours: 8,
      waterGlasses: 8,
      exerciseMinutes: 30,
      meditationMinutes: 15,
    };

    res.status(200).json({
      success: true,
      date: today,
      data: habit || null,
      targets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a habit entry
 * @route   DELETE /api/habits/:id
 * @access  Private
 */
const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!habit) {
      return res.status(404).json({
        success: false,
        message: 'Habit record not found or already deleted.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Habit entry deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveHabit,
  getHabits,
  getTodayHabit,
  deleteHabit,
};
