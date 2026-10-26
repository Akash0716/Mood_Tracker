const User = require('../models/User');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    res.status(200).json({
      success: true,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile name
 * @route   PATCH /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long.',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name: name.trim() } },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user preferences & wellness targets
 * @route   PATCH /api/users/preferences
 * @access  Private
 */
const updatePreferences = async (req, res, next) => {
  try {
    const { theme, dailyReminder, wellnessGoals } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (theme && ['light', 'dark', 'system'].includes(theme)) {
      user.preferences.theme = theme;
    }

    if (typeof dailyReminder === 'boolean') {
      user.preferences.dailyReminder = dailyReminder;
    }

    if (wellnessGoals) {
      if (typeof wellnessGoals.sleepHours === 'number') {
        user.preferences.wellnessGoals.sleepHours = Math.max(1, Math.min(24, wellnessGoals.sleepHours));
      }
      if (typeof wellnessGoals.waterGlasses === 'number') {
        user.preferences.wellnessGoals.waterGlasses = Math.max(1, Math.min(30, wellnessGoals.waterGlasses));
      }
      if (typeof wellnessGoals.exerciseMinutes === 'number') {
        user.preferences.wellnessGoals.exerciseMinutes = Math.max(0, Math.min(360, wellnessGoals.exerciseMinutes));
      }
      if (typeof wellnessGoals.meditationMinutes === 'number') {
        user.preferences.wellnessGoals.meditationMinutes = Math.max(0, Math.min(240, wellnessGoals.meditationMinutes));
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully.',
      preferences: user.preferences,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePreferences,
};
