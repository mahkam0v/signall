import { Router } from 'express';
import { listAnime, findAnimeBySlug, listGenres } from '../repositories/animeRepository.js';

export const animeRoutes = Router();

animeRoutes.get('/', async (req, res, next) => {
  try {
    const { search, genre, page, limit } = req.query;
    const result = await listAnime({
      search,
      genre,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 24,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// DIQQAT: bu route "/:slug" dan OLDIN turishi kerak, aks holda Express
// "genres" so'zini slug parametri deb qabul qilib qo'yadi.
animeRoutes.get('/genres', async (req, res, next) => {
  try {
    const genres = await listGenres();
    res.json({ genres });
  } catch (err) {
    next(err);
  }
});

animeRoutes.get('/:slug', async (req, res, next) => {
  try {
    const anime = await findAnimeBySlug(req.params.slug);
    if (!anime) {
      return res.status(404).json({ error: 'Anime topilmadi.' });
    }
    res.json({ anime });
  } catch (err) {
    next(err);
  }
});