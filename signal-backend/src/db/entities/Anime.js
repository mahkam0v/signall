import { EntitySchema } from 'typeorm';

// MUHIM: bu entity signal-bot loyihasidagi Anime entity bilan AYNAN bir xil
// bo'lishi kerak. "anime" jadvalini bot yaratadi va yozadi, backend esa shu
// jadvalni faqat o'qiydi (ba'zan yangilaydi). Agar ikkalasi mos kelmasa,
// TypeORM synchronize() jadvalni kutilmagan tarzda o'zgartirib qo'yishi mumkin.
export const Anime = new EntitySchema({
  name: 'Anime',
  tableName: 'anime',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    title: {
      type: 'text',
      nullable: false,
    },
    slug: {
      type: 'text',
      nullable: false,
      unique: true,
    },
    genre: {
      type: 'text',
      nullable: true,
    },
    // Telegram file_id (faqat bot ichida ishlatiladi, sayt uchun kerak emas).
    photo: {
      type: 'text',
      nullable: true,
    },
    // Saytda ko'rsatiladigan haqiqiy rasm manzili (masalan "/uploads/naruto-123.jpg").
    photoUrl: {
      name: 'photo_url',
      type: 'text',
      nullable: true,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamptz',
      updateDate: true,
    },
  },
  relations: {
    channels: {
      type: 'one-to-many',
      target: 'Channel',
      inverseSide: 'anime',
    },
  },
});
