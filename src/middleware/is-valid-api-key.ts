import { Request, Response, NextFunction } from "express";
import { TypedHttpError, ApiKey } from "../models";
import { ErrorTypes } from "../config";

export async function isValidApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { apiKey: apiKeyId } = req.query;

    if (!apiKeyId) {
      const error = new TypedHttpError(
        "No api key provided",
        ErrorTypes.NO_API_KEY_PROVIDED,
        404
      );
      throw error;
    }

    const apiKey = await ApiKey.findById(apiKeyId);

    if (!apiKey) {
      const error = new TypedHttpError(
        "Invalid api key",
        ErrorTypes.INVALID_API_KEY,
        401
      );
      throw error;
    }

    req.apiKeyId = apiKeyId as string;
    req.userId = apiKey.user.toString();

    next();
  } catch (error) {
    next(error);
  }
}
