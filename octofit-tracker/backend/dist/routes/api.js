"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
const sendFallbackResponse = (res, payload = []) => {
    res.json(payload);
};
router.get(['/users', '/users/'], async (_req, res) => {
    if (!(0, database_1.isDatabaseConnected)()) {
        sendFallbackResponse(res, []);
        return;
    }
    try {
        const users = await models_1.User.find().lean();
        res.json(users);
    }
    catch (error) {
        console.error('Unable to load users:', error);
        sendFallbackResponse(res, []);
    }
});
router.post(['/users', '/users/'], async (req, res) => {
    if (!(0, database_1.isDatabaseConnected)()) {
        res.status(503).json({ error: 'Database unavailable' });
        return;
    }
    try {
        const user = await models_1.User.create(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        console.error('Unable to create user:', error);
        res.status(500).json({ error: 'Unable to create user' });
    }
});
router.get(['/teams', '/teams/'], async (_req, res) => {
    if (!(0, database_1.isDatabaseConnected)()) {
        sendFallbackResponse(res, []);
        return;
    }
    try {
        const teams = await models_1.Team.find().populate('members').populate('captain').lean();
        res.json(teams);
    }
    catch (error) {
        console.error('Unable to load teams:', error);
        sendFallbackResponse(res, []);
    }
});
router.post(['/teams', '/teams/'], async (req, res) => {
    if (!(0, database_1.isDatabaseConnected)()) {
        res.status(503).json({ error: 'Database unavailable' });
        return;
    }
    try {
        const team = await models_1.Team.create(req.body);
        res.status(201).json(team);
    }
    catch (error) {
        console.error('Unable to create team:', error);
        res.status(500).json({ error: 'Unable to create team' });
    }
});
router.get(['/activities', '/activities/'], async (_req, res) => {
    if (!(0, database_1.isDatabaseConnected)()) {
        sendFallbackResponse(res, []);
        return;
    }
    try {
        const activities = await models_1.Activity.find().populate('user').lean();
        res.json(activities);
    }
    catch (error) {
        console.error('Unable to load activities:', error);
        sendFallbackResponse(res, []);
    }
});
router.post(['/activities', '/activities/'], async (req, res) => {
    if (!(0, database_1.isDatabaseConnected)()) {
        res.status(503).json({ error: 'Database unavailable' });
        return;
    }
    try {
        const activity = await models_1.Activity.create(req.body);
        res.status(201).json(activity);
    }
    catch (error) {
        console.error('Unable to create activity:', error);
        res.status(500).json({ error: 'Unable to create activity' });
    }
});
router.get(['/leaderboard', '/leaderboard/'], async (_req, res) => {
    if (!(0, database_1.isDatabaseConnected)()) {
        sendFallbackResponse(res, []);
        return;
    }
    try {
        const leaderboard = await models_1.LeaderboardEntry.find().populate('user').sort({ rank: 1 }).lean();
        res.json(leaderboard);
    }
    catch (error) {
        console.error('Unable to load leaderboard:', error);
        sendFallbackResponse(res, []);
    }
});
router.post(['/leaderboard', '/leaderboard/'], async (req, res) => {
    if (!(0, database_1.isDatabaseConnected)()) {
        res.status(503).json({ error: 'Database unavailable' });
        return;
    }
    try {
        const entry = await models_1.LeaderboardEntry.create(req.body);
        res.status(201).json(entry);
    }
    catch (error) {
        console.error('Unable to create leaderboard entry:', error);
        res.status(500).json({ error: 'Unable to create leaderboard entry' });
    }
});
router.get(['/workouts', '/workouts/'], async (_req, res) => {
    if (!(0, database_1.isDatabaseConnected)()) {
        sendFallbackResponse(res, []);
        return;
    }
    try {
        const workouts = await models_1.Workout.find().lean();
        res.json(workouts);
    }
    catch (error) {
        console.error('Unable to load workouts:', error);
        sendFallbackResponse(res, []);
    }
});
router.post(['/workouts', '/workouts/'], async (req, res) => {
    if (!(0, database_1.isDatabaseConnected)()) {
        res.status(503).json({ error: 'Database unavailable' });
        return;
    }
    try {
        const workout = await models_1.Workout.create(req.body);
        res.status(201).json(workout);
    }
    catch (error) {
        console.error('Unable to create workout:', error);
        res.status(500).json({ error: 'Unable to create workout' });
    }
});
exports.default = router;
