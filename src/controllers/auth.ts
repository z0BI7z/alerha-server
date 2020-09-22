import { Request, Response, NextFunction } from "express";
import { authServices } from "../services";

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
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
    throw error;
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
    throw error;
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;

    await authServices.deleteRefreshToken(refreshToken);

    res.status(200).json({
      message: "Successfully logged out user.",
    });
  } catch (error) {
    throw error;
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { refreshToken } = req.body;

    const newToken = await authServices.refreshToken(refreshToken);

    res.status(200).json({
      message: "Successfully refreshed token.",
      token: newToken,
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteUserRefreshTokens(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { token } = req.body;

    await authServices.deleteUserRefreshTokens(token);

    res.status(200).json({
      message: "Successfully deleted refresh tokens.",
    });
  } catch (error) {
    throw error;
  }
}

export async function resetEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { token, newEmail } = req.body;

    const {
      user,
      token: newToken,
      refreshToken: newRefreshToken,
    } = await authServices.resetEmail({ token, newEmail });

    res.status(200).json({
      message: "Successfully updated email.",
      user,
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    throw error;
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
    throw error;
  }
}
