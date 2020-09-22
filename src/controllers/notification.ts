import { Request, Response, NextFunction } from 'express';
import { notificationServices } from '../services';
import { getIoInstance } from '../loaders';

export async function newMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { apiKey: apiKeyId } = req.query as { apiKey: string };

    const { message } = req.body;

    const newMessage = await notificationServices.createMessage({ apiKeyId, message });

    const io = getIoInstance();
    io.to(req.userId!).emit('new-message', newMessage.message);

    res.status(200).json({
      message: 'Successfully created new message.',
      newMessage,
    });

  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: 'Failed to create new message.',
      error: error.message,
    });
  }
}