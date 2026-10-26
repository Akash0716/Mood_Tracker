const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const moodRoutes = require('./routes/moodRoutes');
const journalRoutes = require('./routes/journalRoutes');
const habitRoutes = require('./routes/habitRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const healthRoutes = require('./routes/healthRoutes');

const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible CDN font/script loading if needed
    crossOriginEmbedderPolicy: false,
  })
);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// CORS configuration supporting credentials (cookies & headers)
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Cross-Origin Request Blocked by MindBloom CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// Serverless DB connection hook
app.use(async (req, res, next) => {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('Database connection middleware failed:', error.message);
    next();
  }
});

// Mount API routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/analytics', analyticsRoutes);

// Base API info
app.get('/api', (req, res) => {
  res.json({
    service: 'MindBloom — Mood Tracker & Wellness Journal API',
    version: '1.0.0',
    documentation: '/README.md',
    status: 'Operational',
  });
});

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
