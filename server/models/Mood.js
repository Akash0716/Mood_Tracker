const mongoose = require('mongoose');

const ALLOWED_MOODS = ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'];

const ALLOWED_EMOTIONS = [
  'Calm',
  'Grateful',
  'Excited',
  'Stressed',
  'Anxious',
  'Tired',
  'Lonely',
  'Motivated',
  'Proud',
  'Overwhelmed',
  'Hopeful',
  'Content',
  'Frustrated',
  'Peaceful',
  'Restless',
  'Inspired',
];

const ALLOWED_FACTORS = [
  'Sleep',
  'Work',
  'Studies',
  'Relationships',
  'Exercise',
  'Health',
  'Family',
  'Hobbies',
  'Weather',
  'Finances',
  'Social',
  'Nutrition',
];

const MoodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    date: {
      type: String, // Normalized 'YYYY-MM-DD'
      required: [true, 'Date is required in YYYY-MM-DD format'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'],
    },
    mood: {
      type: String,
      required: [true, 'Primary mood is required'],
      enum: {
        values: ALLOWED_MOODS,
        message: '{VALUE} is not a valid mood selection',
      },
    },
    score: {
      type: Number,
      required: [true, 'Mood score is required'],
      min: [1, 'Score must be at least 1 (Very Sad)'],
      max: [5, 'Score cannot exceed 5 (Very Happy)'],
      validate: {
        validator: Number.isInteger,
        message: 'Score must be an integer between 1 and 5',
      },
    },
    emotions: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.every((item) => ALLOWED_EMOTIONS.includes(item));
        },
        message: 'One or more selected emotions are invalid',
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
      default: '',
    },
    factors: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.every((item) => ALLOWED_FACTORS.includes(item));
        },
        message: 'One or more contributing factors are invalid',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring only one mood check-in per user per day
MoodSchema.index({ userId: 1, date: 1 }, { unique: true });
MoodSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Mood', MoodSchema);
module.exports.ALLOWED_MOODS = ALLOWED_MOODS;
module.exports.ALLOWED_EMOTIONS = ALLOWED_EMOTIONS;
module.exports.ALLOWED_FACTORS = ALLOWED_FACTORS;
