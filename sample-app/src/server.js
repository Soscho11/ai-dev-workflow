import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import taskRoutes from './routes/taskRoutes.js';
import { dbQuery, isUsingMock } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*'
}));
app.use(express.json({ limit: '10kb' }));

// Health Check Endpoint (Checklist 05 Requirement)
app.get('/api/health', async (req, res) => {
  try {
    await dbQuery('SELECT 1');
    res.status(200).json({
      status: 'healthy',
      uptime: process.uptime(),
      dbConnected: true,
      mode: isUsingMock() ? 'in-memory-fallback' : 'mysql-live'
    });
  } catch (err) {
    res.status(500).json({
      status: 'degraded',
      error: 'Database connection failed'
    });
  }
});

// Mount Routes
app.use('/api/tasks', taskRoutes);

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found.` });
});

// Centralized Error Handling Middleware (AGENTS.md requirement)
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected server error occurred.' 
      : err.message
  });
});

// Start Server only if executed directly (e.g. node src/server.js)
const isDirectExecution = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectExecution) {
  app.listen(PORT, () => {
    console.log(`🚀 Task Manager API running at http://localhost:${PORT}`);
    console.log(`🩺 Health check available at http://localhost:${PORT}/api/health`);
  });
}

export default app;

