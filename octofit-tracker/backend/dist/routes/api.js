"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const router = (0, express_1.Router)();
router.get(['/users', '/users/'], async (_req, res) => {
    const users = await models_1.User.find().lean();
    res.json(users);
});
router.post(['/users', '/users/'], async (req, res) => {
    const user = await models_1.User.create(req.body);
    res.status(201).json(user);
});
router.get(['/teams', '/teams/'], async (_req, res) => {
    const teams = await models_1.Team.find().populate('members').populate('captain').lean();
    res.json(teams);
});
router.post(['/teams', '/teams/'], async (req, res) => {
    const team = await models_1.Team.create(req.body);
    res.status(201).json(team);
});
router.get(['/activities', '/activities/'], async (_req, res) => {
    const activities = await models_1.Activity.find().populate('user').lean();
    res.json(activities);
});
router.post(['/activities', '/activities/'], async (req, res) => {
    const activity = await models_1.Activity.create(req.body);
    res.status(201).json(activity);
});
router.get(['/leaderboard', '/leaderboard/'], async (_req, res) => {
    const leaderboard = await models_1.LeaderboardEntry.find().populate('user').sort({ rank: 1 }).lean();
    res.json(leaderboard);
});
router.post(['/leaderboard', '/leaderboard/'], async (req, res) => {
    const entry = await models_1.LeaderboardEntry.create(req.body);
    res.status(201).json(entry);
});
router.get(['/workouts', '/workouts/'], async (_req, res) => {
    const workouts = await models_1.Workout.find().lean();
    res.json(workouts);
});
router.post(['/workouts', '/workouts/'], async (req, res) => {
    const workout = await models_1.Workout.create(req.body);
    res.status(201).json(workout);
});
exports.default = router;
