import { config } from "dotenv";
export * as ErrorTypes from "./error-types";

config();

process.env.NODE_ENV = process.env.NODE_ENV || "development";

export const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
export const databaseUrl =
  process.env.MONGODB_URI || "mongodb://localhost/alerha";

export const jwtSecret = process.env.JWT_SECRET || "jwt-secret";
export const jwtRefreshSecret =
  process.env.JWT_REFRESH_SECRET || "jwt-refresh-secret";

export const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET || "";
export const RECAPTCHA_VALID_HOST = process.env.RECAPTCHA_VALID_HOST || "";
