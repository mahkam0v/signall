import { AppDataSource } from '../db/data-source.js';
import { User } from '../db/entities/User.js';

const getUserRepo = () => AppDataSource.getRepository(User);

export const findUserByUsername = async (username) => {
  const repo = getUserRepo();
  return repo.findOne({ where: { username } });
};

export const createUser = async ({ username, passwordHash }) => {
  const repo = getUserRepo();
  const user = repo.create({ username, passwordHash });
  return repo.save(user);
};
