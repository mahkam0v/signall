const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
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
  // eski bug: bitta anime bitta kanalda bitta qism uchun bir nechta yozuv bo'lib qolardi.
  // Shu UNIQUE cheklov bilan ON CONFLICT (upsert) mantig'i saqlanadi.
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
