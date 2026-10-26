const path = require('path');
const dotenv = require('dotenv');

// Load environment variables for local testing of serverless handler
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../server/.env') });

const app = require('../server/app');

module.exports = app;
