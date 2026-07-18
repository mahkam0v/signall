import { AppDataSource } from '../db/data-source.js';
import Anime from '../db/entities/Anime.js';
import Channel from '../db/entities/Channel.js';
import { slugify } from '../services/postParser.js';

function animeRepo() {
  return AppDataSource.getRepository(Anime);
}

function channelRepo() {
  return AppDataSource.getRepository(Channel);
}

// Anime'ni saqlaydi. Agar shu slug bilan anime allaqachon mavjud bo'lsa - yangilaydi
// (eski bug: JSON versiyada genre/photo faqat birinchi safar saqlanardi, keyingi
// postlarda yangi genre yoki rasm kelsa ham eskisi qolib ketardi).
async function upsertAnime({ title, genre, photo, photoUrl }) {
  const slug = slugify(title);
  const repo = animeRepo();

  let anime = await repo.findOne({ where: { slug } });

  if (anime) {
    anime.title = title;
    anime.genre = genre || anime.genre;
    anime.photo = photo || anime.photo;
    anime.photoUrl = photoUrl || anime.photoUrl;
  } else {
    anime = repo.create({
      title,
      slug,
      genre: genre || null,
      photo: photo || null,
      photoUrl: photoUrl || null,
    });
  }

  return repo.save(anime);
}

// Kanal yozuvini qo'shadi/yangilaydi.
// (eski bug: har safar "Saqlash" bosilganda channels massiviga qayta-qayta bir xil
// kanal qo'shilaverardi - endi UNIQUE(anime_id, channel, episode) tufayli mavjud
// yozuv topilib, faqat sifat ma'lumoti yangilanadi, dublikat qo'shilmaydi.)
async function upsertChannel({ animeId, channel, quality, episode }) {
  const repo = channelRepo();

  const existing = await repo.findOne({
    where: {
      anime: { id: animeId },
      channel,
      episode: episode || null,
    },
  });

  if (existing) {
    existing.quality = quality || null;
    await repo.save(existing);
    return;
  }

  const created = repo.create({
    anime: { id: animeId },
    channel,
    quality: quality || null,
    episode: episode || null,
  });
  await repo.save(created);
}

export async function saveParsedPost({ title, genre, photo, photoUrl, channel, quality, episode }) {
  const anime = await upsertAnime({ title, genre, photo, photoUrl });
  await upsertChannel({ animeId: anime.id, channel, quality, episode });
  return anime;
}

export async function findBySlug(title) {
  const slug = slugify(title);
  const repo = animeRepo();

  const anime = await repo.findOne({
    where: { slug },
    relations: { channels: true },
  });

  if (!anime) return null;

  const channels = [...anime.channels]
    .sort((a, b) => a.id - b.id)
    .map(({ channel, quality, episode }) => ({ channel, quality, episode }));

  const { channels: _omit, ...animeFields } = anime;
  return { ...animeFields, channels };
}

export async function listAll() {
  const repo = animeRepo();
  const rows = await repo.find({
    select: { title: true },
    order: { title: 'ASC' },
  });
  return rows;
}

export async function deleteBySlug(title) {
  const slug = slugify(title);
  const repo = animeRepo();
  const result = await repo.delete({ slug });
  return (result.affected || 0) > 0;
}
