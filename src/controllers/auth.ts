import { Request, Response, NextFunction } from "express";
import { authServices } from "../services";

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    const { token, refreshToken, user } = await authServices.signUp({
      email,
      password,
    });

    res.status(200).json({
      message: "Successfully signed up user.",
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
      message: "Successfully logged in user.",
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
      message: "Successfully logged out user.",
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
      message: "Successfully refreshed token.",
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
      message: "Successfully deleted refresh tokens.",
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
    const password: string = req.body.password!;

    await authServices.confirmPassword({ userId, password });

    const {
      user,
      token: newToken,
      refreshToken: newRefreshToken,
    } = await authServices.resetEmail({ userId, newEmail });

    res.status(200).json({
      message: "Successfully updated email.",
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
      message: "Successfully updated password.",
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
      message: "Successfully got users.",
      users,
    });
  } catch (error) {
    next(error);
  }
}
