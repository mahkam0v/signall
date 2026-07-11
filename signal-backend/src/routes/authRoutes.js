import { Router } from 'express';
import { findUserByUsername, createUser } from '../repositories/userRepository.js';
import { hashPassword, verifyPassword, signToken } from '../services/authService.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

export const authRoutes = Router();

authRoutes.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username va password majburiy.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Parol kamida 6 belgidan iborat bo'lishi kerak." });
    }

    const existing = await findUserByUsername(username);
    if (existing) {
      return res.status(409).json({ error: 'Bu username allaqachon band.' });
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({ username, passwordHash });
    const token = signToken(user);

    res.status(201).json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    next(err);
  }
});

authRoutes.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'username va password majburiy.' });
    }

    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Username yoki parol noto'g'ri." });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Username yoki parol noto'g'ri." });
    }

    const token = signToken(user);
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    next(err);
  }
});

// Himoyalangan: token orqali "men kimman" so'rovi (frontend sahifa ochilganda
// tokenni tekshirib, header'da username ko'rsatish uchun ishlatiladi).
authRoutes.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await findUserByUsername(req.user.username);
    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi.' });
    }
    res.json({ user: { id: user.id, username: user.username } });
  } catch (err) {
    next(err);
  }
});
