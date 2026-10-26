const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const Mood = require('../models/Mood');
const Journal = require('../models/Journal');
const Habit = require('../models/Habit');
const { formatDateString } = require('./normalizeDate');

const SEED_USER = {
  name: 'Maya Lin',
  email: 'maya@mindbloom.app',
  password: 'Password123!',
};

const SAMPLE_ENTRIES = [
  {
    daysAgo: 0,
    mood: 'very_happy',
    score: 5,
    emotions: ['Grateful', 'Motivated', 'Peaceful'],
    factors: ['Exercise', 'Sleep', 'Health'],
    notes: 'Started the morning with a refreshing walk through the botanical gardens. Focused and energized all day!',
    sleep: 8.0,
    water: 9,
    exercise: 45,
    meditation: 20,
    journal: {
      title: 'A morning filled with quiet clarity',
      content: 'Woke up without an alarm feeling completely rested. The morning air had a crisp coolness that made my coffee taste even better. Spent time tending to the balcony herbs and finished reading chapter 4 of my book.',
      gratitudeNotes: ['Crisp morning air and quiet streets', 'A fulfilling phone call with an old friend', 'Fresh mint tea in the afternoon'],
      positiveMoments: ['Saw a hummingbird on the balcony', 'Cooked a warm nourishing quinoa bowl'],
      prompt: 'What made you smile or pause with appreciation today?',
      tags: ['Personal', 'Mindfulness', 'Gratitude'],
    },
  },
  {
    daysAgo: 1,
    mood: 'happy',
    score: 4,
    emotions: ['Content', 'Calm', 'Inspired'],
    factors: ['Work', 'Relationships', 'Hobbies'],
    notes: 'Good collaborative progress on our capstone presentation. Felt heard and supported by the team.',
    sleep: 7.5,
    water: 8,
    exercise: 30,
    meditation: 15,
    journal: {
      title: 'Collaborative rhythm and shared ideas',
      content: 'Group presentations used to induce so much nervousness in me. Today, I noticed a subtle shift: rather than anxiety, I felt genuinely excited to present our architecture and user research.',
      gratitudeNotes: ['Teammates who listen with genuine curiosity', 'A seamless software build without bugs', 'Evening chamomile tea'],
      positiveMoments: ['Our demo received applause from the mentors'],
      prompt: 'What was the most challenging part of your day, and how did you navigate it?',
      tags: ['College', 'Work', 'Goals'],
    },
  },
  {
    daysAgo: 2,
    mood: 'neutral',
    score: 3,
    emotions: ['Tired', 'Calm'],
    factors: ['Work', 'Sleep'],
    notes: 'A long day of research and coding. Feeling mentally exhausted but balanced.',
    sleep: 6.5,
    water: 7,
    exercise: 20,
    meditation: 10,
    journal: {
      title: 'Midweek stillness and mental recharge',
      content: 'Felt my eyelids getting heavy around 3 PM today. Acknowledging that fatigue is not failure—it is simply a biological reminder to pause.',
      gratitudeNotes: ['Comfortable reading nook', 'Comfort food prepared with care', 'Cozy wool socks'],
      positiveMoments: ['Listened to a 15-minute ambient rain track while resting'],
      prompt: 'What would help you feel more relaxed?',
      tags: ['Health', 'Reflection'],
    },
  },
  {
    daysAgo: 3,
    mood: 'sad',
    score: 2,
    emotions: ['Stressed', 'Overwhelmed', 'Tired'],
    factors: ['Studies', 'Sleep', 'Finances'],
    notes: 'Too many deadlines converging at once. Need to step back and organize tasks into smaller milestones.',
    sleep: 5.5,
    water: 5,
    exercise: 0,
    meditation: 5,
    journal: {
      title: 'Navigating overwhelm with self-compassion',
      content: 'Everything felt like high priority today. Reminded myself of the box breathing technique: inhale for 4, hold for 4, exhale for 4, hold for 4. It helped lower my heart rate and clear the mental fog.',
      gratitudeNotes: ['Deep breathing techniques that work', 'A supportive text message from family', 'Warm shower before bed'],
      positiveMoments: ['Decluttered my desk before sleeping'],
      prompt: 'What is one expectation or worry that is not serving you, which you can choose to let go of?',
      tags: ['Personal', 'Mindfulness'],
    },
  },
  {
    daysAgo: 4,
    mood: 'happy',
    score: 4,
    emotions: ['Hopeful', 'Content', 'Proud'],
    factors: ['Exercise', 'Health', 'Social'],
    notes: 'Ran 5k along the lakeside trail. The endorphins made an enormous difference!',
    sleep: 8.0,
    water: 10,
    exercise: 50,
    meditation: 15,
  },
  {
    daysAgo: 5,
    mood: 'very_happy',
    score: 5,
    emotions: ['Excited', 'Proud', 'Grateful'],
    factors: ['Work', 'Family', 'Exercise'],
    notes: 'Celebrated completing our project milestone with close friends over home-cooked pasta.',
    sleep: 8.5,
    water: 8,
    exercise: 40,
    meditation: 20,
    journal: {
      title: 'Shared laughter and good food',
      content: 'There is something deeply restorative about eating a home-cooked meal around a table with people you love. No phones, just genuine conversation and laughter.',
      gratitudeNotes: ['Home-cooked pasta with fresh basil', 'Uninterrupted laughter with friends', 'A safe and warm home'],
      positiveMoments: ['Helped my friend fix a tricky CSS flexbox layout'],
      prompt: 'What are three small or large things you feel genuinely grateful for right now?',
      tags: ['Gratitude', 'Family', 'Personal'],
    },
  },
  {
    daysAgo: 6,
    mood: 'happy',
    score: 4,
    emotions: ['Calm', 'Content'],
    factors: ['Sleep', 'Hobbies', 'Weather'],
    notes: 'Pleasant sunny afternoon spent reading in the park.',
    sleep: 7.5,
    water: 8,
    exercise: 35,
    meditation: 15,
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting MindBloom database seed...');
    await connectDB();

    // Upsert seed user
    let user = await User.findOne({ email: SEED_USER.email });
    if (!user) {
      user = await User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        passwordHash: SEED_USER.password,
        preferences: {
          theme: 'light',
          wellnessGoals: {
            sleepHours: 8,
            waterGlasses: 8,
            exerciseMinutes: 30,
            meditationMinutes: 15,
          },
        },
      });
      console.log('✅ Seed user created:', user.email);
    } else {
      console.log('ℹ️ Seed user already exists:', user.email);
    }

    // Clean existing seed records for this user
    await Mood.deleteMany({ userId: user._id });
    await Journal.deleteMany({ userId: user._id });
    await Habit.deleteMany({ userId: user._id });

    // Insert sample history across recent days
    for (const item of SAMPLE_ENTRIES) {
      const d = new Date();
      d.setDate(d.getDate() - item.daysAgo);
      const dateStr = formatDateString(d);

      // Mood record
      await Mood.create({
        userId: user._id,
        date: dateStr,
        mood: item.mood,
        score: item.score,
        emotions: item.emotions,
        factors: item.factors,
        notes: item.notes,
      });

      // Habit record
      await Habit.create({
        userId: user._id,
        date: dateStr,
        sleepHours: item.sleep,
        waterGlasses: item.water,
        exerciseMinutes: item.exercise,
        meditationMinutes: item.meditation,
        customGoals: [{ title: 'Daily evening stretch', completed: item.exercise > 20 }],
      });

      // Journal record
      if (item.journal) {
        await Journal.create({
          userId: user._id,
          title: item.journal.title,
          content: item.journal.content,
          gratitudeNotes: item.journal.gratitudeNotes,
          positiveMoments: item.journal.positiveMoments,
          prompt: item.journal.prompt,
          tags: item.journal.tags,
          entryDate: dateStr,
        });
      }
    }

    console.log(`\n🎉 Seed completed successfully!`);
    console.log(`-----------------------------------------------`);
    console.log(`Demo Account Credentials:`);
    console.log(`Email:    ${SEED_USER.email}`);
    console.log(`Password: ${SEED_USER.password}`);
    console.log(`-----------------------------------------------\n`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
