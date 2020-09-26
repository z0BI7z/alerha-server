import { Request, Response, NextFunction } from "express";
import { TypedHttpError, HttpError } from "../models";

function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error.message);

  if (error instanceof TypedHttpError) {
    res.status(error.statusCode).json({
      ...req.additionalErrorInfo,
      type: error.type,
      message: error.message,
    });
  } else if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      ...req.additionalErrorInfo,
      message: error.message,
    });
  } else {
    res.status(500).json({
      ...req.additionalErrorInfo,
      message: error.message || "Unknown error",
    });
  }
}

export default errorHandler;
