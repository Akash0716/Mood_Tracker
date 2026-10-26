const mongoose = require('mongoose');

/**
 * Global cached database connection object for serverless and persistent runtimes.
 * In serverless environments like Vercel, caching prevents exceeding MongoDB connection limits.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      '⚠️ [MindBloom Server Warning] MONGODB_URI is not defined in environment variables.\n' +
      '   Please set MONGODB_URI in your .env file or Vercel dashboard to enable database operations.'
    );
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log('🌱 [MindBloom MongoDB] Successfully connected to database:', mongooseInstance.connection.name);
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      console.error('❌ [MindBloom MongoDB] Connection error:', err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
};

module.exports = connectDB;
