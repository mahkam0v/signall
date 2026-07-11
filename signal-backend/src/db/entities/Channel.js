import { EntitySchema } from 'typeorm';

// MUHIM: signal-bot'dagi Channel entity bilan AYNAN bir xil bo'lishi kerak
// (izoh uchun Anime.js faylidagi eslatmaga qara).
export const Channel = new EntitySchema({
  name: 'Channel',
  tableName: 'channels',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    channel: {
      type: 'text',
      nullable: false,
    },
    quality: {
      type: 'text',
      nullable: true,
    },
    episode: {
      type: 'text',
      nullable: true,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true,
    },
  },
  relations: {
    anime: {
      type: 'many-to-one',
      target: 'Anime',
      joinColumn: { name: 'anime_id' },
      inverseSide: 'channels',
      nullable: false,
      onDelete: 'CASCADE',
    },
  },
  uniques: [
    {
      name: 'UQ_channels_anime_channel_episode',
      columns: ['anime', 'channel', 'episode'],
    },
  ],
  indices: [
    {
      name: 'idx_channels_anime_id',
      columns: ['anime'],
    },
  ],
});
