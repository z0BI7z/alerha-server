import { apiKeyController } from "../controllers";
import { TypedHttpError, HttpError, User, ApiKey } from "../models";
import { ErrorTypes } from "../config";

export async function getApiKey(userId: string) {
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

    const apiKey = await ApiKey.findOne({
      user: user,
    });

    if (!apiKey) {
      const error = new HttpError("User does not have an api key.", 404);
      throw error;
    }

    return apiKey;
  } catch (error) {
    throw error;
  }
}

export async function createApiKey(userId: string) {
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

    const existingapiKey = await ApiKey.findOne({
      user: user,
    });

    if (existingapiKey) {
      // const error = new HttpError(
      //   "An api key already exists for this user.",
      //   409
      // );
      // throw error;
      await existingapiKey.remove();
    }

    const newapiKey = await ApiKey.create({
      user,
    });

    return newapiKey;
  } catch (error) {
    throw error;
  }
}
