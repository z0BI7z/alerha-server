import { Request, Response, NextFunction } from 'express';
import { AuthServices } from '../services';

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await AuthServices.signUp({ email, password });
    res.status(200).json({
      message: 'Successfully signed up user.',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(error.statusCode).json({
      message: `Failed to sign up user. Error: ${error.message}`
    });
  }
}