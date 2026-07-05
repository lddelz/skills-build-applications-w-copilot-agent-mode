import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const db = mongoose.connection;

const seedDefaultData = async () => {
  try {
    const counts = await Promise.all([
      User.countDocuments(),
      Team.countDocuments(),
      Activity.countDocuments(),
      LeaderboardEntry.countDocuments(),
      Workout.countDocuments(),
    ]);

    const hasExistingData = counts.some((count) => count > 0);
    if (hasExistingData) {
      return;
    }

    const users = await User.insertMany([
      {
        name: 'Ava Chen',
        email: 'ava.chen@octofit.app',
        role: 'Admin',
        fitnessLevel: 'Advanced',
      },
      {
        name: 'Liam Ortiz',
        email: 'liam.ortiz@octofit.app',
        role: 'Athlete',
        fitnessLevel: 'Intermediate',
      },
      {
        name: 'Mina Patel',
        email: 'mina.patel@octofit.app',
        role: 'Coach',
        fitnessLevel: 'Advanced',
      },
    ]);

    await Team.insertMany([
      {
        name: 'Velocity',
        sport: 'Cycling',
        members: [users[0]._id, users[1]._id],
        captain: users[0]._id,
      },
      {
        name: 'Summit',
        sport: 'Running',
        members: [users[2]._id],
        captain: users[2]._id,
      },
    ]);

    await Activity.insertMany([
      {
        type: 'Run',
        duration: 35,
        date: new Date('2026-07-05'),
        calories: 420,
        user: users[0]._id,
      },
      {
        type: 'Cycling',
        duration: 45,
        date: new Date('2026-07-04'),
        calories: 500,
        user: users[1]._id,
      },
      {
        type: 'Strength',
        duration: 30,
        date: new Date('2026-07-03'),
        calories: 280,
        user: users[2]._id,
      },
    ]);

    await LeaderboardEntry.insertMany([
      { user: users[0]._id, points: 1320, rank: 1 },
      { user: users[1]._id, points: 1180, rank: 2 },
      { user: users[2]._id, points: 1040, rank: 3 },
    ]);

    await Workout.insertMany([
      {
        name: 'HIIT Cardio',
        difficulty: 'Intermediate',
        duration: 25,
        focus: 'Endurance',
      },
      {
        name: 'Core Strength',
        difficulty: 'Beginner',
        duration: 20,
        focus: 'Mobility',
      },
      {
        name: 'Tempo Run',
        difficulty: 'Advanced',
        duration: 40,
        focus: 'Speed',
      },
    ]);

    console.log('Seeded default OctoFit data');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

export const connectToDatabase = async () => {
  if (db.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(connectionString, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to octofit_db');
  } catch (error) {
    console.error('Error connecting to octofit_db:', error);
    throw error;
  }
};

export const initializeDatabase = async () => {
  await connectToDatabase();
  await seedDefaultData();
};

db.on('error', console.error.bind(console, 'connection error:'));

export const isDatabaseConnected = () => db.readyState === 1;
export default db;
