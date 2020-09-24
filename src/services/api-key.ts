import { apiKeyController } from "../controllers";
import { HttpError, User, ApiKey } from "../models";

export async function getApiKey(userId: string) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new HttpError("No user found with id.", 401);
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
      const error = new HttpError("No user found with id.", 401);
      throw error;
    }

    const existingapiKey = await ApiKey.findOne({
      user: user,
    });

    if (existingapiKey) {
      const error = new HttpError(
        "An api key already exists for this user.",
        409
      );
      throw error;
    }

    const newapiKey = await ApiKey.create({
      user,
    });

    return newapiKey;
  } catch (error) {
    throw error;
  }
}
