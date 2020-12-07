import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CLIENT_URL, jwtSecret, SG_MAIL_SENDER } from '../config';
import sgMail from '../loaders/sendgrid-mail';
import { HttpError, User } from '../models';
import { authServices } from '../services';

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      email,
      password,
      recaptchaToken,
    }: { email: string; password: string; recaptchaToken: string } = req.body;
    const { token, refreshToken, user } = await authServices.signUp({
      email,
      password,
      recaptchaToken,
    });

    res.status(200).json({
      message: 'Successfully signed up user.',
      token,
      refreshToken,
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const { token, refreshToken, user } = await authServices.login({
      email,
      password,
    });

    res.status(200).json({
      message: 'Successfully logged in user.',
      token,
      refreshToken,
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken: string = req.body.refreshToken!;

    await authServices.deleteRefreshToken(refreshToken);

    res.status(200).json({
      message: 'Successfully logged out user.',
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken: string = req.body.refreshToken!;

    const newToken = await authServices.refreshToken(refreshToken);

    res.status(200).json({
      message: 'Successfully refreshed token.',
      token: newToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUserRefreshTokens(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId!;

    await authServices.deleteUserRefreshTokens(userId);

    res.status(200).json({
      message: 'Successfully deleted refresh tokens.',
    });
  } catch (error) {
    next(error);
  }
}

export async function resetEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId!;
    const newEmail: string = req.body.newEmail!;

    const {
      user,
      token: newToken,
      refreshToken: newRefreshToken,
    } = await authServices.resetEmail({ userId, newEmail });

    res.status(200).json({
      message: 'Successfully updated email.',
      user,
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId!;
    const {
      password,
      newPassword,
    }: { password: string; newPassword: string } = req.body;

    await authServices.confirmPassword({ userId, password });

    const {
      user,
      token: newToken,
      refreshToken: newRefreshToken,
    } = await authServices.resetPassword({ userId, newPassword });

    res.status(200).json({
      message: 'Successfully updated password.',
      user,
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await authServices.getUsers();

    res.status(200).json({
      message: 'Successfully got users.',
      users,
    });
  } catch (error) {
    next(error);
  }
}

export async function postForgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const email = <string>req.body.email;

    const user = await User.findOne({ email });
    if (!user) {
      throw new HttpError(`No user exists with email ${email}.`, 404);
    }

    const resetToken = jwt.sign({ email }, jwtSecret, {
      expiresIn: '15m',
    });

    user.resetToken = resetToken;
    await user.save();

    const resetUrl = `${CLIENT_URL}/account/reset/password/${resetToken}`;

    const msg = {
      to: email,
      from: SG_MAIL_SENDER,
      subject: 'Reset Password',
      html: `
        <p>Please reset your password using the following link: <p>
        <a href="${resetUrl}">${resetUrl}</a>
      `,
    };
    await sgMail.send(msg);

    res.status(200).send();
  } catch (error) {
    next(error);
  }
}

export async function getCheckResetPasswordToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const resetToken = <string>req.query.resetToken;

    const user = await User.findOne({ resetToken });
    if (!user) {
      throw new HttpError(`No user exists with given reset token.`, 404);
    }

    const { exp } = jwt.verify(resetToken, jwtSecret) as {
      exp: number;
    };

    if (Date.now() - exp * 1000 > 0) {
      throw new HttpError(`Reset token expired.`, 404);
    }

    res.status(200).send();
  } catch (error) {
    next(error);
  }
}

export async function postResetPasswordUsingResetToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { resetToken, newPassword } = <
      { resetToken: string; newPassword: string }
    >req.body;

    const user = await User.findOne({ resetToken });
    if (!user) {
      throw new HttpError(`No user exists with given reset token.`, 404);
    }

    const { exp } = jwt.verify(resetToken, jwtSecret) as {
      exp: number;
    };

    if (Date.now() - exp * 1000 > 0) {
      throw new HttpError(`Reset token expired.`, 404);
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    user.passwordHash = newPasswordHash;
    user.resetToken = undefined;
    await user.save();

    res.status(200).send();
  } catch (error) {
    next(error);
  }
}
