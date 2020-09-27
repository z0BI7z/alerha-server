import { Types } from "mongoose";
import moment from "moment";
import { TypedHttpError, HttpError, Message, User } from "../models";
import { IMessage } from "../models";
import { ErrorTypes } from "../config";

export async function getMessages({
  userId,
  amount,
  skip,
}: {
  userId: string;
  amount: number;
  skip: number;
}) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new TypedHttpError(
        "Invalid user id.",
        ErrorTypes.NO_USER_WITH_USERID,
        404
      );
      throw error;
    }

    const messages = await Message.find({ user })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(amount);

    return messages;
  } catch (error) {
    throw error;
  }
}

export async function createMessage({
  apiKeyId,
  userId,
  message,
}: {
  apiKeyId: string;
  userId: string;
  message: string;
}) {
  try {
    if (!message || message.length > 280) {
      const error = new HttpError("Invalid message.", 422);
      throw error;
    }

    const user = new Types.ObjectId(userId);

    const newMessage = await Message.create({
      message,
      user,
    } as IMessage);

    return newMessage;
  } catch (error) {
    throw error;
  }
}

export async function deleteMessages({
  userId,
  date,
}: {
  userId: string;
  date?: string;
}) {
  const user = new Types.ObjectId(userId);

  try {
    let deletedMessages;

    if (!date) {
      deletedMessages = await Message.deleteMany({ user });
    } else {
      const parsedDate = moment(date).toDate();
      deletedMessages = await Message.deleteMany({
        user,
        createdAt: { $lte: parsedDate },
      });
    }

    return deletedMessages;
  } catch (error) {
    throw error;
  }
}
