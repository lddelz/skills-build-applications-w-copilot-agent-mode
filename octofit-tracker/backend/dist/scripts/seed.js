"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await mongoose_1.default.connect(connectionString);
        console.log('Connected to octofit_db');
        await Promise.all([
            models_1.User.deleteMany({}),
            models_1.Team.deleteMany({}),
            models_1.Activity.deleteMany({}),
            models_1.LeaderboardEntry.deleteMany({}),
            models_1.Workout.deleteMany({}),
        ]);
        const users = await models_1.User.insertMany([
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
        const teams = await models_1.Team.insertMany([
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
        await models_1.Activity.insertMany([
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
        await models_1.LeaderboardEntry.insertMany([
            { user: users[0]._id, points: 1320, rank: 1 },
            { user: users[1]._id, points: 1180, rank: 2 },
            { user: users[2]._id, points: 1040, rank: 3 },
        ]);
        await models_1.Workout.insertMany([
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
        console.log('Database seeding complete');
        console.log(`Seeded ${users.length} users, ${teams.length} teams, activities, leaderboard entries, and workouts.`);
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
