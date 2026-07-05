import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { initializeDatabase } from './config/database';
import apiRoutes from './routes/api';

const getApiBaseUrl = (codespaceName = process.env.CODESPACE_NAME) => {
  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  return 'http://localhost:8000';
};

const app = express();
const port = Number(process.env.PORT) || 8000;
const baseUrl = getApiBaseUrl();

app.use(cors());
app.use(express.json());

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

app.use('/api', apiRoutes);

const startServer = async () => {
  await initializeDatabase();

  app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit backend listening on port ${port}`);
    console.log(`API base URL: ${baseUrl}`);
  });
};

startServer().catch((error) => {
  console.error('Unable to start OctoFit backend:', error);
  process.exit(1);
});
