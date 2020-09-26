import { Request, Response, NextFunction } from "express";
import { notificationServices } from "../services";
import { getIoInstance } from "../loaders";

export async function getMessages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.userId!;
    const amount: number = Number(req.query.amount) || 20;
    const skip: number = Number(req.query.skip) || 0;
    const messages = await notificationServices.getMessages({
      userId,
      amount,
      skip,
    });
    res.status(200).json({
      message: "Successfully got messages.",
      messages,
    });
  } catch (error) {
    next(error);
  }
}

export async function createMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKeyId = req.apiKeyId!;
  const userId = req.userId!;
  const { message }: { message: string } = req.body;
  const tempId = req.query.tempId;

  try {
    const newMessage = await notificationServices.createMessage({
      apiKeyId,
      userId,
      message,
    });

    const io = getIoInstance();
    io.to(req.userId!).emit("new-message", { newMessage, tempId });

    res.status(200).json({
      message: "Successfully created new message.",
      newMessage,
    });
  } catch (error) {
    if (tempId) {
      req.additionalErrorInfo = { tempId };
    }
    next(error);
  }
}
