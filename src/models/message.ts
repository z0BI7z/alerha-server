import { Schema, Types, model, Document } from "mongoose";
import { IUser } from ".";

export interface IMessage extends Document {
  message: string;
  user: Types.ObjectId | IUser;
  createdAt: Date;
}

const messageSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export const Message = model<IMessage>("Message", messageSchema);

Message.ensureIndexes();
