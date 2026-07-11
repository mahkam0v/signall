import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const SALT_ROUNDS = 10;

export const hashPassword = (plainPassword) => bcrypt.hash(plainPassword, SALT_ROUNDS);

export const verifyPassword = (plainPassword, passwordHash) =>
  bcrypt.compare(plainPassword, passwordHash);

export const signToken = (user) =>
  jwt.sign({ sub: user.id, username: user.username }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

export const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET);