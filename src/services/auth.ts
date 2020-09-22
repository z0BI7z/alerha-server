import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import moment from 'moment';
import { jwtSecret, jwtRefreshSecret } from '../config';
import { HttpError, User, IUser, RefreshToken, IRefreshToken } from '../models';

export interface DecodedToken {
  userId: string;
  email: string;
  expiration: Date;
}
export interface DecodedRefreshToken {
  userId: string;
  email: string;
  expiration: Date;
}

// Create a new token and refresh token.
async function generateTokenAndRefreshToken(user: IUser) {
  const token = jwt.sign({
    userId: user._id,
    email: user.email,
    expiration: moment().add(1, 'hour').toDate(),
  }, jwtSecret, {
    expiresIn: '1h',
  });

  const refreshTokenExpiration = moment().add(1, 'year').toDate();
  const refreshToken = jwt.sign({
    userId: user._id,
    email: user.email,
    expiration: refreshTokenExpiration,
  }, jwtRefreshSecret, {
    expiresIn: '1y',
  });
  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiration: refreshTokenExpiration,
  } as IRefreshToken);

  return {
    token,
    refreshToken,
  }
}

// Handle sign up.
export async function signUp({ email, password }: { email: string; password: string }) {
  try {
    const userWithMatchedEmail = await User.findOne({
      email,
    });

    if (userWithMatchedEmail) {
      const error = new HttpError('Email is already in use.', 409);
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      email,
      passwordHash,
    } as IUser);

    const { token, refreshToken } = await generateTokenAndRefreshToken(newUser);

    return {
      token,
      refreshToken,
      user: newUser,
    };

  } catch (error) {
    throw error;
  }
}

// Handle login.
export async function login({ email, password }: { email: string; password: string }) {
  try {
    const user = await User.findOne({
      email,
    });

    if (!user) {
      const error = new HttpError('Email is not in use.', 404);
      throw error;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      const error = new HttpError('Invalid password.', 401);
      throw error;
    }

    const { token, refreshToken } = await generateTokenAndRefreshToken(user);

    return {
      token,
      refreshToken,
      user,
    };

  } catch (error) {
    throw error;
  }
}

// Generate a new token from the refresh token.
export async function refreshToken(token: string) {
  try {
    const refreshToken = await RefreshToken.findOne({
      token,
    }).populate('user');

    if (!refreshToken) {
      const error = new HttpError('Invalid refresh token.', 401);
      throw error;
    }

    if (moment(refreshToken.expiration).isBefore(moment())) {
      const error = new HttpError('Expired refresh token.', 401);
      throw error;
    }

    const { _id, email } = refreshToken.user as IUser;

    const newToken = jwt.sign({
      userId: _id,
      email,
      expiration: moment().add(1, 'hour').toDate(),
    }, jwtSecret, {
      expiresIn: '1h',
    });

    return newToken;

  } catch (error) {
    throw error;
  }
}

// Delete a specific refresh token.
export async function deleteRefreshToken(token: string) {
  try {
    await RefreshToken.findOneAndDelete({
      token,
    });
  } catch (error) {
    throw error;
  }
}

// Delete all refresh tokens for a user.
export async function deleteUserRefreshTokens(token: string) {
  try {
    const { email } = jwt.verify(token, jwtSecret) as DecodedToken;
    const user = await User.findOne({
      email,
    });

    if (!user) {
      const error = new HttpError('Email not in use.', 404);
      throw error;
    }

    await RefreshToken.deleteMany({
      user,
    });

  } catch (error) {
    throw error;
  }
}

// Reset email.
export async function resetEmail({ token, newEmail }: { token: string, newEmail: string }) {
  try {
    const { userId } = jwt.verify(token, jwtSecret) as DecodedToken;

    const user = await User.findById(userId);

    if (!user) {
      const error = new HttpError('Email is not in use.', 404);
      throw error;
    }

    const userWithMatchedEmail = await User.findOne({
      email: newEmail,
    });

    if (userWithMatchedEmail) {
      const error = new HttpError('Email is already in use.', 409);
      throw error;
    }

    user.email = newEmail;
    await user.save();

    await RefreshToken.deleteMany({
      user,
    });

    const { token: newToken, refreshToken: newRefreshToken } = await generateTokenAndRefreshToken(user);

    return {
      user,
      token: newToken,
      refreshToken: newRefreshToken,
    };

  } catch (error) {
    throw error;
  }
}

// Get all users.
export async function getUsers() {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return users;
  } catch (error) {
    throw error;
  }
}