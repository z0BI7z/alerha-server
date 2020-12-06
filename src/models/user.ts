import { Document, model, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  resetToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    resetToken: {
      type: String,
      unique: true,
      sparse: true,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>('User', userSchema);

User.ensureIndexes();
