const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    date: {
      type: String, // 'YYYY-MM-DD'
      required: [true, 'Date is required in YYYY-MM-DD format'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'],
    },
    sleepHours: {
      type: Number,
      default: 0,
      min: [0, 'Sleep hours cannot be negative'],
      max: [24, 'Sleep hours cannot exceed 24 hours in a day'],
    },
    waterGlasses: {
      type: Number,
      default: 0,
      min: [0, 'Water intake cannot be negative'],
      max: [40, 'Water intake cannot exceed 40 glasses'],
    },
    exerciseMinutes: {
      type: Number,
      default: 0,
      min: [0, 'Exercise minutes cannot be negative'],
      max: [600, 'Exercise minutes cannot exceed 600 minutes'],
    },
    meditationMinutes: {
      type: Number,
      default: 0,
      min: [0, 'Meditation minutes cannot be negative'],
      max: [360, 'Meditation minutes cannot exceed 360 minutes'],
    },
    customGoals: [
      {
        title: {
          type: String,
          trim: true,
          required: true,
          maxlength: 100,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring one habit record per user per day
HabitSchema.index({ userId: 1, date: 1 }, { unique: true });
HabitSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Habit', HabitSchema);
