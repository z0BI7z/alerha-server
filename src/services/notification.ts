import { HttpError, ApiKey, Message } from '../models';

export async function createMessage({ apiKeyId, message }: { apiKeyId: string; message: string }) {
  try {
    if (!message || message.length > 280) {
      const error = new HttpError('Invalid message.', 422);
      throw error;
    }

    const apiKey = await ApiKey.findById(apiKeyId);

    if (!apiKey) {
      const error = new HttpError('Invalid api key.', 401);
      throw error;
    }

    const newMessage = await Message.create({
      message,
      user: apiKey.user
    });

    return newMessage;

  } catch (error) {
    throw error;
  }
}