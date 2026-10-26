const mongoose = require('mongoose');

const ALLOWED_JOURNAL_TAGS = [
  'Personal',
  'College',
  'Work',
  'Family',
  'Health',
  'Gratitude',
  'Mindfulness',
  'Goals',
  'Reflection',
  'Travel',
  'Relationships',
];

const JournalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an entry title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Journal entry content cannot be empty'],
      trim: true,
      maxlength: [15000, 'Content cannot exceed 15000 characters'],
    },
    gratitudeNotes: {
      type: [String],
      default: [],
    },
    positiveMoments: {
      type: [String],
      default: [],
    },
    prompt: {
      type: String,
      trim: true,
      default: '',
    },
    tags: {
      type: [String],
      default: ['Personal'],
      validate: {
        validator: function (tags) {
          return tags.every((tag) => ALLOWED_JOURNAL_TAGS.includes(tag) || tag.length <= 30);
        },
        message: 'Invalid tag provided',
      },
    },
    entryDate: {
      type: String, // 'YYYY-MM-DD'
      required: [true, 'Entry date is required in YYYY-MM-DD format'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for sorting and full-text search
JournalSchema.index({ userId: 1, entryDate: -1, createdAt: -1 });
JournalSchema.index({ userId: 1, tags: 1 });
JournalSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Journal', JournalSchema);
module.exports.ALLOWED_JOURNAL_TAGS = ALLOWED_JOURNAL_TAGS;
