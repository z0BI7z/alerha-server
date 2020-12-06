import { Router } from 'express';
import { authController } from '../controllers';
import {
  isAuth,
  schemas,
  validateBodyWithSchemas,
  validateQueryWithSchemas,
} from '../middleware';

const router = Router();

router.post('/signup', authController.signUp);

router.post('/login', authController.login);

router.post('/signout', isAuth, authController.logout);

// router.get("/users", authController.getUsers);

router.post('/refresh-token', authController.refreshToken);

router.delete('/refresh-token', isAuth, authController.deleteUserRefreshTokens);

router.post('/reset-email', isAuth, authController.resetEmail);

router.post('/reset-password', isAuth, authController.resetPassword);

router.post(
  '/forgot-password',
  validateBodyWithSchemas([schemas.emailSchema]),
  authController.postForgotPassword
);

router.get(
  '/check-reset-password-token',
  validateQueryWithSchemas([schemas.resetTokenSchema]),
  authController.getCheckResetPasswordToken
);

router.post(
  '/reset-password-using-reset-token',
  validateBodyWithSchemas([
    schemas.resetTokenSchema,
    schemas.newPasswordSchema,
  ]),
  authController.postResetPasswordUsingResetToken
);

router.get('/secret', isAuth, (req, res) => {
  res.json({
    message: 'success',
  });
});

export default router;
