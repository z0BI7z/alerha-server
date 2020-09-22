import { Schema, model, Document } from "mongoose";
import { IUser } from ".";

export interface IApiKey extends Document {
  user: Schema.Types.ObjectId | IUser;
}

const apiKeySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

export const ApiKey = model<IApiKey>("ApiKey", apiKeySchema);

ApiKey.ensureIndexes();
