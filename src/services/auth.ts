import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { HttpError, User } from '../models';

export async function signUp({ email, password }: { email: String; password: String }) {
  try {
    const userWithMatchedEmail = await User.findOne({
      email
    });
    if (userWithMatchedEmail) {
      const error = new HttpError('Email already in use.', 409);
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      email,
      passwordHash,
    });

    return newUser;

  } catch (error) {
    throw error;
  }
}