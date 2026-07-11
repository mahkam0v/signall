const { EntitySchema } = require('typeorm');

// TypeORM decoratorlarsiz (EntitySchema) - loyiha CommonJS bo'lgani uchun
// bu usul eng qulay va TypeScript/Babel talab qilmaydi.
module.exports = new EntitySchema({
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
    // Telegram file_id (faqat bot ichida ctx.replyWithPhoto uchun ishlatiladi).
    photo: {
      type: 'text',
      nullable: true,
    },
    // Saytda ko'rsatish uchun haqiqiy public URL/path (masalan "/uploads/naruto-123.jpg").
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
