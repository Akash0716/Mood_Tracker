const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file (check server/.env or root/.env)
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`✨ MindBloom API Server running at: http://localhost:${PORT}`);
    console.log(`🩺 Health check endpoint:        http://localhost:${PORT}/api/health`);
    console.log(`🌱 Environment:                   ${process.env.NODE_ENV || 'development'}`);
    console.log(`======================================================\n`);

    // Initiate MongoDB connection in background
    connectDB()
      .then(() => {
        console.log('🌸 [MindBloom] Database is connected and ready to serve requests.');
      })
      .catch((err) => {
        console.warn('⚠️ [MindBloom] Background DB connection attempt failed:', err.message);
        console.warn('   Will automatically retry when API requests arrive.');
      });
  });

  server.on('error', (err) => {
    console.error('Server error:', err.message);
  });
};

startServer();
