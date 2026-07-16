import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { env } from './config/env.js';
import { authRoutes } from './routes/authRoutes.js';
import { animeRoutes } from './routes/animeRoutes.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const app = express();

app.use(cors());
app.use(express.json());

const uploadsPath = path.resolve(__dirname, '..', env.UPLOADS_DIR);
app.use('/uploads', express.static(uploadsPath));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/anime', animeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);