import { Request, Response, NextFunction } from "express";
import { apiKeyServices } from "../services";

export async function getApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId!;

    const apiKey = await apiKeyServices.getApiKey(userId);

    res.status(200).json({
      message: "Successfully retrieved api key.",
      apiKey: apiKey._id,
      document: apiKey,
    });
  } catch (error) {
    next(error);
  }
}

export async function createApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId!;

    const apiKey = await apiKeyServices.createApiKey(userId);

    res.status(200).json({
      message: "Successfully created api key.",
      apiKey: apiKey._id,
      document: apiKey,
    });
  } catch (error) {
    next(error);
  }
}
