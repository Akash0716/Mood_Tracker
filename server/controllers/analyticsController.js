const Mood = require('../models/Mood');
const Journal = require('../models/Journal');
const Habit = require('../models/Habit');
const User = require('../models/User');
const { getTodayString, calculateStreak, formatDateString } = require('../utils/normalizeDate');
const { generateReflections, REFLECTION_PROMPTS } = require('../utils/reflectionRules');

const MOOD_META = {
  very_sad: { label: 'Very Sad', emoji: '😢', score: 1, color: '#ef4444' },
  sad: { label: 'Sad', emoji: '😔', score: 2, color: '#f97316' },
  neutral: { label: 'Neutral', emoji: '😐', score: 3, color: '#eab308' },
  happy: { label: 'Happy', emoji: '🙂', score: 4, color: '#10b981' },
  very_happy: { label: 'Very Happy', emoji: '✨', score: 5, color: '#8b5cf6' },
};

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Helper to compute date filter query based on timeframe
 */
function getDateFilterForTimeframe(timeframe = '30d') {
  if (timeframe === 'all') return null;

  const days = timeframe === '7d' ? 7 : timeframe === '90d' ? 90 : 30;
  const d = new Date();
  d.setDate(d.getDate() - (days - 1));
  return formatDateString(d);
}

/**
 * @desc    Get dashboard summary metrics and statistics
 * @route   GET /api/analytics/summary
 * @access  Private
 */
