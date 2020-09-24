import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import moment from "moment";
import { authServices } from "../services";
import { TypedHttpError } from "../models";
import { jwtSecret, ErrorTypes } from "../config";

export function isAuth(req: Request, res: Response, next: NextFunction) {
  try {
    let token;

    const authHeader = req.get("Authorization");
    if (!authHeader) {
      const error = new TypedHttpError(
        "No token provided.",
        ErrorTypes.INVALID_TOKEN,
        401
      );
      throw error;
    }

    token = authHeader.split(" ")[1];

    if (!token) {
      const error = new TypedHttpError(
        "No token provided.",
        ErrorTypes.INVALID_TOKEN,
        401
      );
      throw error;
    }

    const { userId, expiration } = jwt.verify(
      token,
      jwtSecret
    ) as authServices.DecodedToken;

    if (moment(expiration).isBefore(moment())) {
      const error = new TypedHttpError(
        "Invalid token.",
        ErrorTypes.INVALID_TOKEN,
        401
      );
      throw error;
    }

    req.userId = userId;

    next();
  } catch (error) {
    console.log(error);

    throw error;
  }
}
