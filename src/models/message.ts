import { Schema, model, Document } from 'mongoose';
import { IUser } from '.';

export interface IMessage extends Document {
  message: string;
  user: Schema.Types.ObjectId | IUser;
}

const messageSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

export const Message = model<IMessage>('Message', messageSchema);

Message.ensureIndexes();