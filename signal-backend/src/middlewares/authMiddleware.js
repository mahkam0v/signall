import { verifyToken } from '../services/authService.js';

// Himoyalangan route'lar uchun: "Authorization: Bearer <token>" header'ini tekshiradi.
export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: "Avtorizatsiya talab qilinadi (token yo'q)." });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token yaroqsiz yoki muddati o'tgan." });
  }
};
