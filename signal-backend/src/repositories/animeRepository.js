import { AppDataSource } from '../db/data-source.js';
import { Anime } from '../db/entities/Anime.js';

const getAnimeRepo = () => AppDataSource.getRepository(Anime);

// Bosh sahifadagi grid uchun: qidiruv, janr filter va sahifalash bilan ro'yxat.
export const listAnime = async ({ search, genre, page = 1, limit = 24 } = {}) => {
  const repo = getAnimeRepo();
  const qb = repo.createQueryBuilder('anime');

  if (search) {
    qb.andWhere('anime.title ILIKE :search', { search: `%${search}%` });
  }
  if (genre) {
    qb.andWhere('anime.genre ILIKE :genre', { genre: `%${genre}%` });
  }

  qb.orderBy('anime.updatedAt', 'DESC');
  qb.skip((page - 1) * limit).take(limit);
  qb.loadRelationCountAndMap('anime.channelsCount', 'anime.channels');

  const [items, total] = await qb.getManyAndCount();
  return { items, total, page: Number(page), limit: Number(limit) };
};

// Anime detali - kanallar ro'yxati bilan birga.
export const findAnimeBySlug = async (slug) => {
  const repo = getAnimeRepo();
  const anime = await repo.findOne({
    where: { slug },
    relations: { channels: true },
  });
  if (!anime) return null;

  const channels = [...anime.channels].sort((a, b) => a.id - b.id);
  return { ...anime, channels };
};

// Kategoriya chip'lari uchun: bazada haqiqatda mavjud janrlar ro'yxati.
// "genre" ustuni erkin matn ("Jangari, Drama" kabi vergul bilan) bo'lgani
// uchun bo'lib, tozalab, dublikatsiz ro'yxat qilib qaytaramiz.
export const listGenres = async () => {
  const repo = getAnimeRepo();
  const rows = await repo.find({ select: { genre: true } });

  const set = new Set();
  rows.forEach((row) => {
    if (!row.genre) return;
    row.genre.split(',').forEach((piece) => {
      const trimmed = piece.trim();
      if (trimmed) set.add(trimmed);
    });
  });

  return [...set].sort((a, b) => a.localeCompare(b));
};
