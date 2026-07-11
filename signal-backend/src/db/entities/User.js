import { EntitySchema } from 'typeorm';

// Bu jadval faqat backend'ga tegishli - bot bilan hech qanday aloqasi yo'q.
// Oddiy login/register uchun yetarli: username + parolning hash'i.
export const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    username: {
      type: 'text',
      nullable: false,
      unique: true,
    },
    passwordHash: {
      name: 'password_hash',
      type: 'text',
      nullable: false,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true,
    },
  },
});
