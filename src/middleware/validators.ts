import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const emailSchema = Joi.object({
  email: Joi.string().email().required(),
}).unknown();

const resetTokenSchema = Joi.object({
  resetToken: Joi.string().required(),
}).unknown();

const newPasswordSchema = Joi.object({
  newPassword: Joi.string().required(),
}).unknown();

export function validateBodyWithSchemas(schemas: Joi.ObjectSchema[]) {
  const validationHandler = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      await Promise.all(
        schemas.map((schema) => schema.validateAsync(req.body))
      );
      next();
    } catch (error) {
      next(error);
    }
  };
  return validationHandler;
}

export function validateQueryWithSchemas(schemas: Joi.ObjectSchema[]) {
  const validationHandler = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      await Promise.all(
        schemas.map((schema) => schema.validateAsync(req.query))
      );
      next();
    } catch (error) {
      next(error);
    }
  };
  return validationHandler;
}

export const schemas = {
  resetTokenSchema,
  emailSchema,
  newPasswordSchema,
};
