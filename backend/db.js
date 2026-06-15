// Mongoose connection. Defaults to local MongoDB; override with MONGODB_URI env var.
const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb://localhost:27017/mern-simple';

async function connectDB() {
  const uri = process.env.MONGODB_URI || DEFAULT_URI;
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(uri);
    console.log(`[mongo] connected to ${uri}`);
  } catch (err) {
    console.error('[mongo] connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB, mongoose };
