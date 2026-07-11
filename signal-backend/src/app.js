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

// signal-bot yuklagan rasmlar (masalan "/uploads/naruto-123.jpg") shu orqali
// to'g'ridan-to'g'ri frontendga xizmat qiladi.
const uploadsPath = path.resolve(__dirname, '..', env.UPLOADS_DIR);
app.use('/uploads', express.static(uploadsPath));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>{
  console.log(`server muvoffaqyatli ulandi: ${PORT}`);
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/anime', animeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
