"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const database_1 = require("./config/database");
const api_1 = __importDefault(require("./routes/api"));
const getApiBaseUrl = (codespaceName = process.env.CODESPACE_NAME) => {
    if (codespaceName) {
        return `https://${codespaceName}-8000.app.github.dev`;
    }
    return 'http://localhost:8000';
};
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 8000;
const baseUrl = getApiBaseUrl();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'OctoFit backend is running',
        apiBaseUrl: baseUrl,
        endpoints: ['/api/health', '/api/users/', '/api/teams/', '/api/activities/', '/api/leaderboard/', '/api/workouts/'],
    });
});
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', apiBaseUrl: baseUrl });
});
app.use('/api', api_1.default);
const startServer = async () => {
    await (0, database_1.initializeDatabase)();
    app.listen(port, '0.0.0.0', () => {
        console.log(`OctoFit backend listening on port ${port}`);
        console.log(`API base URL: ${baseUrl}`);
    });
};
startServer().catch((error) => {
    console.error('Unable to start OctoFit backend:', error);
    process.exit(1);
});
