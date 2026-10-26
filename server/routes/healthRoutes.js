const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

/**
 * @desc    Health check endpoint reporting API status and database connectivity
 * @route   GET /api/health
 * @access  Public
 */
router.get('/', (req, res) => {
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbState = mongoose.connection.readyState;
  const isDbConnected = dbState === 1;

  res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? 'healthy' : 'degraded',
    service: 'MindBloom API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      connected: isDbConnected,
      state: dbStatusMap[dbState] || 'unknown',
    },
  });
});

module.exports = router;
