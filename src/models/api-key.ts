import { Schema, Types, model, Document } from "mongoose";
import { IUser } from ".";

export interface IApiKey extends Document {
  user: Types.ObjectId | IUser;
}

const apiKeySchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

export const ApiKey = model<IApiKey>("ApiKey", apiKeySchema);

ApiKey.ensureIndexes();
