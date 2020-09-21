import { Schema, model, Document } from 'mongoose';
import { IUser } from '.';

export interface IRefreshToken extends Document {
  token: string;
  user: Schema.Types.ObjectId | IUser;
  createdAt: Date;
  expiration: Date;
}

const refreshTokenSchema = new Schema({
  token: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 60 * 60 * 24 * 365,
  },
  expiration: {
    type: Date,
    required: true,
  },
}, {
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
});

export const RefreshToken = model<IRefreshToken>('RefreshToken', refreshTokenSchema);

RefreshToken.ensureIndexes();