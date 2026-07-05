import { Router } from 'express';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';
import { fallbackData, isDatabaseConnected } from '../config/database';

const router = Router();

const sendFallbackResponse = (res: any, payload: unknown = []) => {
  res.json(payload);
};

const getFallbackPayload = (resource: 'users' | 'teams' | 'activities' | 'leaderboard' | 'workouts') => {
  switch (resource) {
    case 'teams':
      return fallbackData.teams;
    case 'activities':
      return fallbackData.activities;
    case 'leaderboard':
      return fallbackData.leaderboard;
    case 'workouts':
      return fallbackData.workouts;
    case 'users':
    default:
      return fallbackData.users;
  }
};

router.get(['/users', '/users/'], async (_req, res) => {
  if (!isDatabaseConnected()) {
    sendFallbackResponse(res, getFallbackPayload('users'));
    return;
  }

  try {
    const users = await User.find().lean();
    res.json(users);
  } catch (error) {
    console.error('Unable to load users:', error);
    sendFallbackResponse(res, []);
  }
});

router.post(['/users', '/users/'], async (req, res) => {
  if (!isDatabaseConnected()) {
    res.status(503).json({ error: 'Database unavailable' });
    return;
  }

  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Unable to create user:', error);
    res.status(500).json({ error: 'Unable to create user' });
  }
});

router.get(['/teams', '/teams/'], async (_req, res) => {
  if (!isDatabaseConnected()) {
    sendFallbackResponse(res, getFallbackPayload('teams'));
    return;
  }

  try {
    const teams = await Team.find().populate('members').populate('captain').lean();
    res.json(teams);
  } catch (error) {
    console.error('Unable to load teams:', error);
    sendFallbackResponse(res, []);
  }
});

router.post(['/teams', '/teams/'], async (req, res) => {
  if (!isDatabaseConnected()) {
    res.status(503).json({ error: 'Database unavailable' });
    return;
  }

  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (error) {
    console.error('Unable to create team:', error);
    res.status(500).json({ error: 'Unable to create team' });
  }
});

router.get(['/activities', '/activities/'], async (_req, res) => {
  if (!isDatabaseConnected()) {
    sendFallbackResponse(res, getFallbackPayload('activities'));
    return;
  }

  try {
    const activities = await Activity.find().populate('user').lean();
    res.json(activities);
  } catch (error) {
    console.error('Unable to load activities:', error);
    sendFallbackResponse(res, []);
  }
});

router.post(['/activities', '/activities/'], async (req, res) => {
  if (!isDatabaseConnected()) {
    res.status(503).json({ error: 'Database unavailable' });
    return;
  }

  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (error) {
    console.error('Unable to create activity:', error);
    res.status(500).json({ error: 'Unable to create activity' });
  }
});

router.get(['/leaderboard', '/leaderboard/'], async (_req, res) => {
  if (!isDatabaseConnected()) {
    sendFallbackResponse(res, getFallbackPayload('leaderboard'));
    return;
  }

  try {
    const leaderboard = await LeaderboardEntry.find().populate('user').sort({ rank: 1 }).lean();
    res.json(leaderboard);
  } catch (error) {
    console.error('Unable to load leaderboard:', error);
    sendFallbackResponse(res, []);
  }
});

router.post(['/leaderboard', '/leaderboard/'], async (req, res) => {
  if (!isDatabaseConnected()) {
    res.status(503).json({ error: 'Database unavailable' });
    return;
  }

  try {
    const entry = await LeaderboardEntry.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    console.error('Unable to create leaderboard entry:', error);
    res.status(500).json({ error: 'Unable to create leaderboard entry' });
  }
});

router.get(['/workouts', '/workouts/'], async (_req, res) => {
  if (!isDatabaseConnected()) {
    sendFallbackResponse(res, getFallbackPayload('workouts'));
    return;
  }

  try {
    const workouts = await Workout.find().lean();
    res.json(workouts);
  } catch (error) {
    console.error('Unable to load workouts:', error);
    sendFallbackResponse(res, []);
  }
});

router.post(['/workouts', '/workouts/'], async (req, res) => {
  if (!isDatabaseConnected()) {
    res.status(503).json({ error: 'Database unavailable' });
    return;
  }

  try {
    const workout = await Workout.create(req.body);
    res.status(201).json(workout);
  } catch (error) {
    console.error('Unable to create workout:', error);
    res.status(500).json({ error: 'Unable to create workout' });
  }
});

export default router;
