import { Request, Response, NextFunction } from 'express';
import { notificationServices } from '../services';

export async function receiveMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { apiKey: apiKeyId } = req.query as { apiKey: string };

    const { message } = req.body;

    const newMessage = await notificationServices.createMessage({ apiKeyId, message });

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