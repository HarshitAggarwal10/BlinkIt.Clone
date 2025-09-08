const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  SESSION_SECRET: process.env.SESSION_SECRET,
  PORT: process.env.PORT || 5000,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
};
