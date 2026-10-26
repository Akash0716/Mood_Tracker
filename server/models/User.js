const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'light',
      },
      dailyReminder: {
        type: Boolean,
        default: true,
      },
      wellnessGoals: {
        sleepHours: {
          type: Number,
          default: 8,
          min: [1, 'Sleep goal must be at least 1 hour'],
          max: [24, 'Sleep goal cannot exceed 24 hours'],
        },
        waterGlasses: {
          type: Number,
          default: 8,
          min: [1, 'Water goal must be at least 1 glass'],
          max: [30, 'Water goal cannot exceed 30 glasses'],
        },
        exerciseMinutes: {
          type: Number,
          default: 30,
          min: [0, 'Exercise goal cannot be negative'],
          max: [360, 'Exercise goal cannot exceed 360 minutes'],
        },
        meditationMinutes: {
          type: Number,
          default: 15,
          min: [0, 'Meditation goal cannot be negative'],
          max: [240, 'Meditation goal cannot exceed 240 minutes'],
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Compare candidate password with stored hash
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Safe JSON transformation removing sensitive fields
UserSchema.methods.toSafeObject = function () {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', UserSchema);