const getSummary = async (req, res, next) => {
  try {
    const { timeframe = '30d' } = req.query;
    const userId = req.user.id;
    const today = getTodayString();
    const startDate = getDateFilterForTimeframe(timeframe);

    const moodDateQuery = { userId };
    if (startDate) {
      moodDateQuery.date = { $gte: startDate };
    }

    // Parallel fetch of user data
    const [
      user,
      allUserMoodDates,
      filteredMoods,
      todayMood,
      journalCount,
      recentJournals,
      recentHabits,
    ] = await Promise.all([
      User.findById(userId),
      Mood.find({ userId }).select('date').sort({ date: -1 }),
      Mood.find(moodDateQuery).sort({ date: 1 }),
      Mood.findOne({ userId, date: today }),
      Journal.countDocuments({ userId }),
      Journal.find({ userId }).sort({ entryDate: -1, createdAt: -1 }).limit(3),
      Habit.find({ userId }).sort({ date: -1 }).limit(14),
    ]);

    // Calculate streak
    const moodDates = allUserMoodDates.map((m) => m.date);
    const streakDays = calculateStreak(moodDates);

    // Calculate average score for the selected timeframe
    const totalEntriesInTimeframe = filteredMoods.length;
    let averageMoodScore = 0;
    if (totalEntriesInTimeframe > 0) {
      const sum = filteredMoods.reduce((acc, curr) => acc + curr.score, 0);
      averageMoodScore = parseFloat((sum / totalEntriesInTimeframe).toFixed(1));
    }

    // Calculate habit completion rate for today/recent
    const todayHabit = recentHabits.find((h) => h.date === today);
    const goals = user?.preferences?.wellnessGoals || {
      sleepHours: 8,
      waterGlasses: 8,
      exerciseMinutes: 30,
      meditationMinutes: 15,
    };

    let habitCompletionRate = 0;
    if (todayHabit) {
      let completedCount = 0;
      if (todayHabit.sleepHours >= goals.sleepHours) completedCount++;
      if (todayHabit.waterGlasses >= goals.waterGlasses) completedCount++;
      if (todayHabit.exerciseMinutes >= goals.exerciseMinutes) completedCount++;
      if (todayHabit.meditationMinutes >= goals.meditationMinutes) completedCount++;
      habitCompletionRate = Math.round((completedCount / 4) * 100);
    }

    // Rule-based reflections
    const reflections = generateReflections(filteredMoods.slice(-7), recentHabits);

    res.status(200).json({
      success: true,
      data: {
        userName: user ? user.name : req.user.name,
        todayDate: today,
        checkedInToday: !!todayMood,
        todayMood: todayMood || null,
        streakDays,
        totalMoodEntries: allUserMoodDates.length,
        timeframeEntries: totalEntriesInTimeframe,
        averageMoodScore,
        totalJournals: journalCount,
        habitCompletionRate,
        todayHabit: todayHabit || null,
        wellnessGoals: goals,
        recentJournals,
        recentMoods: filteredMoods.slice(-7),
        reflections,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get mood trend series for line/area chart
 * @route   GET /api/analytics/mood-trends
 * @access  Private
 */
const getMoodTrends = async (req, res, next) => {
  try {
    const { timeframe = '30d' } = req.query;
    const startDate = getDateFilterForTimeframe(timeframe);

    const query = { userId: req.user.id };
    if (startDate) {
      query.date = { $gte: startDate };
    }

    const moods = await Mood.find(query).sort({ date: 1 });

    const trendData = moods.map((m) => {
      const meta = MOOD_META[m.mood] || { label: 'Neutral', emoji: '😐', score: 3 };
      return {
        id: m._id,
        date: m.date,
        displayDate: m.date.slice(5), // 'MM-DD'
        score: m.score,
        mood: m.mood,
        label: meta.label,
        emoji: meta.emoji,
        emotions: m.emotions,
        factors: m.factors,
      };
    });

    res.status(200).json({
      success: true,
      data: trendData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get mood distribution and top emotions/factors
 * @route   GET /api/analytics/mood-distribution
 * @access  Private
 */
const getMoodDistribution = async (req, res, next) => {
  try {
    const { timeframe = '30d' } = req.query;
    const startDate = getDateFilterForTimeframe(timeframe);

    const query = { userId: req.user.id };
    if (startDate) {
      query.date = { $gte: startDate };
    }

    const moods = await Mood.find(query);

    // Distribution of primary moods
    const counts = {
      very_sad: 0,
      sad: 0,
      neutral: 0,
      happy: 0,
      very_happy: 0,
    };

    const emotionCounts = {};
    const factorCounts = {};

    moods.forEach((m) => {
      if (counts[m.mood] !== undefined) {
        counts[m.mood]++;
      }
      (m.emotions || []).forEach((e) => {
        emotionCounts[e] = (emotionCounts[e] || 0) + 1;
      });
      (m.factors || []).forEach((f) => {
        factorCounts[f] = (factorCounts[f] || 0) + 1;
      });
    });

    const pieData = Object.keys(counts).map((key) => {
      const meta = MOOD_META[key];
      return {
        name: meta.label,
        moodKey: key,
        emoji: meta.emoji,
        count: counts[key],
        color: meta.color,
      };
    });

    const topEmotions = Object.entries(emotionCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const topFactors = Object.entries(factorCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    res.status(200).json({
      success: true,
      totalCount: moods.length,
      distribution: pieData,
      topEmotions,
      topFactors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get average mood grouped by weekday
 * @route   GET /api/analytics/weekday-averages
 * @access  Private
 */
const getWeekdayAverages = async (req, res, next) => {
  try {
    const moods = await Mood.find({ userId: req.user.id });

    const weekdayBuckets = Array(7).fill(null).map((_, i) => ({
      dayIndex: i,
      day: WEEKDAY_NAMES[i],
      totalScore: 0,
      count: 0,
      average: 0,
    }));

    moods.forEach((m) => {
      const [year, month, day] = m.date.split('-').map(Number);
      const d = new Date(year, month - 1, day);
      const dayOfWeek = d.getDay(); // 0 = Sun, 6 = Sat
      weekdayBuckets[dayOfWeek].totalScore += m.score;
      weekdayBuckets[dayOfWeek].count += 1;
    });

    weekdayBuckets.forEach((bucket) => {
      bucket.average = bucket.count > 0 ? parseFloat((bucket.totalScore / bucket.count).toFixed(2)) : 0;
    });

    // Reorder Mon through Sun for natural weekly display
    const reordered = [
      weekdayBuckets[1], // Mon
      weekdayBuckets[2], // Tue
      weekdayBuckets[3], // Wed
      weekdayBuckets[4], // Thu
      weekdayBuckets[5], // Fri
      weekdayBuckets[6], // Sat
      weekdayBuckets[0], // Sun
    ];

    res.status(200).json({
      success: true,
      data: reordered,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get habit compliance progress over time
 * @route   GET /api/analytics/habit-progress
 * @access  Private
 */
const getHabitProgress = async (req, res, next) => {
  try {
    const { timeframe = '14d' } = req.query;
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 14;

    const startDate = getDateFilterForTimeframe(`${days}d`);
    const [habits, user] = await Promise.all([
      Habit.find({ userId: req.user.id, date: { $gte: startDate } }).sort({ date: 1 }),
      User.findById(req.user.id),
    ]);

    const targets = user?.preferences?.wellnessGoals || {
      sleepHours: 8,
      waterGlasses: 8,
      exerciseMinutes: 30,
      meditationMinutes: 15,
    };

    const progressData = habits.map((h) => ({
      date: h.date,
      displayDate: h.date.slice(5),
      sleepHours: h.sleepHours,
      waterGlasses: h.waterGlasses,
      exerciseMinutes: h.exerciseMinutes,
      meditationMinutes: h.meditationMinutes,
      sleepTarget: targets.sleepHours,
      waterTarget: targets.waterGlasses,
      exerciseTarget: targets.exerciseMinutes,
      meditationTarget: targets.meditationMinutes,
    }));

    res.status(200).json({
      success: true,
      targets,
      data: progressData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get curated reflection prompts
 * @route   GET /api/analytics/prompts
 * @access  Public or Private
 */
const getPrompts = async (req, res) => {
  res.status(200).json({
    success: true,
    data: REFLECTION_PROMPTS,
  });
};

module.exports = {
  getSummary,
  getMoodTrends,
  getMoodDistribution,
  getWeekdayAverages,
  getHabitProgress,
  getPrompts,
};
