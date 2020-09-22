declare global {
  declare module "express" {
    export interface Request {
      userId?: string;
    }
  }
}
