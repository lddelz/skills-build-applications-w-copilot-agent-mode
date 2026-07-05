import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const db = mongoose.connection;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(connectionString, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to octofit_db');
  } catch (error) {
    console.error('Error connecting to octofit_db:', error);
    console.warn('Continuing without a database connection. API routes will return fallback responses.');
  }
};

connectToDatabase();

db.on('error', console.error.bind(console, 'connection error:'));

export const isDatabaseConnected = () => db.readyState === 1;
export default db;
