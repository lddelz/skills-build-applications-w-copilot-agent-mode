import { Router } from 'express';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

const router = Router();

router.get(['/users', '/users/'], async (_req, res) => {
  const users = await User.find().lean();
  res.json(users);
});

router.post(['/users', '/users/'], async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

router.get(['/teams', '/teams/'], async (_req, res) => {
  const teams = await Team.find().populate('members').populate('captain').lean();
  res.json(teams);
});

router.post(['/teams', '/teams/'], async (req, res) => {
  const team = await Team.create(req.body);
  res.status(201).json(team);
});

router.get(['/activities', '/activities/'], async (_req, res) => {
  const activities = await Activity.find().populate('user').lean();
  res.json(activities);
});

router.post(['/activities', '/activities/'], async (req, res) => {
  const activity = await Activity.create(req.body);
  res.status(201).json(activity);
});

router.get(['/leaderboard', '/leaderboard/'], async (_req, res) => {
  const leaderboard = await LeaderboardEntry.find().populate('user').sort({ rank: 1 }).lean();
  res.json(leaderboard);
});

router.post(['/leaderboard', '/leaderboard/'], async (req, res) => {
  const entry = await LeaderboardEntry.create(req.body);
  res.status(201).json(entry);
});

router.get(['/workouts', '/workouts/'], async (_req, res) => {
  const workouts = await Workout.find().lean();
  res.json(workouts);
});

router.post(['/workouts', '/workouts/'], async (req, res) => {
  const workout = await Workout.create(req.body);
  res.status(201).json(workout);
});

export default router;
