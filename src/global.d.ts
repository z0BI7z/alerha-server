declare global {
  declare module "express" {
    export interface Request {
      additionalErrorInfo?: any;
      userId?: string;
      apiKeyId?: string;
    }
  }
}
