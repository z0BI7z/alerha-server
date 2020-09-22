import { Request, Response, NextFunction } from "express";
import { TypedHttpError, HttpError } from "../models";

function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof TypedHttpError) {
    res.status(error.statusCode).json({
      type: error.type,
      message: error.message,
    });
  } else if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
  } else {
    res.status(500).json({
      message: error.message || "Unknown error",
    });
  }
}

export default errorHandler;
