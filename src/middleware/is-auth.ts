import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import moment from "moment";
import { authServices } from "../services";
import { HttpError } from "../models";
import { jwtSecret, ErrorTypes } from "../config";

export function isAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.body;

    const { userId, expiration } = jwt.verify(
      token,
      jwtSecret
    ) as authServices.DecodedToken;

    if (moment(expiration).isBefore(moment())) {
      const error = new HttpError("Invalid token.", 401);
      throw error;
    }

    req.userId = userId;

    next();
  } catch (error) {
    console.log(error);

    res.json({
      type: ErrorTypes.INVALID_TOKEN,
      error,
    });
  }
}
